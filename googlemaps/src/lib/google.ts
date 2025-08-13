// src/lib/google.ts
import { Loader } from "@googlemaps/js-api-loader";

export const googleLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  version: "weekly",
  libraries: ["places"],
});
