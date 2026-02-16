/**
 * Visualization Manager for SDE Plots
 * Handles all Plotly rendering and layout configuration
 */

class VisualizationManager {
    constructor(containerId, configManager) {
        this.containerId = containerId;
        this.config = configManager;
    }

    /**
     * Main render function
     */
    render(simulationData) {
        const traces = this.buildTraces(simulationData);
        const layout = this.buildLayout(simulationData);
        const plotConfig = { 
            responsive: true, 
            displayModeBar: false,
            includeMathJax: true
        };
        
        Plotly.newPlot(this.containerId, traces, layout, plotConfig);
    }

    /**
     * Build all Plotly traces
     */
    buildTraces(sim) {
        const traces = [];
        const cfg = this.config.getAll();
        const colorScheme = this.config.getColorScheme(cfg.colorScheme);

        // Panel 1: Data Marginal (Left)
        traces.push(this.createMarginalTrace(
            sim.marginalData, 
            sim.xGrid, 
            'x', 
            'y',
            colorScheme.dataColor,
            'p_data',
            true // reversed
        ));

        // Panel 2: Forward Process
        if (cfg.showHeatmap) {
            traces.push(this.createHeatmapTrace(
                sim.densityZ,
                sim.t,
                sim.xGrid,
                'x2',
                colorScheme.heatmap
            ));
        }

        if (cfg.showSDE) {
            sim.sdePaths.forEach((path, i) => {
                traces.push(this.createPathTrace(
                    sim.t,
                    path,
                    'x2',
                    colorScheme.getColor(i, cfg.paths),
                    1.5
                ));
            });
        }

        if (cfg.showODE) {
            sim.odePaths.forEach(path => {
                traces.push(this.createPathTrace(
                    sim.t,
                    path,
                    'x2',
                    'white',
                    3,
                    'ODE Path'
                ));
            });
        }

        // Panel 3: Prior Marginal (Center)
        traces.push(this.createMarginalTrace(
            sim.marginalPrior,
            sim.xGrid,
            'x3',
            'y',
            colorScheme.priorColor,
            'p_prior',
            false
        ));

        // Panel 4: Reverse Process
        if (cfg.showHeatmap) {
            traces.push(this.createHeatmapTrace(
                sim.densityZ,
                sim.t,
                sim.xGrid,
                'x4',
                colorScheme.heatmap
            ));
        }

        if (cfg.showSDE) {
            sim.sdePaths.forEach((path, i) => {
                traces.push(this.createPathTrace(
                    sim.t,
                    path,
                    'x4',
                    colorScheme.getColor(i, cfg.paths),
                    1.5
                ));
            });
        }

        if (cfg.showODE) {
            sim.odePaths.forEach(path => {
                traces.push(this.createPathTrace(
                    sim.t,
                    path,
                    'x4',
                    'white',
                    3
                ));
            });
        }

        // Panel 5: Data Marginal (Right)
        traces.push(this.createMarginalTrace(
            sim.marginalData,
            sim.xGrid,
            'x5',
            'y',
            colorScheme.dataColor,
            'p_data',
            false
        ));

        return traces;
    }

    /**
     * Create marginal distribution trace
     */
    createMarginalTrace(xData, yData, xaxis, yaxis, color, name, reversed) {
        return {
            x: xData,
            y: yData,
            xaxis, yaxis,
            type: 'scatter',
            mode: 'lines',
            line: { color, width: 3 },
            fill: 'tozerox',
            fillcolor: color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#', 'rgba('),
            name,
            showlegend: this.config.get('showLegend'),
            hoverinfo: 'skip'
        };
    }

    /**
     * Create heatmap trace
     */
    createHeatmapTrace(z, x, y, xaxis, colorscale) {
        return {
            z, x, y,
            xaxis,
            yaxis: 'y',
            type: 'heatmap',
            colorscale,
            showscale: false,
            zmin: 0,
            zmax: 0.4,
            hoverinfo: 'skip'
        };
    }

