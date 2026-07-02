
  # Real Estate App Design

  This is a code bundle for Real Estate App Design. The original project is available at https://www.figma.com/design/JrhDiDWYXRclMNtC0OggZT/Real-Estate-App-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## 360° Virtual Tours & Pannellum CDN Dependency

  The application includes a fully dynamic 360° Virtual Tour system for properties. This feature relies on **Pannellum** (`pannellum-react`). 
  
  Due to Pannellum's architecture (which expects `window.pannellum` to exist globally and initializes Web Workers), we inject pinned versions of its core scripts (`pannellum.js` and `pannellum.css` version `2.5.6`) via the jsDelivr CDN dynamically.

  **Important Details:**
  - **Dynamic Injection**: The CDN script is *only* requested and injected when a user opens the 360° modal. It does not block the initial page render.
  - **Error Handling**: If the CDN is blocked or unavailable, the viewer will gracefully show an error state without crashing the main React application.
  
  **Future Migration Path:**
  If a stable, fully bundled Webpack/Vite alternative for Pannellum becomes available (or if Web Workers for Pannellum are successfully configured for Vite bundle extraction), the CDN dependency can be removed by:
  1. Uninstalling the CDN dynamic loader in `src/components/Property360/VirtualTourViewer.tsx`.
  2. Directly importing Pannellum JS/CSS from the `node_modules` bundled assets.