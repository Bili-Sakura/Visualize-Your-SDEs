/**
 * Configuration Manager for SDE Visualization
 * Handles all configuration options and provides presets
 */

class ConfigManager {
    constructor() {
        this.config = {
            // Simulation Parameters
            steps: 200,
            paths: 20,
            T: 4.0,
            dt: 0.02,
            xRange: [-4, 4],
            
            // SDE Type
            sdeType: 'vp', // 'vp', 've', 'subvp'
            
            // Initial Distribution
            initialDist: 'bimodal', // 'bimodal', 'uniform', 'single'
            
            // Visual Settings
            colorScheme: 'rainbow', // 'rainbow', 'viridis', 'plasma', 'monochrome'
            showLegend: false,
            showODE: true,
            showSDE: true,
            showHeatmap: true,
            
            // Background
            background: 'white', // 'white', 'dark', 'academic'
        };
    }

    // SDE Equation Definitions
    getSDE(type) {
        const equations = {
            vp: {
                name: 'Variance Preserving (VP-SDE)',
                drift: (x, t) => -0.5 * x,
                diffusion: (t) => 1.0,
                muDecay: (t) => Math.exp(-0.5 * t),
                variance: (t) => 1 - Math.exp(-t),
                formula: '$dx = -\\frac{1}{2}x dt + dw$',
                reverseFormula: '$dx = [-\\frac{1}{2}x - \\nabla\\log p(x)]dt + dw$'
            },
            ve: {
                name: 'Variance Exploding (VE-SDE)',
                drift: (x, t) => 0,
                diffusion: (t) => Math.sqrt(2 * t + 1),
                muDecay: (t) => 1,
                variance: (t) => t * t,
                formula: '$dx = \\sqrt{2t+1} dw$',
                reverseFormula: '$dx = -\\sqrt{2t+1} \\nabla\\log p(x) dt + \\sqrt{2t+1} dw$'
            },
            subvp: {
                name: 'Sub-VP SDE',
                drift: (x, t) => -0.25 * x,
                diffusion: (t) => 0.8,
                muDecay: (t) => Math.exp(-0.25 * t),
                variance: (t) => 0.64 * (1 - Math.exp(-0.5 * t)),
                formula: '$dx = -\\frac{1}{4}x dt + 0.8 dw$',
                reverseFormula: '$dx = [-\\frac{1}{4}x - 0.64\\nabla\\log p(x)]dt + 0.8 dw$'
            }
        };
        return equations[type] || equations.vp;
    }

    // Initial Distribution Definitions
    getInitialDistribution(type) {
        const distributions = {
            bimodal: {
                name: 'Bimodal Gaussian',
                sample: () => (Math.random() < 0.5 ? -2 : 2) + (Math.random() - 0.5) * 0.5,
                pdf: (x, mu, sigma) => {
                    const normPdf = (x, m, s) => 
                        (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - m) / s) ** 2);
                    return 0.5 * normPdf(x, -2 * mu, sigma) + 0.5 * normPdf(x, 2 * mu, sigma);
                }
            },
            uniform: {
                name: 'Uniform Distribution',
                sample: () => (Math.random() - 0.5) * 4,
                pdf: (x, mu, sigma) => {
                    const bound = 2 * mu;
                    return (Math.abs(x) <= Math.abs(bound)) ? 1 / (4 * Math.abs(bound)) : 0;
                }
            },
            single: {
                name: 'Single Gaussian',
                sample: () => (Math.random() - 0.5) * 0.5,
                pdf: (x, mu, sigma) => {
                    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x / sigma) ** 2);
                }
            },
            trimodal: {
                name: 'Trimodal Gaussian',
                sample: () => {
                    const r = Math.random();
                    const center = r < 1/3 ? -2 : (r < 2/3 ? 0 : 2);
                    return center + (Math.random() - 0.5) * 0.5;
                },
                pdf: (x, mu, sigma) => {
                    const normPdf = (x, m, s) =>
                        (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - m) / s) ** 2);
                    return (normPdf(x, -2 * mu, sigma) + normPdf(x, 0, sigma) + normPdf(x, 2 * mu, sigma)) / 3;
                }
            },
            asymmetric: {
                name: 'Asymmetric Bimodal',
                sample: () => (Math.random() < 0.7 ? -2 : 2) + (Math.random() - 0.5) * 0.5,
                pdf: (x, mu, sigma) => {
                    const normPdf = (x, m, s) =>
                        (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - m) / s) ** 2);
                    return 0.7 * normPdf(x, -2 * mu, sigma) + 0.3 * normPdf(x, 2 * mu, sigma);
                }
            },
            laplace: {
                name: 'Laplace (Heavy Tails)',
                sample: () => {
                    const u = Math.random() - 0.5;
                    const b = 0.8;
                    return u < 0 ? b * Math.log(1 + 2 * u) : -b * Math.log(1 - 2 * u);
                },
                pdf: (x, mu, sigma) => {
                    const b = 0.8;
                    const s0Sq = 2 * b * b;
                    const effSigma = Math.sqrt(sigma * sigma + s0Sq * mu * mu);
                    return (1 / (effSigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x / effSigma) ** 2);
                }
            },
            wide: {
                name: 'Wide Gaussian',
                sample: () => (Math.random() - 0.5) * 4,
                pdf: (x, mu, sigma) => {
                    const s0 = 1.2;
                    const effSigma = Math.sqrt(sigma * sigma + s0 * s0 * mu * mu);
                    return (1 / (effSigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x / effSigma) ** 2);
                }
            }
        };
        return distributions[type] || distributions.bimodal;
    }

    // Color Scheme Definitions
    getColorScheme(scheme) {
        const schemes = {
            rainbow: {
                name: 'Rainbow',
                getColor: (i, total) => {
                    const hue = (i / total) * 360;
                    return `hsla(${hue}, 70%, 60%, 0.7)`;
                },
                heatmap: 'Viridis',
                dataColor: '#440154',
                priorColor: '#21918c'
            },
            viridis: {
                name: 'Viridis',
                getColor: (i, total) => {
                    const colors = ['#440154', '#31688e', '#35b779', '#fde724'];
                    const idx = Math.floor((i / total) * (colors.length - 1));
                    return colors[idx] + 'b3';
                },
                heatmap: 'Viridis',
                dataColor: '#440154',
                priorColor: '#35b779'
            },
            plasma: {
                name: 'Plasma',
                getColor: (i, total) => {
                    const colors = ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'];
                    const idx = Math.floor((i / total) * (colors.length - 1));
                    return colors[idx] + 'b3';
                },
                heatmap: 'Plasma',
                dataColor: '#0d0887',
                priorColor: '#f89540'
            },
            monochrome: {
                name: 'Monochrome',
                getColor: (i, total) => {
                    const intensity = 50 + (i / total) * 30;
                    return `hsla(220, 70%, ${intensity}%, 0.7)`;
                },
                heatmap: 'Greys',
                dataColor: '#2c3e50',
                priorColor: '#7f8c8d'
            }
        };
        return schemes[scheme] || schemes.rainbow;
    }

    // Get background style
    getBackgroundStyle(bg) {
        const styles = {
            white: {
                paper: '#ffffff',
                plot: 'rgba(0,0,0,0)',
                text: '#333'
            },
            dark: {
                paper: '#1a1a1a',
                plot: 'rgba(0,0,0,0)',
                text: '#f0f0f0'
            },
            academic: {
                paper: '#fafafa',
                plot: 'rgba(0,0,0,0)',
                text: '#000'
            }
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

// Export for use in other modules
window.ConfigManager = ConfigManager;
