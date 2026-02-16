/**
 * Visualization Manager for Diffusion Bridge
 * Layout: Target (y) | Forward Bridge | Source (x)
 */

class BridgeVisualizationManager {
    constructor(containerId, configManager) {
        this.containerId = containerId;
        this.config = configManager;
        this.resizeTimeout = null;
        this.handleWindowResize = this.handleWindowResize.bind(this);
        window.addEventListener('resize', this.handleWindowResize);
    }

    render(sim) {
        const traces = this.buildTraces(sim);
        const layout = this.buildLayout(sim);
        Plotly.newPlot(this.containerId, traces, layout, { 
            responsive: true, 
            displayModeBar: true,
            displaylogo: false,
            includeMathJax: true
        }).then(() => {
            this.triggerResizePasses([0, 80, 240, 600]);
        });
    }

    export(format) {
        const graphDiv = document.getElementById(this.containerId);
        if (!graphDiv || !graphDiv.data) {
            alert('Plot is not ready yet. Please wait a moment and try again.');
            return;
        }

        const config = {
            format: format === 'pdf' ? 'svg' : format,
            filename: `diffusion_bridge_${new Date().getTime()}`,
            width: 1200,
            height: 800,
            scale: 2
        };

        Plotly.downloadImage(graphDiv, config).catch(() => {
            return Plotly.toImage(graphDiv, config).then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${config.filename}.${config.format}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
        }).then(() => {
            if (format === 'pdf') {
                alert('SVG exported. You can save/print this as PDF from your browser.');
            }
        }).catch((error) => {
            console.error('Export failed:', error);
            alert('Export failed. Please try again after the plot finishes rendering.');
        });
    }

    buildTraces(sim) {
        const traces = [];
        const cfg = this.config.getAll();
        const colorScheme = this.config.getColorScheme(cfg.colorScheme);

        // Panel 1: Source marginal (x) - LEFT
        traces.push(this.createMarginalTrace(
            sim.sourceMarginal, sim.xGrid, 'x', 'y',
            colorScheme.sourceColor, 'p(x)', true
        ));

        // Panel 2: Forward Bridge
        if (cfg.showHeatmap) {
            traces.push({
                z: sim.densityZ,
                x: sim.t,
                y: sim.xGrid,
                xaxis: 'x2',
                yaxis: 'y',
                type: 'heatmap',
                colorscale: colorScheme.heatmap,
                showscale: false,
                zmin: 0,
                zmax: 0.5,
                hoverinfo: 'skip'
            });
        }

        sim.bridgePaths.forEach((path, i) => {
            traces.push({
                x: sim.t,
                y: path,
                xaxis: 'x2',
                yaxis: 'y',
                type: 'scattergl',
                mode: 'lines',
                line: { color: colorScheme.getColor(i, cfg.paths), width: 1.5 },
                showlegend: false,
                hoverinfo: 'skip'
            });
        });

        // ODE path (mean trajectory)
        const meanPath = sim.t.map(t => {
            const s = t / sim.t[sim.t.length - 1];
            return (1 - s) * sim.sourceX + s * sim.targetY;
        });
        traces.push({
            x: sim.t,
            y: meanPath,
            xaxis: 'x2',
            yaxis: 'y',
            type: 'scattergl',
            mode: 'lines',
            line: { color: 'white', width: 3 },
            name: 'Mean',
            showlegend: cfg.showLegend,
            hoverinfo: 'skip'
        });

        // Panel 3: Target marginal (y) - RIGHT
        traces.push(this.createMarginalTrace(
            sim.targetMarginal, sim.xGrid, 'x3', 'y',
            colorScheme.targetColor, 'p(y)', false
        ));

        return traces;
    }

