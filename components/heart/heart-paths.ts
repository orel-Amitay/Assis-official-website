// Aspect ratio matches the real ASSIS heart asset (public/brand/assis-heart.png, 1024x967).
export const HEART_VIEWBOX = "0 0 200 189";

// Rough silhouette of the real mark - used only as an invisible clip region
// for ambient internal motion (e.g. flowing dots), never rendered directly.
export const HEART_PATH =
  "M100,182 C100,182 14,114 14,62 C14,26 41,5 73,5 C93,5 100,22 100,37 C100,22 107,5 127,5 C159,5 186,26 186,62 C186,114 100,182 100,182 Z";

// Jagged crack running from the top notch down toward the point, drawn as an
// overlay on top of the real heart image.
export const HEART_CRACK_PATH =
  "M100,40 L93,65 L107,82 L88,103 L108,124 L92,149 L100,172";

// Small offshoot crack for extra detail on the second break.
export const HEART_CRACK_BRANCH = "M107,82 L124,95 L113,110";
