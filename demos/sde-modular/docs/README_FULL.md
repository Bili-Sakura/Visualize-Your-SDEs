# SDE Visualization - Modular Version

An interactive visualization tool for Stochastic Differential Equations (SDEs) used in diffusion models. This modular version provides better maintainability, readability, and extensive customization options.

## 🎯 Features

### Multiple SDE Types
- **VP-SDE (Variance Preserving)**: `dx = -½x dt + dw`
- **VE-SDE (Variance Exploding)**: `dx = √(2t+1) dw`
- **Sub-VP SDE**: `dx = -¼x dt + 0.8 dw`

### Initial Distribution Options
- **Bimodal Gaussian**: Two peaks at ±2
- **Uniform Distribution**: Flat distribution
- **Single Gaussian**: Centered at origin

### Customization Options
- **Trajectory Control**: Adjust number of paths (5-50) and time steps (50-400)
- **Color Schemes**: Rainbow, Viridis, Plasma, Monochrome
- **Background Styles**: White, Dark, Academic
- **Toggle Elements**: Show/hide ODE paths, SDE paths, heatmap, and legends

## 📁 Project Structure

```
sde-modular/
├── index.html              # Main HTML file
├── README.md              # This file
├── css/
│   └── styles.css         # All styling and UI design
└── js/
    ├── config.js          # Configuration management
    ├── math.js            # Mathematical utilities
    ├── simulation.js      # Data generation
    ├── visualization.js   # Plotly rendering
    └── controls.js        # UI interactions
```

## 🏗️ Architecture

### 1. ConfigManager (`config.js`)
Manages all configuration options and provides presets for:
- SDE equation definitions with drift and diffusion functions
- Initial distribution sampling and PDF functions
- Color scheme definitions
- Background style settings

### 2. MathUtils (`math.js`)
Mathematical utilities including:
- Probability density functions (Normal, etc.)
- Random number generation (Box-Muller, CLT approximation)
- Euler-Maruyama method for SDE integration
- Analytical density computation
- Helper functions (linspace, lerp, clamp)

### 3. SimulationGenerator (`simulation.js`)
Generates simulation data:
- Stochastic SDE paths using Euler-Maruyama
- Deterministic ODE paths
- Analytical density evolution (heatmaps)
- Marginal distributions

### 4. VisualizationManager (`visualization.js`)
Handles Plotly rendering:
- Creates all trace objects
- Manages 5-panel layout
- Applies color schemes and styling
- Updates annotations and formulas dynamically

### 5. ControlsManager (`controls.js`)
Manages UI interactions:
- Event listeners for all controls
- Debounced updates for performance
- State management
- Loading indicators

## 🚀 Usage

### Basic Setup
1. Open `index.html` in a modern web browser
2. No build process or server required!
3. All dependencies loaded via CDN

### Controls
- **Paths Slider**: Number of stochastic trajectories (5-50)
- **Steps Slider**: Time discretization (50-400 steps)
- **SDE Type Dropdown**: Select equation type
- **Initial Dist Dropdown**: Choose starting distribution
- **Colors Dropdown**: Select color scheme
- **Background Dropdown**: Change background style
- **Toggle Switches**: Show/hide visualization elements
- **Regenerate Button**: Generate new random trajectories
- **Reset Button**: Return to default settings

### Programmatic Access
All managers are accessible via `window.app` for debugging and advanced usage:

```javascript
// Access configuration
console.log(window.app.config.getAll());

// Change settings programmatically
window.app.config.update('paths', 30);
window.app.controls.regenerate();

// Get current SDE info
const sde = window.app.config.getSDE('vp');
console.log(sde.formula);
```

## 🎨 Customization Guide

### Adding a New SDE Type

1. Edit `js/config.js`, add to `getSDE()` method:

```javascript
newsde: {
    name: 'My New SDE',
    drift: (x, t) => /* your drift function */,
    diffusion: (t) => /* your diffusion function */,
    muDecay: (t) => /* mean evolution */,
    variance: (t) => /* variance evolution */,
    formula: 'dx = ... dt + ... dw',
    reverseFormula: 'dx = [...] dt + ... dw'
}
```

2. Add option to `index.html`:
```html
<option value="newsde">My New SDE</option>
```

### Adding a New Color Scheme

Edit `js/config.js`, add to `getColorScheme()` method:

```javascript
myscheme: {
    name: 'My Scheme',
    getColor: (i, total) => /* return color string */,
    heatmap: 'Viridis', // Plotly colorscale
    dataColor: '#color1',
    priorColor: '#color2'
}
```

### Adding a New Initial Distribution

Edit `js/config.js`, add to `getInitialDistribution()` method:

```javascript
mydist: {
    name: 'My Distribution',
    sample: () => /* return random sample */,
    pdf: (x, mu, sigma) => /* return probability density */
}
```

## 📊 Technical Details

### SDE Integration
Uses Euler-Maruyama method with adaptive diffusion:
```
x(t+dt) = x(t) + f(x,t)·dt + g(t)·dW
```
where `dW ~ N(0, dt)`

### Analytical Density
Computed using the convolution of initial distribution with the time-evolved kernel based on Fokker-Planck equation solutions.

### Performance Optimization
- Uses `scattergl` for fast rendering of many paths
- Debounced updates (300ms) to prevent excessive recomputation
- Responsive layout with minimal redraws

## 🔧 Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported (requires ES6)

## 📝 License

This is an educational tool for understanding diffusion models and SDEs. Feel free to modify and extend for your own use.

## 🤝 Contributing

To extend this project:
1. Add new modules in `js/` directory
2. Follow the existing class-based architecture
3. Export classes via `window.ClassName`
4. Update this README with your additions

## 📚 References

- Song, Y., et al. "Score-Based Generative Modeling through Stochastic Differential Equations" (2021)
- Ho, J., et al. "Denoising Diffusion Probabilistic Models" (2020)
- Ornstein-Uhlenbeck Process and Fokker-Planck Equation

## 💡 Tips

1. **Performance**: Reduce steps/paths for real-time interaction
2. **Visual Clarity**: Use monochrome scheme for publication-ready figures
3. **Understanding**: Toggle ODE to see deterministic flow vs stochastic paths
4. **Comparison**: Switch between SDE types to see different diffusion behaviors

---

**Version**: 2.0.0  
**Last Updated**: January 2026
