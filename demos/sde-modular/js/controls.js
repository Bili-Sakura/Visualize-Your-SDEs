/**
 * Control Panel Manager
 * Handles all UI interactions and updates
 */

class ControlsManager {
    constructor(configManager, simulationGenerator, visualizationManager) {
        this.config = configManager;
        this.simulator = simulationGenerator;
        this.visualizer = visualizationManager;
        this.isUpdating = false;
        
        this.initializeControls();
        this.attachEventListeners();
    }

    /**
     * Initialize all control elements
     */
    initializeControls() {
        // Set initial values
        document.getElementById('paths-slider').value = this.config.get('paths');
        document.getElementById('paths-value').textContent = this.config.get('paths');
        
        document.getElementById('steps-slider').value = this.config.get('steps');
        document.getElementById('steps-value').textContent = this.config.get('steps');
        
        document.getElementById('sde-select').value = this.config.get('sdeType');
        document.getElementById('initial-dist-select').value = this.config.get('initialDist');
        document.getElementById('color-scheme-select').value = this.config.get('colorScheme');
        document.getElementById('background-select').value = this.config.get('background');
        
        this.updateToggle('legend-toggle', this.config.get('showLegend'));
        this.updateToggle('ode-toggle', this.config.get('showODE'));
        this.updateToggle('sde-toggle', this.config.get('showSDE'));
        this.updateToggle('heatmap-toggle', this.config.get('showHeatmap'));
    }

    /**
     * Attach event listeners to all controls
     */
    attachEventListeners() {
        // Sliders
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

        // Selects
        document.getElementById('sde-select').addEventListener('change', (e) => {
            this.config.update('sdeType', e.target.value);
            this.scheduleUpdate();
        });

        document.getElementById('initial-dist-select').addEventListener('change', (e) => {
            this.config.update('initialDist', e.target.value);
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

        // Toggles
        document.getElementById('legend-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showLegend');
        });

        document.getElementById('ode-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showODE');
        });

        document.getElementById('sde-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showSDE');
        });

        document.getElementById('heatmap-toggle').addEventListener('click', (e) => {
            this.toggleControl(e.target, 'showHeatmap');
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetToDefaults();
        });

        // Regenerate button
        document.getElementById('regenerate-btn').addEventListener('click', () => {
            this.regenerate();
        });
    }

    /**
     * Toggle control handler
     */
    toggleControl(element, configKey) {
        const newValue = !this.config.get(configKey);
        this.config.update(configKey, newValue);
        this.updateToggle(element.id, newValue);
        this.scheduleUpdate();
    }

    /**
     * Update toggle UI
     */
    updateToggle(elementId, isActive) {
        const element = document.getElementById(elementId);
        if (isActive) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }

    /**
     * Schedule update with debouncing
     */
    scheduleUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        this.updateTimeout = setTimeout(() => {
            this.regenerate();
        }, 300); // 300ms debounce
    }

    /**
     * Regenerate visualization
     */
    regenerate() {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        this.showLoading(true);
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                const simData = this.simulator.generate();
                this.visualizer.render(simData);
            } catch (error) {
                console.error('Error regenerating visualization:', error);
                alert('Error generating visualization. Please try different settings.');
            } finally {
                this.isUpdating = false;
                this.showLoading(false);
            }
        }, 50);
    }

    /**
     * Reset to default settings
     */
    resetToDefaults() {
        this.config = new ConfigManager();
        this.simulator.updateConfig(this.config);
        this.initializeControls();
        this.regenerate();
    }

    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
        const indicator = document.getElementById('loading-indicator');
        if (show) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }
}

// Export
window.ControlsManager = ControlsManager;
