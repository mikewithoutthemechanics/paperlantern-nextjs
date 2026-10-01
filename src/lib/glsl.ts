/**
 * Compact GLSL noise utilities shared by the lantern and ember shaders.
 *
 * Deliberately a cheap 3D value-noise + fbm rather than full simplex: at the
 * frequencies we need (soft paper wrinkle, slow flame drift) value noise is
 * visually indistinguishable and roughly 2x cheaper per fragment.
 */
export const NOISE = /* glsl */ `
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}
`;

/**
 * Flame flicker signal. Two incommensurate sine waves plus a slow noise
 * term — reads as a real candle rather than a sine wave.
 */
export const FLICKER = /* glsl */ `
float flicker(float t) {
  return 0.80
    + 0.10 * sin(t * 7.3)
    + 0.06 * sin(t * 13.7 + 1.3)
    + 0.12 * (fbm(vec3(0.0, t * 0.8, 0.0)) - 0.5) * 2.0;
}
`;
