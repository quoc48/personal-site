# Implementation Plan: Interactive Generative Flower Animation

## Project Context

**Project Root**: `/Users/quocphan/Personal Site/`
**Tech Stack**: Astro v5.16.3, Tailwind CSS v4, Vite
**Target Page**: Home page (`/src/pages/index.astro`)
**Layout**: `BaseLayout.astro` with Header/Footer components
**Design**: White background (`bg-white`), dark text (`#1E1E1E`), Lato font

---

## 1. Library Analysis and Recommendation

### Option A: Vanilla Canvas API (RECOMMENDED)

**Pros**:
- Zero dependencies - no additional bundle size
- Full control over rendering pipeline
- Native browser API with excellent performance
- Easy to integrate with Astro's client-side scripts
- No SSR issues - canvas is inherently client-side

**Cons**:
- More code to write from scratch
- Manual implementation of animation math

### Option B: p5.js

**Pros**:
- Rich creative coding API
- Built-in animation loop and vector math
- Large community with examples

**Cons**:
- 800KB+ library size (significant for a simple animation)
- Requires special Astro integration (instance mode)
- Overkill for a single animation effect

### Option C: CSS-only (Not Recommended)

**Pros**:
- No JavaScript required
- GPU-accelerated transforms

**Cons**:
- Cannot achieve true generative/procedural flower patterns
- Limited interactivity (no mouse position tracking for petals)
- Would require many DOM elements for petal effect

### VERDICT: Vanilla Canvas API

The requirements call for a semi-transparent overlapping petal pattern with mouse interaction - this is best achieved with Canvas for performance and flexibility. The minimal footprint aligns with the site's lean dependency structure (only Astro + Tailwind).

---

## 2. File Structure and Component Breakdown

```
/src
├── components/
│   └── FlowerCanvas.astro      # NEW: Canvas component with inline script
├── layouts/
│   └── BaseLayout.astro        # MODIFY: Add FlowerCanvas conditionally
├── pages/
│   └── index.astro             # MODIFY: Pass showFlowerAnimation prop
└── styles/
    └── global.css              # MINOR: Add canvas z-index utility if needed
```

### Component Architecture

#### FlowerCanvas.astro (New Component)
- Contains the `<canvas>` element
- Includes `<script>` tag with client-side animation logic
- Self-contained animation logic
- Accepts props for customization (optional)

#### BaseLayout.astro (Modification)
- Import FlowerCanvas component
- Conditionally render on home page (via prop)
- Ensure main content has `relative z-10`

---

## 3. Technical Architecture

### Canvas Layering Strategy

```
┌─────────────────────────────────────────┐
│ z-index: 10  │ Header, Content, Footer  │  (interactive, readable)
├─────────────────────────────────────────┤
│ z-index: 0   │ FlowerCanvas (fixed)     │  (background animation)
├─────────────────────────────────────────┤
│ z-index: -1  │ body bg-white            │  (fallback background)
└─────────────────────────────────────────┘
```

### CSS Implementation

```css
/* Canvas container */
.flower-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;  /* Allow clicks to pass through */
}

/* Content layer */
main, header, footer {
  position: relative;
  z-index: 10;
}
```

### Animation Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FlowerCanvas Component                   │
├────────────────────────────────────────────────────────────┤
│  State:                                                     │
│    - mouseX, mouseY (tracked with throttling)              │
│    - petals[] array of petal objects                       │
│    - animationFrameId (for cleanup)                        │
│                                                             │
│  Petal Object:                                              │
│    { x, y, radius, rotation, opacity, layer, growth }      │
│                                                             │
│  Animation Loop:                                            │
│    1. Clear canvas (or use alpha fade)                     │
│    2. Update petal positions based on mouse proximity      │
│    3. Draw each petal with:                                │
│       - Bezier curves for organic petal shapes             │
│       - Grayscale fill with semi-transparency              │
│       - Rotation transform based on mouse angle            │
│    4. requestAnimationFrame(loop)                          │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Step-by-Step Implementation Plan