    /**
     * Create path trace (SDE or ODE)
     */
    createPathTrace(x, y, xaxis, color, width, name = null) {
        return {
            x, y,
            xaxis,
            yaxis: 'y',
            type: 'scattergl',
            mode: 'lines',
            line: { color, width },
            name,
            showlegend: name && this.config.get('showLegend'),
            hoverinfo: 'skip'
        };
    }

    /**
     * Build Plotly layout
     */
    buildLayout(sim) {
        const cfg = this.config.getAll();
        const bgStyle = this.config.getBackgroundStyle(cfg.background);
        const sde = sim.sde;

        const commonAxis = {
            showgrid: false,
            zeroline: false,
            showticklabels: false,
            range: [cfg.xRange[0] - 0.2, cfg.xRange[1] + 0.2]
        };

        return {
            paper_bgcolor: bgStyle.paper,
            plot_bgcolor: bgStyle.plot,
            showlegend: cfg.showLegend,
            legend: {
                x: 0.5,
                y: -0.15,
                xanchor: 'center',
                orientation: 'h',
                font: { color: bgStyle.text }
            },
            margin: { l: 20, r: 20, t: 80, b: 50 },

            // Y Axis (shared)
            yaxis: { ...commonAxis, domain: [0, 1] },

            // X Axes (5 panels)
            xaxis: {
                domain: [0, 0.05],
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                autorange: 'reversed'
            },
            xaxis2: {
                domain: [0.06, 0.45],
                showgrid: false,
                zeroline: false,
                showticklabels: false
            },
            xaxis3: {
                domain: [0.46, 0.54],
                showgrid: false,
                zeroline: false,
                showticklabels: false
            },
            xaxis4: {
                domain: [0.55, 0.94],
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                autorange: 'reversed'
            },
            xaxis5: {
                domain: [0.95, 1.0],
                showgrid: false,
                zeroline: false,
                showticklabels: false
            },

            // Annotations
            annotations: this.buildAnnotations(sde, bgStyle.text),

            // Arrows
            shapes: this.buildShapes()
        };
    }

    /**
     * Build text annotations
     */
    buildAnnotations(sde, textColor) {
        const fontStyle = { size: 14, color: textColor };
        const formulaStyle = { size: 16, color: textColor };

        return [
            { text: "Data", x: 0.025, y: 1.1, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: "Forward SDE", x: 0.25, y: 1.1, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: sde.formula, x: 0.25, y: 1.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "Prior", x: 0.5, y: 1.1, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: "Reverse SDE", x: 0.75, y: 1.1, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: sde.reverseFormula, x: 0.75, y: 1.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "Data", x: 0.975, y: 1.1, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            
            // Bottom labels
            { text: "$p_0(x)$", x: 0.025, y: -0.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "$p_t(x)$", x: 0.25, y: -0.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "$p_T(x)$", x: 0.5, y: -0.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "$p_t(x)$", x: 0.75, y: -0.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: "$p_0(x)$", x: 0.975, y: -0.05, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle }
        ];
    }

    /**
     * Build arrow shapes
     */
    buildShapes() {
        return [
            // Forward arrow
            { type: 'line', x0: 0.06, y0: -0.08, x1: 0.45, y1: -0.08, xref: 'paper', yref: 'paper', line: { width: 2 } },
            { type: 'path', path: 'M 0.44 -0.07 L 0.45 -0.08 L 0.44 -0.09', xref: 'paper', yref: 'paper', line: { width: 2 } },
            // Reverse arrow
            { type: 'line', x0: 0.55, y0: -0.08, x1: 0.94, y1: -0.08, xref: 'paper', yref: 'paper', line: { width: 2 } },
            { type: 'path', path: 'M 0.93 -0.07 L 0.94 -0.08 L 0.93 -0.09', xref: 'paper', yref: 'paper', line: { width: 2 } }
        ];
    }

    /**
     * Update visualization
     */
    update(simulationData) {
        this.render(simulationData);
    }
}

// Export
window.VisualizationManager = VisualizationManager;
