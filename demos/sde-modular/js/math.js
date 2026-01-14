/**
 * Mathematical Utilities for SDE Simulation
 * Contains helper functions for probability distributions and numerical methods
 */

class MathUtils {
    /**
     * Standard Normal PDF
     */
    static normPdf(x, mu = 0, sigma = 1) {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * 
               Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    }

    /**
     * Generate approximate normal random variable using Box-Muller transform
     */
    static randn() {
        const u1 = Math.random();
        const u2 = Math.random();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    /**
     * Generate array of approximate normal random variables (faster but less accurate)
     */
    static randnFast() {
        // Central limit theorem approximation
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += Math.random();
        }
        return sum - 6;
    }

    /**
     * Generate approximate normal random with simple method (for Brownian motion)
     */
    static randnSimple() {
        return (Math.random() - 0.5) * 2 * Math.sqrt(3);
    }

    /**
     * Euler-Maruyama method for SDE integration
     * dx = f(x,t)dt + g(t)dw
     */
    static eulerMaruyama(x0, drift, diffusion, dt, steps) {
        const path = [x0];
        let x = x0;
        
        for (let i = 1; i < steps; i++) {
            const t = i * dt;
            const dw = this.randnSimple() * Math.sqrt(dt);
            const f = drift(x, t);
            const g = diffusion(t);
            
            x = x + f * dt + g * dw;
            path.push(x);
        }
        
        return path;
    }

    /**
     * Compute analytical density evolution for VP-SDE with given initial distribution
     */
    static computeDensity(xGrid, tArray, muDecayFunc, varianceFunc, initialPdf) {
        const densityZ = [];
        
        for (let j = 0; j < xGrid.length; j++) {
            const row = [];
            const x = xGrid[j];
            
            for (let i = 0; i < tArray.length; i++) {
                const t = tArray[i];
                const muDecay = muDecayFunc(t);
                const varT = varianceFunc(t);
                const sigmaT = Math.sqrt(varT + 0.05); // numerical stability
                
                const density = initialPdf(x, muDecay, sigmaT);
                row.push(density);
            }
            densityZ.push(row);
        }
        
        return densityZ;
    }

    /**
     * Probability flow ODE (deterministic version of SDE)
     */
    static computeODE(x0Array, muDecayFunc, tArray) {
        return x0Array.map(x0 => 
            tArray.map(t => x0 * muDecayFunc(t))
        );
    }

    /**
     * Compute marginal distribution at time t=0
     */
    static computeInitialMarginal(xGrid, initialDist) {
        const pdf = initialDist.pdf;
        return xGrid.map(x => pdf(x, 1, 0.2));
    }

    /**
     * Compute prior distribution (typically Standard Normal)
     */
    static computePriorMarginal(xGrid) {
        return xGrid.map(x => this.normPdf(x, 0, 1));
    }

    /**
     * Linear interpolation
     */
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Clamp value between min and max
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Generate evenly spaced array
     */
    static linspace(start, end, num) {
        const step = (end - start) / (num - 1);
        return Array.from({ length: num }, (_, i) => start + i * step);
    }

    /**
     * Generate array with function
     */
    static arrayFromFunc(length, func) {
        return Array.from({ length }, (_, i) => func(i));
    }
}

// Export
window.MathUtils = MathUtils;