### Phase 1: Component Setup (15 min)

**Step 1.1**: Create `/src/components/FlowerCanvas.astro`
- Canvas element with fixed positioning
- Data attributes for configuration
- Script block for animation logic

**Step 1.2**: Modify `/src/layouts/BaseLayout.astro`
- Add `showFlowerAnimation?: boolean` prop
- Import and conditionally render FlowerCanvas
- Add `relative z-10` to main content wrapper

**Step 1.3**: Update `/src/pages/index.astro`
- Pass `showFlowerAnimation={true}` to BaseLayout

### Phase 2: Core Animation Logic (45 min)

**Step 2.1**: Canvas Initialization
```javascript
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');

// Handle resize
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();
```

**Step 2.2**: Mouse Tracking with Throttling
```javascript
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;

// Throttled mouse handler (16ms = 60fps)
let lastMove = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastMove > 16) {
    targetX = e.clientX;
    targetY = e.clientY;
    lastMove = now;
  }
});
```

**Step 2.3**: Petal Generation Algorithm
```javascript
class Petal {
  constructor(index, total) {
    this.index = index;
    this.angle = (index / total) * Math.PI * 2;
    this.baseRadius = 50 + Math.random() * 100;
    this.width = 30 + Math.random() * 40;
    this.length = 80 + Math.random() * 60;
    this.opacity = 0.05 + Math.random() * 0.15;  // Very subtle
    this.rotationSpeed = 0.0005 + Math.random() * 0.001;
    this.phase = Math.random() * Math.PI * 2;
  }
}

const petals = Array.from({ length: 24 }, (_, i) => new Petal(i, 24));
```

**Step 2.4**: Petal Drawing Function
```javascript
function drawPetal(ctx, x, y, width, length, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  // Bezier curves for organic petal shape
  ctx.bezierCurveTo(
    width * 0.5, -length * 0.3,
    width * 0.5, -length * 0.7,
    0, -length
  );
  ctx.bezierCurveTo(
    -width * 0.5, -length * 0.7,
    -width * 0.5, -length * 0.3,
    0, 0
  );
  
  // Grayscale with low opacity for subtlety
  const gray = 240 + Math.floor(Math.random() * 15);  // 240-255 (very light)
  ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
  ctx.fill();
  
  ctx.restore();
}
```

**Step 2.5**: Animation Loop
```javascript
let time = 0;

function animate() {
  // Soft clear (creates trailing effect) or full clear
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Smooth mouse following
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;
  
  // Draw petals
  petals.forEach((petal, i) => {
    const angle = petal.angle + time * petal.rotationSpeed;
    const radius = petal.baseRadius + Math.sin(time * 0.001 + petal.phase) * 20;
    
    // Position influenced by mouse
    const x = mouseX + Math.cos(angle) * radius;
    const y = mouseY + Math.sin(angle) * radius;
    
    drawPetal(ctx, x, y, petal.width, petal.length, angle, petal.opacity);
  });
  
  time++;
  requestAnimationFrame(animate);
}

animate();
```

### Phase 3: Mouse Interaction Refinement (20 min)

**Step 3.1**: Bloom Response to Mouse
- Petals expand/contract based on mouse movement speed
- Rotation direction influenced by mouse position relative to center
- Subtle "breathing" animation when mouse is idle

**Step 3.2**: Edge Behavior
- Bloom follows mouse but stays partially visible at edges
- Graceful degradation when mouse leaves window

### Phase 4: Performance Optimization (15 min)

**Step 4.1**: RequestAnimationFrame Best Practices
```javascript
let animationId;

function startAnimation() {
  if (!animationId) {
    animationId = requestAnimationFrame(animate);
  }
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Pause when tab not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAnimation();
  } else {
    startAnimation();
  }
});
```

**Step 4.2**: Canvas Optimization
- Use `willReadFrequently: false` context option
- Consider `desynchronized: true` for lower latency
- Batch similar draw operations

