# Quick Start Guide

## 🚀 Get Started in 30 Seconds

1. **Open the file**
   ```
   Double-click: demos/sde-modular/index.html
   ```
   Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   # Then visit: http://localhost:8000/demos/sde-modular/
   ```

2. **See the visualization**
   - 5 panels showing data → forward process → prior → reverse process → data
   - Colorful trajectories showing stochastic paths
   - White lines showing deterministic paths
   - Heatmap showing probability density evolution

3. **Play with controls**
   - Move the **Paths** slider → See more/fewer trajectories
   - Change **SDE Type** → See different equations in action
   - Try different **Colors** → Find your favorite style

## 🎯 5-Minute Tutorial

### Understanding the Visualization

**What you're seeing:**
```
[Data] → [Forward Diffusion] → [Noise] → [Reverse Diffusion] → [Data]
  p₀    →    Destroy info     →   p_T  →   Recreate info     →   p₀
```

**The 5 Panels:**
1. **Left Panel**: Initial data distribution (e.g., two peaks)
2. **Second Panel**: Forward process - data transforms to noise over time
3. **Center Panel**: Pure noise (Standard Normal distribution)
4. **Fourth Panel**: Reverse process - noise transforms back to data
5. **Right Panel**: Reconstructed data distribution

### Core Concepts

**🎨 Colored Jagged Lines (SDE Paths)**
- These are **stochastic** (random) trajectories
- Each line is one sample path following the SDE equation
- Randomness comes from Brownian motion (dw term)
- Like a drunk person walking - random but following a trend

**⚪ White Smooth Lines (ODE Paths)**
- These are **deterministic** (no randomness) trajectories  
- Show the average flow of probability
- These are the "probability flow ODE"
- Like a sober person walking - straight to the goal

**🌈 Background Heatmap**
- Shows **probability density** at each time and position
- Bright = high probability, dark = low probability
- Evolution follows the Fokker-Planck equation
- This is the analytical solution (not simulated)

### Try These Experiments

#### Experiment 1: More Randomness vs Less
```
1. Set Paths = 5
2. Observe: Wide spread around white lines
3. Set Paths = 50  
4. Observe: Paths cluster around white lines
5. Conclusion: Law of Large Numbers in action!
```

#### Experiment 2: Different Starting Distributions
```
1. Initial Dist = Bimodal (two peaks)
   → Watch two peaks merge into one
2. Initial Dist = Uniform (flat)
   → Watch flat distribution become normal
3. Initial Dist = Single (one peak)
   → Watch peak spread and shift
```

#### Experiment 3: Different SDE Behaviors
```
1. SDE Type = VP-SDE
   → Variance stays around 1 (preserved)
2. SDE Type = VE-SDE  
   → Variance explodes (paths spread wide)
3. SDE Type = Sub-VP
   → Slower evolution (gentler diffusion)
```

## 🎨 Customization Quick Tips

### For Presentations
```
Background: White
Colors: Rainbow
Paths: 20-30
Toggle: All ON
```

### For Publications
```
Background: Academic
Colors: Monochrome
Paths: 20
Legend: OFF
Steps: 300 (smoother)
```

### For Understanding
```
Background: White
Colors: Rainbow
Paths: 10 (less clutter)
Toggle SDE OFF → See only ODE (deterministic)
Toggle SDE ON → Compare with stochastic
```

### For Performance
```
Paths: 5-10
Steps: 50-100
Heatmap: OFF (if laggy)
```

## 🔧 Troubleshooting

### Visualization is slow
- Reduce **Paths** (try 10)
- Reduce **Steps** (try 100)
- Turn **Heatmap** OFF
- Close other browser tabs

### Looks wrong after changing settings
- Click **Reset** button
- Refresh the page (F5)

### Want to start over
- Click **Reset** button
- Or refresh the page

## 📚 What to Learn Next

### If you're a student
1. Read about **Stochastic Differential Equations**
2. Learn about **Diffusion Models** in ML
3. Study **Brownian Motion** and **Wiener Process**
4. Understand **Fokker-Planck Equation**

### If you're a researcher
1. Modify `config.js` to add your own SDE
2. Implement your own initial distributions
3. Add custom metrics and visualizations
4. Compare with your theoretical predictions

### If you're a developer
1. Study the modular architecture
2. Add new interactive features
3. Implement animation playback
4. Add export functionality

## 🎓 Educational Use Cases

### Teaching Stochastic Processes
```
1. Start with ODE only (deterministic)
2. Add SDE paths (introduce randomness)
3. Compare individual paths vs average behavior
4. Show convergence to stationary distribution
```

### Teaching Diffusion Models
```
1. Show forward process (data → noise)
2. Emphasize information destruction
3. Show reverse process (noise → data)
4. Discuss score function ∇log p(x)
```

### Teaching Probability
```
1. Initial distribution (show various shapes)
2. Evolution over time (Fokker-Planck)
3. Convergence to Gaussian (Central Limit Theorem)
4. Law of Large Numbers (many paths)
```

## ⌨️ Browser Console Tips

Open console (F12) and try:

```javascript
// See current configuration
console.log(window.app.config.getAll());

// Get current SDE equation details
let sde = window.app.config.getSDE('vp');
console.log(sde.formula);

// Programmatically change settings
window.app.config.update('paths', 40);
window.app.controls.regenerate();

// Generate data without visualization
let data = window.app.simulator.generate();
console.log(data);
```

## 📖 Key Equations Explained

### VP-SDE (Variance Preserving)
```
Forward:  dx = -½x dt + dw
Reverse:  dx = [-½x - ∇log p(x)]dt + dw

Why: Keeps variance ≈ 1 throughout
Use: Stable training, DDPM-style models
```

### VE-SDE (Variance Exploding)
```
Forward:  dx = √(2t+1) dw  
Reverse:  dx = -√(2t+1) ∇log p(x) dt + √(2t+1) dw

Why: Variance grows without bound
Use: NCSN-style models, score matching
```

### Sub-VP SDE
```
Forward:  dx = -¼x dt + 0.8 dw
Reverse:  dx = [-¼x - 0.64∇log p(x)]dt + 0.8 dw

Why: Slower drift, controlled diffusion
Use: Research, gentle transformations
```

## 🎯 Next Steps

1. ✅ Understand the basic visualization
2. ✅ Try all the controls
3. ✅ Run the 3 experiments above
4. → Read `README.md` for architecture details
5. → Read `FEATURES.md` for advanced features
6. → Modify `config.js` to add your own SDE
7. → Share your findings!

---

**Having issues?** Check that:
- ✓ You're using a modern browser (Chrome, Firefox, Safari)
- ✓ JavaScript is enabled
- ✓ Internet connection is available (for CDN libraries)
- ✓ No browser extensions are blocking scripts

**Want more?** Check out:
- `README.md` - Full documentation
- `FEATURES.md` - Complete feature list
- Source code in `js/` folder
