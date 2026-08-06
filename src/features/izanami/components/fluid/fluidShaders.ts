export const FULLSCREEN_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const SPLAT_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTarget;
  uniform vec2 uPoint;
  uniform vec3 uValue;
  uniform float uAspect;
  uniform float uRadius;

  varying vec2 vUv;

  void main() {
    vec2 pointDelta = vUv - uPoint;
    pointDelta.x *= uAspect;
    vec3 splat = exp(-dot(pointDelta, pointDelta) / uRadius) * uValue;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`

export const ADVECTION_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uTarget;
  uniform vec2 uTexel;
  uniform float uDeltaTime;
  uniform float uDissipation;

  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 coordinate = vUv - uDeltaTime * velocity * uTexel;
    gl_FragColor = uDissipation * texture2D(uTarget, coordinate);
  }
`

export const DIVERGENCE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 uTexel;

  varying vec2 vUv;

  void main() {
    float left = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
    float top = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
    float divergence = 0.5 * (right - left + top - bottom);
    gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
  }
`

export const PRESSURE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexel;

  varying vec2 vUv;

  void main() {
    float left = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (left + right + bottom + top - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

export const GRADIENT_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexel;

  varying vec2 vUv;

  void main() {
    float left = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float right = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float top = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= vec2(right - left, top - bottom);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

export const COMPOSITE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uScene;
  uniform sampler2D uVelocity;
  uniform sampler2D uDye;
  uniform float uDistortion;

  varying vec2 vUv;

  void main() {
    float dye = texture2D(uDye, vUv).r;
    vec2 velocity = texture2D(uVelocity, vUv).xy + vec2(0.0001);
    vec2 direction = normalize(velocity);
    vec2 displacedUv = vUv - 2.0 * uDistortion * direction * dye;
    vec4 sceneColor = texture2D(uScene, displacedUv);

    float mask = smoothstep(0.0015, 0.014, dye);
    gl_FragColor = vec4(sceneColor.rgb, sceneColor.a * mask * 0.98);
  }
`
