/**
 * Simulation Generator for SDE Visualization
 * Generates all data needed for the visualization
 */

class SimulationGenerator {
    constructor(configManager) {
        this.config = configManager;
    }

    /**
     * Main generation function
     */
    generate() {
        const cfg = this.config.getAll();
        const sde = this.config.getSDE(cfg.sdeType);
        const initialDist = this.config.getInitialDistribution(cfg.initialDist);

        // Time and space grids
        const t = MathUtils.linspace(0, cfg.T, cfg.steps);
        const xGrid = MathUtils.linspace(cfg.xRange[0], cfg.xRange[1], 100);

        // Generate analytical density (heatmap)
        const densityZ = MathUtils.computeDensity(
            xGrid, 
            t, 
            sde.muDecay, 
            sde.variance, 
            initialDist.pdf
        );

        // Generate SDE paths (stochastic trajectories)
        const sdePaths = this.generateSDEPaths(cfg, sde, initialDist);

        // Generate ODE paths (deterministic trajectories)
        const odePaths = this.generateODEPaths(cfg, sde, initialDist);

        // Compute marginal distributions
        const marginalData = MathUtils.computeInitialMarginal(xGrid, initialDist);
        const marginalPrior = MathUtils.computePriorMarginal(xGrid);

        return {
            t,
            xGrid,
            densityZ,
            sdePaths,
            odePaths,
            marginalData,
            marginalPrior,
            sde
        };
    }

    /**
     * Generate stochastic SDE paths
     */
    generateSDEPaths(cfg, sde, initialDist) {
        const paths = [];
        
        for (let p = 0; p < cfg.paths; p++) {
            const x0 = initialDist.sample();
            const path = MathUtils.eulerMaruyama(
                x0,
                sde.drift,
                sde.diffusion,
                cfg.dt,
                cfg.steps
            );
            paths.push(path);
        }
        
        return paths;
    }

    /**
     * Generate deterministic ODE paths
     */
    generateODEPaths(cfg, sde, initialDist) {
        const paths = [];
        const t = MathUtils.linspace(0, cfg.T, cfg.steps);
        
        // Generate a few representative ODE paths
        const initialPoints = this.getRepresentativePoints(cfg.initialDist);
        
        for (const x0 of initialPoints) {
            const path = t.map(time => x0 * sde.muDecay(time));
            paths.push(path);
        }
        
        return paths;
    }

    /**
     * Get representative points for ODE visualization based on initial distribution
     */
    getRepresentativePoints(distType) {
        switch (distType) {
            case 'bimodal':
                return [-2, 2];
            case 'uniform':
                return [-2, 0, 2];
            case 'single':
                return [-1, 0, 1];
            default:
                return [-2, 2];
        }
    }

    /**
     * Update simulation with new configuration
     */
    updateConfig(configManager) {
        this.config = configManager;
    }
}

// Export
window.SimulationGenerator = SimulationGenerator;
