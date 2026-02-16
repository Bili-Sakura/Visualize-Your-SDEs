/**
 * Simulation Generator for Diffusion Bridge
 * Supports multiple bridge types via BridgeMathUtils
 */

class BridgeSimulationGenerator {
    constructor(configManager) {
        this.config = configManager;
    }

    generate() {
        const cfg = this.config.getAll();
        const sourceDist = this.config.getSourceDistribution();
        const targetDist = this.config.getTargetDistribution();
        
        // Generate time and spatial grids
        const t = BridgeMathUtils.linspace(0, cfg.T, cfg.steps);
        const xGrid = BridgeMathUtils.linspace(cfg.xRange[0], cfg.xRange[1], 100);

        const bridgePaths = [];
        const pairs = [];
        
        // Sample pairs and generate paths
        for (let p = 0; p < cfg.paths; p++) {
            const x = sourceDist.sample();
            const y = targetDist.sample();
            pairs.push({ x, y });
            
            // Generate path for this pair using the selected model
            // BridgeMathUtils now handles the specific logic for each model
            const path = BridgeMathUtils.generatePath(cfg.modelType, x, y, t, cfg.sigmaMax);
            bridgePaths.push(path);
        }

        // Compute density using the Monte Carlo samples (pairs)
        // This gives a more accurate heatmap than just using means
        const densityZ = BridgeMathUtils.computeDensity(
            cfg.modelType,
            xGrid,
            t,
            pairs, // We use the sampled pairs to estimate the density
            cfg.sigmaMax
        );

        // Compute marginals for reference
        const sourceMarginal = xGrid.map(x => sourceDist.pdf(x));
        const targetMarginal = xGrid.map(x => targetDist.pdf(x));

        return {
            t,
            xGrid,
            densityZ,
            bridgePaths,
            sourceMarginal,
            targetMarginal,
            sourceX: pairs.reduce((s, p) => s + p.x, 0) / pairs.length,
            targetY: pairs.reduce((s, p) => s + p.y, 0) / pairs.length
        };
    }

    updateConfig(configManager) {
        this.config = configManager;
    }
}

window.BridgeSimulationGenerator = BridgeSimulationGenerator;
