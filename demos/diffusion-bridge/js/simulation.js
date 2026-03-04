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
        let ddbmBaselinePaths = null;

        // Notation: z_0 = y (target at t=0), z_T ≈ x (source at t=T)
        // Pairs: x from source, y from target
        for (let p = 0; p < cfg.paths; p++) {
            const x = sourceDist.sample();
            const y = targetDist.sample();
            pairs.push({ x, y });

            // DBIM uses deterministic ODE paths (no noise)
            const useDeterministic = (cfg.modelType === 'dbim');
            const path = useDeterministic
                ? BridgeMathUtils.generatePathDeterministic(cfg.modelType, y, x, t, cfg.sigmaMax)
                : BridgeMathUtils.generatePath(cfg.modelType, y, x, t, cfg.sigmaMax);
            bridgePaths.push(path);
        }

        // Optional: faint DDBM baseline for DBIM comparison
        if (cfg.modelType === 'dbim') {
            ddbmBaselinePaths = [];
            const nBaseline = Math.min(5, Math.floor(cfg.paths / 4));
            for (let p = 0; p < nBaseline; p++) {
                const pair = pairs[p % pairs.length];
                const path = BridgeMathUtils.generatePath('ddbm', pair.y, pair.x, t, cfg.sigmaMax);
                ddbmBaselinePaths.push(path);
            }
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
            ddbmBaselinePaths,
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

// Universal module export: works in browser <script>, CommonJS, and AMD
(function (root, factory) {
    var cls = factory();
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cls;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return cls; });
    }
    if (typeof window !== 'undefined') {
        window.BridgeSimulationGenerator = cls;
    }
}(typeof self !== 'undefined' ? self : this, function () { return BridgeSimulationGenerator; }));