    createMarginalTrace(xData, yData, xaxis, yaxis, color, name, reversed) {
        const fillColor = this.withAlpha(color, 0.3);
        return {
            x: xData,
            y: yData,
            xaxis,
            yaxis,
            type: 'scatter',
            mode: 'lines',
            line: { color, width: 3 },
            fill: 'tozerox',
            fillcolor: fillColor,
            name,
            showlegend: this.config.get('showLegend'),
            hoverinfo: 'skip'
        };
    }

    withAlpha(color, alpha) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }
        if (color.includes('hsla')) {
            return color.replace(/,\s*[\d.]+\)\s*$/, `, ${alpha})`);
        }
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        return color;
    }

    buildLayout(sim) {
        const cfg = this.config.getAll();
        const bgStyle = this.config.getBackgroundStyle(cfg.background);

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
                x: 0.5, y: -0.15, xanchor: 'center',
                orientation: 'h', font: { color: bgStyle.text }
            },
            margin: { l: 20, r: 20, t: 100, b: 60 },
            yaxis: { ...commonAxis, domain: [0, 1] },
            xaxis: {
                domain: [0, 0.05],
                showgrid: false, zeroline: false, showticklabels: false,
                autorange: 'reversed'
            },
            xaxis2: {
                domain: [0.06, 0.94],
                showgrid: false, zeroline: false, showticklabels: true,
                title: 't'
            },
            xaxis3: {
                domain: [0.95, 1.0],
                showgrid: false, zeroline: false, showticklabels: false
            },
            annotations: this.buildAnnotations(bgStyle.text),
            shapes: this.buildShapes()
        };
    }

    buildAnnotations(textColor) {
        const fontStyle = { size: 14, color: textColor };
        const formulaStyle = { size: 16, color: textColor };
        const modelType = this.config.get('modelType');
        
        let formulaText = '$z_t = a_t x + b_t y + \\sigma_t \\epsilon$';
        if (modelType === 'i2sb') formulaText = '$x_t \\approx (1-s)x + sy + \\sigma_{sb} \\epsilon$';
        if (modelType === 'ddib') formulaText = '$x \\to \\text{Latent}(z) \\to y$';
        if (modelType === 'turbo') formulaText = '$\\text{Direct Mapping}$';

        return [
            { text: 'Source $x$', x: 0.025, y: 1.12, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: 'Forward Bridge', x: 0.5, y: 1.12, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: formulaText, x: 0.5, y: 1.06, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: 'Target $y$', x: 0.975, y: 1.12, xref: 'paper', yref: 'paper', showarrow: false, font: fontStyle },
            { text: '$z_0 = x$', x: 0.025, y: -0.08, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle },
            { text: '$z_T \\approx y$', x: 0.975, y: -0.08, xref: 'paper', yref: 'paper', showarrow: false, font: formulaStyle }
        ];
    }

    buildShapes() {
        const cfg = this.config.getAll();
        const lineColor = this.config.getBackgroundStyle(cfg.background).text;
        return [
            { type: 'line', x0: 0.06, y0: -0.05, x1: 0.94, y1: -0.05, xref: 'paper', yref: 'paper', line: { width: 2, color: lineColor } },
            { type: 'path', path: 'M 0.92 -0.04 L 0.94 -0.05 L 0.92 -0.06', xref: 'paper', yref: 'paper', line: { width: 2, color: lineColor } }
        ];
    }

    handleWindowResize() {
        this.triggerResize(60);
    }

    triggerResize(delay = 0) {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            const plotEl = document.getElementById(this.containerId);
            if (plotEl && window.Plotly && Plotly.Plots) {
                Plotly.Plots.resize(plotEl);
            }
        }, delay);
    }

    triggerResizePasses(delays = [0, 120, 300]) {
        const plotEl = document.getElementById(this.containerId);
        if (!plotEl || !window.Plotly || !Plotly.Plots) return;

        delays.forEach((delay) => {
            setTimeout(() => {
                Plotly.Plots.resize(plotEl);
            }, delay);
        });
    }
}

window.BridgeVisualizationManager = BridgeVisualizationManager;
