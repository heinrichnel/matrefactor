// Dummy ambient declarations to satisfy tsconfig.node.json include
// Ensures TypeScript finds at least one .d.ts file
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_WIALON_TOKEN?: string;
  }
}
