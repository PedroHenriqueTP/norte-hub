# High-Performance Marketing Agency Portfolio

This project is a high-fidelity recreation of a premium "Awwwards-style" agency website, inspired by the aesthetics of Lando Norris's official site. It prioritizes motion, immersion, and performance using a bleeding-edge tech stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Smooth Scroll**: [Lenis](https://github.com/studio-freight/lenis) (by Studio Freight) for inertia-based scrolling.
- **3D / WebGL**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (R3F) & [Drei](https://github.com/pmndrs/drei).
- **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger) & [Framer Motion](https://www.framer.com/motion/).

## ✨ Key Features

1.  **Immersive Hero**: A fluid/smoke WebGL simulation running on R3F that reacts to mouse movement.
2.  **Smooth Scrolling**: Global inertia scrolling for a "premium" feel, utilizing Lenis.
3.  **Horizontal Scroll**: The "Selected Works" section interacts with the scrollbar to move horizontally, showcasing projects.
4.  **Kinetic Typography**: Large-scale text in the "Services" section that reacts to hover with skew and style changes.
5.  **Magnetic Buttons**: Interactive buttons that physically pull toward the cursor.
6.  **Curtain Footer**: A unique footer reveal effect.
7.  **Cinematic Grain**: A global CSS-based noise overlay for texture.

## 📂 Project Structure

```
├── app/
│   ├── globals.css       # Global styles, variables, noise overlay
│   ├── layout.tsx        # Root layout with SmoothScroll wrapper
│   └── page.tsx          # Homepage composition
├── components/
│   ├── ui/
│   │   ├── MagneticButton.tsx # Framer Motion button
│   │   └── ParallaxImage.tsx  # GSAP-powered image component
│   ├── Hero.tsx          # R3F WebGL Scene
│   ├── Work.tsx          # Horizontal Scroll Section
│   ├── Services.tsx      # Kinetic Typography List
│   ├── Footer.tsx        # Fixed curtain footer
│   └── SmoothScroll.tsx  # Lenis configuration
└── public/               # Static assets
```

## 🛠️ Customization Guide

### 1. Changing Colors
Open `app/globals.css`. The project uses CSS variables for theme colors:
```css
:root {
  --color-bg: #050505;     /* Main background (Deep Black) */
  --color-text: #ffffff;   /* Primary text */
  --color-accent: #ccff00; /* Electric Lime (The "Lando" accent) */
}
```
Update `--color-accent` to your brand's primary color.

### 2. Updating Content
- **Projects**: Open `components/Work.tsx`. Modify the `projects` array with your case studies, titles, and image URLs.
- **Services**: Open `components/Services.tsx`. Update the `services` array.
- **Footer Info**: Open `components/Footer.tsx` to change social links and contact info.

### 3. Adjusting Scroll Physics
Open `components/SmoothScroll.tsx`. You can tweak the `lenisOptions` object:
- `lerp`: Lower values (e.g., 0.05) make the scroll "heavier" and smoother. Higher values (e.g., 0.2) make it snappier.
- `duration`: Controls the animation duration.

### 4. Changing Fonts
The project currently uses `Inter` via `next/font`.
To use a custom font:
1.  Import your font in `app/layout.tsx` using `localFont` or another Google Font.
2.  Update the `className` in the `<body>` tag to use your new font variable.

### 5. Configurar Imagens
When adding new external image sources (e.g., your CMS), remember to add the hostname to `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'your-cms.com' },
    ],
  },
};
```

## 🏃‍♂️ Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```
