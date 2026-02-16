/**
 * Control Panel Manager for Diffusion Bridge
 */

class BridgeControlsManager {
    constructor(configManager, simulationGenerator, visualizationManager) {
        this.config = configManager;
        this.simulator = simulationGenerator;
        this.visualizer = visualizationManager;
        this.isUpdating = false;
        this.initializeControls();
        this.attachEventListeners();
    }

    initializeControls() {
        document.getElementById('paths-slider').value = this.config.get('paths');
        document.getElementById('paths-value').textContent = this.config.get('paths');
        document.getElementById('steps-slider').value = this.config.get('steps');
        document.getElementById('steps-value').textContent = this.config.get('steps');
        document.getElementById('noise-slider').value = this.config.get('sigmaMax');
        document.getElementById('noise-value').textContent = this.config.get('sigmaMax');
        document.getElementById('model-select').value = this.config.get('modelType');
        document.getElementById('source-dist-select').value = this.config.get('sourceDist');
        document.getElementById('source-pos-slider').value = this.config.get('sourceCenter');
        document.getElementById('source-pos-value').textContent = this.config.get('sourceCenter');
        document.getElementById('target-dist-select').value = this.config.get('targetDist');
        document.getElementById('target-pos-slider').value = this.config.get('targetCenter');
        document.getElementById('target-pos-value').textContent = this.config.get('targetCenter');
        document.getElementById('spread-slider').value = this.config.get('sourceSpread');
        document.getElementById('spread-value').textContent = this.config.get('sourceSpread');
        document.getElementById('color-scheme-select').value = this.config.get('colorScheme');
        document.getElementById('background-select').value = this.config.get('background');
        this.updateToggle('legend-toggle', this.config.get('showLegend'));
        this.updateToggle('heatmap-toggle', this.config.get('showHeatmap'));
    }

    attachEventListeners() {
        document.getElementById('paths-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('paths-value').textContent = value;
            this.config.update('paths', value);
            this.scheduleUpdate();
        });

        document.getElementById('steps-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('steps-value').textContent = value;
            this.config.update('steps', value);
            this.scheduleUpdate();
        });

        document.getElementById('noise-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('noise-value').textContent = value;
            this.config.update('sigmaMax', value);
            this.scheduleUpdate();
        });

        document.getElementById('model-select').addEventListener('change', (e) => {
            this.config.update('modelType', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('source-dist-select').addEventListener('change', (e) => {
            this.config.update('sourceDist', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('source-pos-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('source-pos-value').textContent = value;
            this.config.update('sourceCenter', value);
            this.scheduleUpdate();
        });

        document.getElementById('target-dist-select').addEventListener('change', (e) => {
            this.config.update('targetDist', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('target-pos-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('target-pos-value').textContent = value;
            this.config.update('targetCenter', value);
            this.scheduleUpdate();
        });

        document.getElementById('spread-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('spread-value').textContent = value;
            this.config.update('sourceSpread', value);
            this.config.update('targetSpread', value);
            this.scheduleUpdate();
        });

        document.getElementById('color-scheme-select').addEventListener('change', (e) => {
            this.config.update('colorScheme', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('background-select').addEventListener('change', (e) => {
            this.config.update('background', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('legend-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showLegend');
        });

        document.getElementById('heatmap-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showHeatmap');
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.config = new BridgeConfigManager();
            this.simulator.updateConfig(this.config);
            this.initializeControls();
            this.regenerate();
        });

        document.getElementById('regenerate-btn').addEventListener('click', () => {
            this.regenerate();
        });

        document.getElementById('export-png-btn').addEventListener('click', () => {
            this.visualizer.export('png');
        });

        document.getElementById('export-svg-btn').addEventListener('click', () => {
            this.visualizer.export('svg');
        });

        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            this.visualizer.export('pdf');
        });
    }

    toggleControl(element, configKey) {
        const newValue = !this.config.get(configKey);
        this.config.update(configKey, newValue);
        this.updateToggle(element.id, newValue);
        this.scheduleUpdate();
    }

    updateToggle(elementId, isActive) {
        const el = document.getElementById(elementId);
        el.classList.toggle('active', isActive);
    }

    scheduleUpdate() {
        if (this.updateTimeout) clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => this.regenerate(), 300);
    }

    regenerate() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        this.showLoading(true);
        setTimeout(() => {
            try {
                const simData = this.simulator.generate();
                this.visualizer.render(simData);
            } catch (error) {
                console.error('Error regenerating:', error);
            } finally {
                this.isUpdating = false;
                this.showLoading(false);
            }
        }, 50);
    }

    showLoading(show) {
        const indicator = document.getElementById('loading-indicator');
        indicator.classList.toggle('active', show);
    }
}

window.BridgeControlsManager = BridgeControlsManager;