**Step 4.3**: Memory Management
- Clean up event listeners on component unmount
- Avoid creating objects in animation loop

### Phase 5: Responsive Behavior (10 min)

**Step 5.1**: Scale Petals Based on Viewport
```javascript
const scale = Math.min(window.innerWidth, window.innerHeight) / 1000;
// Apply scale to petal dimensions
```

**Step 5.2**: Mobile Considerations
- Touch event support (touchmove)
- Reduced petal count on smaller screens
- Consider disabling on very small screens (<480px)

### Phase 6: Polish and Testing (15 min)

**Step 6.1**: Visual Refinement
- Adjust opacity values for optimal contrast with text
- Fine-tune animation speeds
- Test with actual content

**Step 6.2**: Cross-browser Testing
- Chrome, Firefox, Safari
- Mobile Safari and Chrome

**Step 6.3**: Performance Profiling
- Check frame rate with DevTools
- Verify no layout thrashing
- Test on lower-end devices

---

## 5. Complete FlowerCanvas.astro Component

```astro
---
interface Props {
  /** Number of petals in the bloom */
  petalCount?: number;
  /** Maximum spread radius */
  maxRadius?: number;
  /** Enable/disable animation */
  enabled?: boolean;
}

const { 
  petalCount = 24, 
  maxRadius = 200,
  enabled = true 
} = Astro.props;
---

{enabled && (
  <canvas 
    id="flower-canvas" 
    class="fixed inset-0 w-screen h-screen pointer-events-none"
    style="z-index: 0;"
    aria-hidden="true"
    data-config={JSON.stringify({ petalCount, maxRadius })}
  ></canvas>
)}

<script>
  (function() {
    const canvas = document.getElementById('flower-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const config = JSON.parse(canvas.dataset.config || '{}');
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let time = 0;
    let animationId: number | null = null;

    // Resize handler
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Petal class
    class Petal {
      angle: number;
      baseRadius: number;
      width: number;
      length: number;
      opacity: number;
      rotationSpeed: number;
      phase: number;

      constructor(index: number, total: number) {
        this.angle = (index / total) * Math.PI * 2;
        this.baseRadius = 50 + Math.random() * 100;
        this.width = 30 + Math.random() * 40;
        this.length = 80 + Math.random() * 60;
        this.opacity = 0.05 + Math.random() * 0.1;
        this.rotationSpeed = 0.0005 + Math.random() * 0.001;
        this.phase = Math.random() * Math.PI * 2;
      }
    }

    const petals = Array.from(
      { length: config.petalCount || 24 }, 
      (_, i) => new Petal(i, config.petalCount || 24)
    );

    // Draw petal
    function drawPetal(
      x: number, y: number, 
      width: number, length: number, 
      rotation: number, opacity: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(width * 0.5, -length * 0.3, width * 0.5, -length * 0.7, 0, -length);
      ctx.bezierCurveTo(-width * 0.5, -length * 0.7, -width * 0.5, -length * 0.3, 0, 0);
      
      const gray = 235 + Math.floor(Math.random() * 20);
      ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
      ctx.fill();
      ctx.restore();
    }

    // Animation loop
    function animate() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      
      petals.forEach((petal) => {
        const angle = petal.angle + time * petal.rotationSpeed;
        const radius = petal.baseRadius + Math.sin(time * 0.002 + petal.phase) * 20;
        const x = mouseX + Math.cos(angle) * radius;
        const y = mouseY + Math.sin(angle) * radius;
        drawPetal(x, y, petal.width, petal.length, angle + Math.PI / 2, petal.opacity);
      });
      
      time++;
      animationId = requestAnimationFrame(animate);
    }

    // Event handlers
    let lastMove = 0;
    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastMove > 16) {
        targetX = e.clientX;
        targetY = e.clientY;
        lastMove = now;
      }
    }

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) {
        targetX = touch.clientX;
        targetY = touch.clientY;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = null;
      } else {
        if (!animationId) animationId = requestAnimationFrame(animate);
      }
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationId = requestAnimationFrame(animate);
  })();
</script>

<style>
  #flower-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }
</style>
```

