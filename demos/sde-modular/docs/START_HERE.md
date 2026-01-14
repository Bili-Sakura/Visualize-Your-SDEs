# 🚀 START HERE - SDE Modular Visualization

Welcome to the **Modular SDE Visualization** project! This guide will help you get started quickly.

## ⚡ Quick Start (30 Seconds)

1. **Open the visualization**:
   - Double-click `index.html` in this folder
   - Or visit via local server: `http://localhost:8000/demos/sde-modular/`

2. **Play with the controls** in the purple header bar:
   - Move sliders to adjust paths and steps
   - Change dropdowns to try different equations
   - Click toggles to show/hide elements
   - Click "Regenerate" for new random trajectories

3. **That's it!** You're now visualizing stochastic differential equations interactively.

## 📚 Documentation Guide

We have **6 documentation files** to help you. Here's what to read based on your needs:

### 🎯 I want to...

#### ...get started immediately
→ **You're here!** Just open `index.html` and start playing.

#### ...understand the basics in 5 minutes
→ Read **[QUICKSTART.md](QUICKSTART.md)**
- 5-minute tutorial
- Core concepts explained
- 3 hands-on experiments

#### ...see what's new and different
→ Read **[COMPARISON.md](COMPARISON.md)**
- Before/after comparison
- Feature matrix
- Why modular is better

#### ...learn all the features
→ Read **[FEATURES.md](FEATURES.md)**
- Complete feature list
- Usage examples
- Customization tips

#### ...understand the architecture
→ Read **[README.md](README.md)**
- Technical documentation
- Architecture details
- API reference

#### ...see the big picture
→ Read **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**
- What was accomplished
- Metrics and improvements
- File-by-file breakdown

#### ...understand the file structure
→ Read **[STRUCTURE.txt](STRUCTURE.txt)**
- Visual file tree
- Component relationships
- Quick reference

## 🎨 What Can You Do?

### Interactive Controls

| Control | What It Does | Try This |
|---------|--------------|----------|
| **Paths Slider** | Number of trajectories (5-50) | Set to 5 for clarity, 50 for statistics |
| **Steps Slider** | Time resolution (50-400) | More = smoother, fewer = faster |
| **SDE Type** | Switch equations | Try VP vs VE to see different behaviors |
| **Initial Dist** | Starting distribution | See how bimodal vs uniform evolves |
| **Colors** | Visual style | Monochrome for publications |
| **Background** | Theme | Dark for presentations |
| **Legend Toggle** | Show/hide labels | Off for cleaner look |
| **ODE Toggle** | Deterministic paths | Compare with stochastic |
| **SDE Toggle** | Stochastic paths | Toggle to see just the flow |
| **Heatmap Toggle** | Density background | Off for better performance |
| **Regenerate** | New random paths | Get different trajectories |
| **Reset** | Back to defaults | Start fresh |

### Available Options

**3 SDE Types:**
- VP-SDE: `dx = -½x dt + dw` (variance preserving)
- VE-SDE: `dx = √(2t+1) dw` (variance exploding)
- Sub-VP: `dx = -¼x dt + 0.8 dw` (slower diffusion)

**3 Initial Distributions:**
- Bimodal: Two peaks at ±2
- Uniform: Flat distribution
- Single: One peak at center

**4 Color Schemes:**
- Rainbow: Full spectrum
- Viridis: Scientific standard
- Plasma: High contrast
- Monochrome: Publication-ready

**3 Backgrounds:**
- White: Professional
- Dark: Modern
- Academic: Publication-style

## 🎓 Learning Path

### Beginner (5 minutes)
1. Open `index.html`
2. Move the **Paths** slider
3. Try different **SDE Types**
4. Read **[QUICKSTART.md](QUICKSTART.md)**

### Intermediate (30 minutes)
1. Complete beginner steps
2. Read **[FEATURES.md](FEATURES.md)**
3. Try all 3 experiments in QUICKSTART
4. Explore all controls

### Advanced (2 hours)
1. Complete intermediate steps
2. Read **[README.md](README.md)**
3. Open browser console (F12)
4. Try: `window.app.config.getAll()`
5. Read **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**

### Expert (1 day)
1. Complete advanced steps
2. Study source code in `js/` folder
3. Add your own SDE type
4. Add your own distribution
5. Extend with new features

## 🔧 Troubleshooting

### Visualization not loading?
- ✓ Check internet connection (needs CDN for Plotly)
- ✓ Use modern browser (Chrome, Firefox, Safari)
- ✓ Enable JavaScript
- ✓ Check browser console for errors (F12)

### Visualization is slow?
- Reduce **Paths** to 10 or less
- Reduce **Steps** to 100 or less
- Toggle **Heatmap** off
- Close other browser tabs

