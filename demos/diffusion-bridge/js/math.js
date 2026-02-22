/**
 * Mathematical Utilities for Diffusion Bridge
 * Supports multiple bridge types
 */

class BridgeMathUtils {
    static randn() {
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    static linspace(start, end, num) {
        const step = (end - start) / (num - 1);
        return Array.from({ length: num }, (_, i) => start + i * step);
    }

    static normPdf(x, mu, sigma) {
        if (sigma <= 0) return x === mu ? 1e6 : 0;
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    }

    // --- DDBM ---
    // z_t = (1-s)x + s*y + sigma_t*eps
    static getDDBMSchedule(t, T, sigmaMax) {
        const s = t / T;
        const a_t = 1 - s;
        const b_t = s;
        const sigma_t = sigmaMax * Math.sqrt(4 * s * (1 - s));
        return { a_t, b_t, sigma_t };
    }

    // --- I2SB ---
    // Symmetric schedule with specific variance accumulation
    static getI2SBSchedule(t, T, sigmaMax) {
        const s = t / T;
        // Symmetric sigma schedule peaking at 0.5
        // Similar to DDBM but usually sharper or different profile
        // Here we approximate the paper's variance profile
        const sigma_t = sigmaMax * 2 * Math.min(s, 1 - s); 
        
        // Mean interpolation is also symmetric
        // But for x->y transport, it's linear: (1-s)x + s*y
        const a_t = 1 - s;
        const b_t = s;
        
        return { a_t, b_t, sigma_t };
    }

    // --- DDIB ---
    // Source -> Latent (N(0,1)) -> Target
    static getDDIBSchedule(t, T, sigmaMax) {
        const s = t / T;
        let a_t, b_t, sigma_t;
        
        // We simulate x -> 0 -> y
        // Midpoint t=0.5 corresponds to Latent Space z ~ N(0, 1)
        
        if (s <= 0.5) {
            // x -> 0 (Latent)
            // ss goes 0 -> 1
            const ss = s * 2;
            a_t = Math.sqrt(1 - ss); // 1 -> 0
            b_t = 0;
            sigma_t = Math.sqrt(ss); // 0 -> 1
        } else {
            // 0 -> y (Target)
            // ss goes 0 -> 1
            const ss = (s - 0.5) * 2;
            a_t = 0;
            b_t = Math.sqrt(ss); // 0 -> 1
            sigma_t = Math.sqrt(1 - ss); // 1 -> 0
        }
        
        return { a_t, b_t, sigma_t };
    }

    // --- DBIM (Diffusion Bridge Implicit Models) ---
    // From 4th-MAVIC-T: z_t = a_t·x_T + b_t·x_0 + c_t·ε
    // VP schedule: alpha_t, rho_t, rho_bar_t (arxiv.org/abs/2405.15885)
    static getDBIMSchedule(t, T, sigmaMax, betaMin = 0.1, betaD = 2.0) {
        const sigma = (t / Math.max(T, 1e-10)) * sigmaMax;
        const tT = sigmaMax;
        const alphaT = Math.exp(-0.5 * betaMin * tT - 0.25 * betaD * tT * tT);
        const alpha_t = Math.exp(-0.5 * betaMin * sigma - 0.25 * betaD * sigma * sigma);
        const alpha_bar_t = alpha_t / alphaT;
        const rho_t_sq = Math.max(0, Math.exp(betaMin * sigma + 0.5 * betaD * sigma * sigma) - 1);
        const rho_t = Math.sqrt(rho_t_sq);
        const rho_T_sq = Math.max(0, Math.exp(betaMin * tT + 0.5 * betaD * tT * tT) - 1);
        const rho_T = Math.sqrt(rho_T_sq);
        const rho_bar_t_sq = Math.max(0, rho_T_sq - rho_t_sq);
        const rho_bar_t = Math.sqrt(rho_bar_t_sq);
        const a_t = rho_T_sq > 1e-20 ? (alpha_bar_t * rho_t_sq) / rho_T_sq : (sigma >= tT * 0.99 ? 1 : 0);
        const b_t = rho_T_sq > 1e-20 ? (alpha_t * rho_bar_t_sq) / rho_T_sq : (sigma <= 1e-6 ? 1 : 0);
        const c_t = rho_T > 1e-20 ? (alpha_t * rho_bar_t * rho_t) / rho_T : 0;
        return { a_t, b_t, sigma_t: c_t };
    }

    // --- Turbo / CUT ---
    // Direct mapping, low noise
    static getTurboSchedule(t, T, sigmaMax) {
        const s = t / T;
        const a_t = 1 - s;
        const b_t = s;
        // Very low noise, just enough to be visible as a "process"
        const sigma_t = sigmaMax * 0.1 * Math.sin(Math.PI * s);
        return { a_t, b_t, sigma_t };
    }

    /**
     * Generic sample function that delegates to specific schedules
     */
    static sample(type, x, y, t, T, sigmaMax) {
        let schedule;
        switch (type) {
            case 'i2sb':
                schedule = this.getI2SBSchedule(t, T, sigmaMax);
                break;
            case 'ddib':
                schedule = this.getDDIBSchedule(t, T, sigmaMax);
                break;
            case 'turbo':
                schedule = this.getTurboSchedule(t, T, sigmaMax);
                break;
            case 'dbim':
                schedule = this.getDBIMSchedule(t, T, sigmaMax);
                break;
            case 'ddbm':
            default:
                schedule = this.getDDBMSchedule(t, T, sigmaMax);
                break;
        }
        
        const { a_t, b_t, sigma_t } = schedule;
        const eps = this.randn();
        
        // For DDIB, we want the noise to be part of the signal when in latent space
        // But for visualization, just adding noise is fine as long as sigma_t is correct.
        
        return a_t * x + b_t * y + sigma_t * eps;
    }

    static generatePath(type, x, y, tArray, sigmaMax) {
        const T = tArray[tArray.length - 1];
        return tArray.map(t => this.sample(type, x, y, t, T, sigmaMax));
    }

    static computeDensity(type, xGrid, tArray, pairs, sigmaMax) {
        const T = tArray[tArray.length - 1];
        const densityZ = [];

        // Precompute schedules for all t
        const schedules = tArray.map(t => {
            if (type === 'ddbm') return this.getDDBMSchedule(t, T, sigmaMax);
            if (type === 'i2sb') return this.getI2SBSchedule(t, T, sigmaMax);
            if (type === 'ddib') return this.getDDIBSchedule(t, T, sigmaMax);
            if (type === 'turbo') return this.getTurboSchedule(t, T, sigmaMax);
            if (type === 'dbim') return this.getDBIMSchedule(t, T, sigmaMax);
            return this.getDDBMSchedule(t, T, sigmaMax);
        });

        for (const xVal of xGrid) {
            const row = [];
            for (let i = 0; i < tArray.length; i++) {
                const { a_t, b_t, sigma_t } = schedules[i];
                let sumLikelihood = 0;
                
                // Average likelihood over all pairs
                for (const pair of pairs) {
                    const mu = a_t * pair.x + b_t * pair.y;
                    // Add small epsilon to sigma to avoid division by zero
                    const sigma = sigma_t + 0.05; 
                    sumLikelihood += this.normPdf(xVal, mu, sigma);
                }
                
                row.push(sumLikelihood / pairs.length);
            }
            densityZ.push(row);
        }
        return densityZ;
    }
}

window.BridgeMathUtils = BridgeMathUtils;
