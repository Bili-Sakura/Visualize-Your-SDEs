/**
 * Configuration Manager for Diffusion Bridge Visualization
 * Based on DDBM: z_t = a_t·x + b_t·y + σ_t·ε, z_0 = y, z_T ≈ x
 */

class BridgeConfigManager {
    constructor() {
        this.config = {
            steps: 200,
            paths: 20,
            T: 1.0,
            dt: 0.005,
            xRange: [-4, 4],
            sigmaMax: 0.8,
            sourceDist: 'trimodal',
            targetDist: 'single',
            sourceCenter: -2,
            targetCenter: 2,
            sourceSpread: 0.5,
            targetSpread: 0.5,
            modelType: 'dbim',
            colorScheme: 'plasma',
            showLegend: false,
            showHeatmap: true,
            showMeanPath: true,
            background: 'academic'
        };
    }

    getSourceDistribution() {
        return this.getDistribution(this.config.sourceDist, this.config.sourceCenter, this.config.sourceSpread);
    }

    getTargetDistribution() {
        return this.getDistribution(this.config.targetDist, this.config.targetCenter, this.config.targetSpread);
    }

    getDistribution(type, center, spread) {
        const dists = {
            single: {
                name: 'Single Point',
                sample: () => center,
                pdf: (x) => (1 / (0.15 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - center) / 0.15) ** 2)
            },
            bimodal: {
                name: 'Bimodal',
                sample: () => (Math.random() < 0.5 ? -2 : 2) + (Math.random() - 0.5) * spread,
                pdf: (x) => {
                    const n = (v, m, s) => (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((v - m) / s) ** 2);
                    return 0.5 * n(x, -2, spread) + 0.5 * n(x, 2, spread);
                }
            },
            uniform: {
                name: 'Uniform',
                sample: () => (Math.random() - 0.5) * 4,
                pdf: (x) => (Math.abs(x) <= 2) ? 0.25 : 0
            },
            gaussian: {
                name: 'Gaussian',
                sample: () => {
                    let sum = 0;
                    for (let i = 0; i < 12; i++) sum += Math.random();
                    return center + spread * (sum - 6);
                },
                pdf: (x) => (1 / (spread * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - center) / spread) ** 2)
            },
            trimodal: {
                name: 'Trimodal',
                sample: () => {
                    const r = Math.random();
                    const c = r < 1/3 ? -2 : (r < 2/3 ? 0 : 2);
                    return c + (Math.random() - 0.5) * spread;
                },
                pdf: (x) => {
                    const n = (v, m, s) => (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((v - m) / s) ** 2);
                    return (n(x, -2, spread) + n(x, 0, spread) + n(x, 2, spread)) / 3;
                }
            }
        };
        return dists[type] || dists.single;
    }

    getColorScheme(scheme) {
        const schemes = {
            rainbow: {
                name: 'Rainbow',
                getColor: (i, total) => {
                    const t = Math.max(1, total);
                    const hue = (i / t) * 360;
                    return `hsla(${hue}, 70%, 60%, 0.7)`;
                },
                heatmap: 'Viridis',
                sourceColor: '#e74c3c',
                targetColor: '#3498db'
            },
            viridis: {
                name: 'Viridis',
                getColor: (i, total) => {
                    const colors = ['#440154', '#31688e', '#35b779', '#fde724'];
                    const t = Math.max(1, total);
                    const idx = Math.min(Math.floor((i / t) * colors.length), colors.length - 1);
                    return colors[idx] + 'b3';
                },
                heatmap: 'Viridis',
                sourceColor: '#440154',
                targetColor: '#35b779'
            },
            plasma: {
                name: 'Plasma',
                getColor: (i, total) => {
                    const colors = ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'];
                    const t = Math.max(1, total);
                    const idx = Math.min(Math.floor((i / t) * colors.length), colors.length - 1);
                    return colors[idx] + 'b3';
                },
                heatmap: 'Plasma',
                sourceColor: '#0d0887',
                targetColor: '#f89540'
            },
            monochrome: {
                name: 'Monochrome',
                getColor: (i, total) => {
                    const t = Math.max(1, total);
                    const intensity = 50 + (i / t) * 30;
                    return `hsla(220, 70%, ${intensity}%, 0.7)`;
                },
                heatmap: 'Greys',
                sourceColor: '#2c3e50',
                targetColor: '#7f8c8d'
            }
        };
        return schemes[scheme] || schemes.rainbow;
    }

    getBackgroundStyle(bg) {
        const styles = {
            white: { paper: '#ffffff', plot: 'rgba(0,0,0,0)', text: '#333' },
            dark: { paper: '#1a1a1a', plot: 'rgba(0,0,0,0)', text: '#f0f0f0' },
            academic: { paper: '#fafafa', plot: 'rgba(0,0,0,0)', text: '#000' }
        };
        return styles[bg] || styles.white;
    }

    update(key, value) {
        if (key in this.config) {
            this.config[key] = value;
            if (key === 'steps') {
                this.config.dt = this.config.T / this.config.steps;
            }
            return true;
        }
        return false;
    }

    get(key) {
        return this.config[key];
    }

    getAll() {
        return { ...this.config };
    }
}

window.BridgeConfigManager = BridgeConfigManager;