### Want to start fresh?
- Click **Reset** button
- Or refresh the page (F5)

### Something looks wrong?
- Click **Regenerate** to try again
- Check that toggles are in desired state
- Try **Reset** to return to defaults

## 💡 Quick Tips

1. **For Teaching**: Use Rainbow colors, White background, toggle ODE on/off to show difference
2. **For Research**: Use Monochrome, Academic background, 300+ steps for smooth curves
3. **For Presentations**: Use Dark background, Plasma colors, adjust paths for visual impact
4. **For Performance**: Fewer paths, fewer steps, heatmap off
5. **For Understanding**: Start with 10 paths, toggle elements on/off to see what each does

## 🎯 Common Use Cases

### Compare Stochastic vs Deterministic
```
1. Set Paths = 20
2. Toggle SDE ON, ODE ON
3. Observe: Colored paths (random) vs white lines (deterministic)
```

### See Different Diffusion Behaviors
```
1. Start with SDE Type = VP-SDE
2. Switch to VE-SDE
3. Notice: Paths spread much wider (exploding variance)
```

### Understand Distribution Evolution
```
1. Initial Dist = Bimodal
2. Watch: Two peaks merge into one Gaussian
3. Try: Uniform → see how flat becomes normal
```

### Create Publication Figure
```
1. Background = Academic
2. Colors = Monochrome
3. Steps = 300 (smooth)
4. Legend = OFF
5. Take screenshot
```

## 🌟 Next Steps

After playing with the visualization:

1. **Understand the Math**: Read about SDEs and diffusion models
2. **Explore the Code**: Check out the `js/` folder
3. **Extend It**: Add your own SDE or distribution
4. **Share It**: Show colleagues or students
5. **Contribute**: Suggest improvements or new features

## 📖 File Overview

```
📁 sde-modular/
├── 📄 index.html          ← Open this to run!
├── 📄 START_HERE.md       ← You are here
├── 📄 QUICKSTART.md       ← 5-minute tutorial
├── 📄 COMPARISON.md       ← Before/after comparison
├── 📄 FEATURES.md         ← All features explained
├── 📄 README.md           ← Technical documentation
├── 📄 PROJECT_SUMMARY.md  ← Complete overview
├── 📄 STRUCTURE.txt       ← File organization
├── 📁 css/                ← Styling
│   └── styles.css
└── 📁 js/                 ← JavaScript modules
    ├── config.js          ← Configuration
    ├── math.js            ← Math utilities
    ├── simulation.js      ← Data generation
    ├── visualization.js   ← Rendering
    └── controls.js        ← UI interaction
```

## ❓ FAQ

**Q: Do I need to install anything?**  
A: No! Just open `index.html` in a browser. Internet connection needed for Plotly CDN.

**Q: Can I use this offline?**  
A: You'd need to download Plotly.js locally and update the script tag in `index.html`.

**Q: Can I modify the code?**  
A: Absolutely! It's designed to be extended. See README.md for guidance.

**Q: How do I add my own SDE?**  
A: Edit `js/config.js`, add your equation to `getSDE()`, then add option to `index.html`.

**Q: Can I export the visualization?**  
A: Take a screenshot, or use browser console: `Plotly.downloadImage('chart-container')`

**Q: Is this production-ready?**  
A: Yes! Zero linting errors, comprehensive documentation, modular architecture.

**Q: Can I use this for teaching?**  
A: Yes! Perfect for teaching SDEs, diffusion models, and stochastic processes.

**Q: Can I use this in publications?**  
A: Yes! Use Academic background + Monochrome colors for publication-quality figures.

## 🤝 Getting Help

1. **Read the docs**: Check the 6 documentation files
2. **Browser console**: Press F12, try `window.app`
3. **Source code**: Well-commented, easy to read
4. **Experiment**: Try different settings, see what happens

## 🎉 You're Ready!

Now that you know where everything is:

1. **Open `index.html`** and start exploring
2. **Read `QUICKSTART.md`** for a guided tour
3. **Experiment** with all the controls
4. **Learn** from the documentation
5. **Extend** with your own features

Have fun visualizing stochastic differential equations! 🚀

---

**Quick Links:**
- 🏃 [QUICKSTART.md](QUICKSTART.md) - 5-minute tutorial
- 📊 [COMPARISON.md](COMPARISON.md) - What's new
- ⭐ [FEATURES.md](FEATURES.md) - All features
- 📖 [README.md](README.md) - Full documentation
- 📝 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview
- 🗂️ [STRUCTURE.txt](STRUCTURE.txt) - File structure

**Version**: 2.0.0 | **Status**: ✅ Production Ready | **Updated**: January 2026
