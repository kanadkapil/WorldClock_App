# WorldClock Dashboard 🌍

## 🚀 Project Overview
A polished, frontend-only application that acts as a live, interactive Earth dashboard. Explore the world, compare cities, visualize global time and daylight, simulate any point in time, and access weather and astronomical information—all through a fast, beautiful, and engaging interface.

## ✨ Features
- **Interactive Global Map**: Smooth zoom, pan, and interactive city markers.
- **Time Visualization**: Accurate time zones, UTC offsets, and Daylight Saving Time handled natively.
- **Earth Simulation**: Real-time rendering of the day/night terminator line.
- **Time Travel**: Simulate past or future dates and watch the global time and terminator animate.
- **Productivity Planning**: Plan meetings across different time zones easily.
- **Environment & Weather**: Sunrise, sunset, moon phases, and general climate overviews.

## 🛠️ Tech Stack
- **Framework:** React.js, Vite, TypeScript
- **Styling:** Tailwind CSS, DaisyUI
- **Map:** MapLibre GL JS
- **Date/Time:** date-fns, date-fns-tz, SunCalc
- **State & Animation:** Zustand, Framer Motion

## 📁 Folder Structure
```text
project-root/
│
├── Documentation/
│   ├── ExecutionPlan.md
│   ├── DebugReport.md
│   ├── ProjectReport.md
│   └── README.md
│
├── src/
│   ├── components/
│   ├── store/
│   ├── utils/
│   ├── styles/
│   └── App.tsx
│
└── package.json
```

## ⚙️ Installation Guide
1. Clone the repository.
2. Navigate to the project root.
3. Run `npm install` to install dependencies.

## ▶️ Running Locally
1. Run `npm run dev` in the terminal.
2. Open your browser and navigate to `http://localhost:5173`.

## 🌐 Environment Variables
*No environment variables are currently required.*

## 📜 Available Scripts
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the application for production.
- `npm run preview` - Previews the production build locally.
- `npm run lint` - Lints the codebase using ESLint.

## 📸 Screenshots
*(Coming soon)*

## 🧪 Testing Guide
*(Testing suite setup in progress)*

## 🚀 Deployment Instructions
Since this is an entirely frontend application with no backend or database, the project can be deployed easily to any static hosting provider like Vercel, Netlify, or GitHub Pages.
Run `npm run build` and upload the generated `dist/` directory.

## 🤝 Contribution Guidelines
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements
- [MapLibre](https://maplibre.org/)
- [SunCalc](https://github.com/mourner/suncalc)

## 📞 Support Information
Please open an issue on the repository for any support queries.