---

## 6. Modified BaseLayout.astro

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import FlowerCanvas from '../components/FlowerCanvas.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  image?: string;
  showFlowerAnimation?: boolean;
}

const { title, description, image, showFlowerAnimation = false } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead title={title} description={description} image={image} />
  </head>
  <body class="min-h-screen flex flex-col justify-between items-center bg-white text-[#1E1E1E] antialiased font-lato">
    {showFlowerAnimation && <FlowerCanvas />}
    <Header />
    <main class="flex-1 flex flex-col w-full max-w-[1024px] relative z-10">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

---

## 7. Modified index.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Quoc Phan - Product Designer"
  description="Product designer passionate about building things..."
  showFlowerAnimation={true}
>
  <!-- Existing content unchanged -->
  <section class="flex-1 flex flex-col items-center justify-center gap-6 px-[50px]">
    <!-- ... paragraphs ... -->
  </section>
</BaseLayout>
```

---

## 8. Z-Index Layering System

| Element | Z-Index | Purpose |
|---------|---------|---------|
| Canvas | 0 | Background animation layer |
| Body background | -1 (implicit) | Fallback white |
| Header | 10 (via main wrapper) | Navigation always accessible |
| Main content | 10 | Text readable over animation |
| Footer | 10 (via main wrapper) | Social links clickable |

---

## 9. Potential Challenges and Mitigations

### Challenge 1: Text Readability
**Risk**: Animation could distract from or obscure text
**Mitigation**: 
- Use very low opacity (0.05-0.15)
- Keep colors in 235-255 grayscale range
- Position bloom center follows mouse, away from static text

### Challenge 2: Performance on Mobile
**Risk**: Canvas animations can drain battery
**Mitigation**:
- Reduce petal count on mobile (check window.innerWidth)
- Pause animation when tab hidden (visibilitychange)
- Consider disabling entirely on very small screens

### Challenge 3: SSR Compatibility
**Risk**: Canvas API not available during server render
**Mitigation**:
- All canvas code in `<script>` tag (client-only by default in Astro)
- Canvas element renders as empty placeholder during SSR
- Animation initializes only after DOM ready

### Challenge 4: Resize Handling
**Risk**: Canvas doesn't auto-resize
**Mitigation**:
- Debounced resize listener updates canvas dimensions
- Petals recalculate positions based on new center

---

## 10. Testing Checklist

- [ ] Animation renders on page load
- [ ] Mouse movement affects bloom position
- [ ] Text remains readable over animation
- [ ] Links are clickable (pointer-events working)
- [ ] Scroll performance is smooth
- [ ] Animation pauses when tab is hidden
- [ ] Resize works correctly
- [ ] Mobile touch events work
- [ ] No console errors
- [ ] Chrome DevTools shows stable 60fps

---

## Critical Files for Implementation

1. **`/Users/quocphan/Personal Site/src/components/FlowerCanvas.astro`** (NEW)
   - Core animation component with canvas and script
   - Self-contained, no external dependencies

2. **`/Users/quocphan/Personal Site/src/layouts/BaseLayout.astro`** (MODIFY)
   - Add FlowerCanvas import
   - Add `showFlowerAnimation` prop
   - Add `relative z-10` to main element

3. **`/Users/quocphan/Personal Site/src/pages/index.astro`** (MODIFY)
   - Pass `showFlowerAnimation={true}` prop to BaseLayout

4. **`/Users/quocphan/Personal Site/src/styles/global.css`** (OPTIONAL)
   - Only if additional z-index utilities needed

5. **`/Users/quocphan/Personal Site/package.json`** (NO CHANGE)
   - No new dependencies required (vanilla Canvas)
