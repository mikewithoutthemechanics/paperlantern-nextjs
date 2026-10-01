import { NOISE, FLICKER } from "./glsl";

/**
 * THE LANTERN SHADER
 *
 * The lantern is a unit sphere remapped in the vertex stage into a proper
 * paper-lantern silhouette: a full belly, tapered neck, pinched base. The
 * fragment stage fakes subsurface scattering — light from a flame inside
 * bleeding through a thin, fibrous sheet, escaping hardest at the
 * silhouette where you see the most paper edge-on.
 */

/** Number of vertical bamboo splints that crease the paper. */
export const PANELS = 14;

export const lanternVertex = /* glsl */ `
${NOISE}

uniform float uTime;
uniform float uOpen;   // 0 = resting, 1 = fully unfurled
uniform float uHeight;  // global vertical stretch, driven by scroll

varying vec2  vUv;
varying vec3  vNormalW;
varying vec3  vViewDir;
varying float vHeightT; // 0 at the base opening → 1 at the neck
varying float vAngle;   // -PI..PI around the lantern axis
varying float vWrinkle;

void main() {
  vUv = uv;

  vec3  p    = position;              // unit sphere, -1..1
  float y    = p.y;
  float t    = y * 0.5 + 0.5;         // 0 base → 1 neck
  vHeightT = t;

  vec2 dir = length(p.xz) > 0.0001 ? normalize(p.xz) : vec2(0.0);
  float ang = atan(dir.y, dir.x);
  vAngle = ang;

  // --- silhouette: a full belly that tapers to neck and base ---
  float profile = pow(max(sin(t * 3.14159265), 0.0), 0.62);

  // uOpen makes the paper relax outward and the lantern breathe taller
  float R = profile * (1.0 + 0.06 * uOpen);
  float H = (1.14 + 0.22 * uOpen) * uHeight;

  // --- splints: the wire ribs pinch the paper between panels ---
  float rib = cos(ang * ${PANELS}.0);
  float pinch = 1.0 - 0.04 * pow(rib * 0.5 + 0.5, 2.0);

  // --- crumple: slow, low-amplitude paper wrinkle ---
  float wr = fbm(vec3(dir * 2.4, t * 3.0 + uTime * 0.05));
  vWrinkle = wr;
  float wrinkle = 1.0 + (wr - 0.5) * 0.07;

  vec3 shaped = vec3(dir.x * R * pinch * wrinkle, y * H, dir.y * R * pinch * wrinkle);

  // --- life: a slow breath and a gentle vertical drift ---
  float breath = 1.0 + 0.018 * sin(uTime * 0.9) + 0.012 * sin(uTime * 1.7 + t * 3.0);
  shaped *= breath;
  shaped.y += 0.02 * sin(uTime * 0.6);

  vec4 world = modelMatrix * vec4(shaped, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * shaped);
  vViewDir = normalize(cameraPosition - world.xyz);

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const lanternFragment = /* glsl */ `
${NOISE}
${FLICKER}

uniform float uTime;
uniform float uOpen;
uniform float uHover;  // pointer proximity, 0..1

varying vec2  vUv;
varying vec3  vNormalW;
varying vec3  vViewDir;
varying float vHeightT;
varying float vAngle;
varying float vWrinkle;

const float TAU = 6.28318530718;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);
  float ndv = max(dot(N, V), 0.0);

  float fl = flicker(uTime) * (1.0 + 0.10 * uHover);

  // --- how much light gets through the sheet ---
  // Seen face-on you look through the thickest path; at the silhouette you
  // look through the thinnest. That contrast is the whole look of a lantern.
  float rim  = pow(1.0 - ndv, 2.2);
  float core = pow(ndv, 0.8);

  // --- panel seams ---
  float u = fract((vAngle / TAU + 0.5) * ${PANELS}.0);
  float seam = smoothstep(0.0, 0.05, u) * smoothstep(1.0, 0.95, u);
  seam = mix(0.5, 1.0, seam);

  // --- bamboo hoops, top and bottom ---
  float hoop =
    (1.0 - 0.5 * smoothstep(0.07, 0.0, abs(vHeightT - 0.13))) *
    (1.0 - 0.5 * smoothstep(0.07, 0.0, abs(vHeightT - 0.88)));

  // --- washi fibre: long horizontal strands + occasional dark flecks ---
  float fibre = fbm(vec3(vUv * vec2(140.0, 22.0), 3.7));
  float fleck = smoothstep(0.74, 0.88, vnoise(vec3(vUv * vec2(320.0, 90.0), 11.0)));

  // --- the base is open: this is where you actually see the flame ---
  float opening = smoothstep(0.12, 0.015, vHeightT);

  // light pooling around the flame, strongest low and central
  float pool = smoothstep(0.55, 0.0, vHeightT) * 0.45;

  vec3 hot  = vec3(1.00, 0.87, 0.62);
  vec3 warm = vec3(1.00, 0.52, 0.18);
  vec3 deep = vec3(0.42, 0.10, 0.02);

  float energy = (core * 0.5 + rim * 1.30 + pool) * fl;
  vec3 col = mix(deep, warm, clamp(energy * 0.9, 0.0, 1.0));
  col = mix(col, hot, clamp(pow(max(energy, 0.0), 2.0) * 0.85, 0.0, 1.0));

  col *= seam * hoop;
  col *= 0.86 + 0.28 * fibre;          // fibre density modulates transmission
  col += hot * fleck * 0.22;           // flecks catch the light
  col *= 0.72 + 0.34 * vWrinkle;
  col *= 0.55 + 0.75 * uOpen;          // dimmer and more closed when resting

  float alpha = (1.0 - opening * 0.96) * (0.94 + 0.06 * core);

  gl_FragColor = vec4(col * fl, alpha);
}
`;

/** The candle itself: a teardrop of fire, additive, seen through the base. */
export const flameVertex = /* glsl */ `
${NOISE}
uniform float uTime;
varying float vH;
void main() {
  vH = position.y;
  vec3 p = position;
  float wobble = (fbm(vec3(0.0, uTime * 2.2, 0.0)) - 0.5) * 0.10;
  p.x += wobble * smoothstep(-0.1, 0.5, p.y);
  p.y *= 1.0 + 0.10 * sin(uTime * 9.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const flameFragment = /* glsl */ `
${NOISE}
${FLICKER}
uniform float uTime;
varying float vH;
void main() {
  float fl = flicker(uTime * 1.4);
  // white-hot at the base, cooling to deep orange at the tip
  vec3 col = mix(vec3(1.0, 0.95, 0.80), vec3(1.0, 0.35, 0.05), smoothstep(-0.1, 0.5, vH));
  float a = smoothstep(0.55, -0.35, vH) * fl;
  gl_FragColor = vec4(col * 1.6, a);
}
`;
