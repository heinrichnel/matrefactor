// Local shims for modules with problematic type exports
// This prevents TS2306 'is not a module' for @vitejs/plugin-react in certain setups.
declare module "@vitejs/plugin-react" {
  import { Plugin } from "vite";
  function reactPlugin(options?: Record<string, unknown>): Plugin;
  export default reactPlugin;
}
