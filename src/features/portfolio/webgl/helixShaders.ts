export const helixVertexShader = `
  varying vec2 vUv;
  uniform float uCurve;
  uniform float uScrollSpeed;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    transformed.z += sin(uv.x * 3.14159265359) * uCurve;
    vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
    viewPosition.x += sin(uv.y * 3.14159265359) * uScrollSpeed * 2.0;
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const helixFragmentShader = `
  varying vec2 vUv;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform sampler2D uTexture;
  uniform float uShade;

  float roundedRect(vec2 point, vec2 bounds, float radius) {
    vec2 distanceToEdge = abs(point) - bounds + radius;
    return min(max(distanceToEdge.x, distanceToEdge.y), 0.0)
      + length(max(distanceToEdge, 0.0))
      - radius;
  }

  void main() {
    float distanceToCorner = roundedRect(vUv - 0.5, vec2(0.5), 0.035);
    float alpha = 1.0 - smoothstep(-0.002, 0.004, distanceToCorner);
    if (alpha < 0.01) {
      discard;
    }

    vec2 coverRatio = vec2(
      min(uPlaneAspect / uImageAspect, 1.0),
      min(uImageAspect / uPlaneAspect, 1.0)
    );
    vec2 coverUv = vec2(
      vUv.x * coverRatio.x + (1.0 - coverRatio.x) * 0.5,
      vUv.y * coverRatio.y + (1.0 - coverRatio.y) * 0.5
    );
    vec4 sampled;
    if (gl_FrontFacing) {
      sampled = texture2D(uTexture, coverUv);
    } else {
      float blurOffset = 40.0 / 1024.0;
      sampled = vec4(0.0);
      sampled += texture2D(uTexture, coverUv + vec2(-blurOffset, -blurOffset));
      sampled += texture2D(uTexture, coverUv + vec2(0.0, -blurOffset)) * 2.0;
      sampled += texture2D(uTexture, coverUv + vec2(blurOffset, -blurOffset));
      sampled += texture2D(uTexture, coverUv + vec2(-blurOffset, 0.0)) * 2.0;
      sampled += texture2D(uTexture, coverUv) * 4.0;
      sampled += texture2D(uTexture, coverUv + vec2(blurOffset, 0.0)) * 2.0;
      sampled += texture2D(uTexture, coverUv + vec2(-blurOffset, blurOffset));
      sampled += texture2D(uTexture, coverUv + vec2(0.0, blurOffset)) * 2.0;
      sampled += texture2D(uTexture, coverUv + vec2(blurOffset, blurOffset));
      sampled /= 16.0;
    }
    vec3 color = sampled.rgb * uShade;
    gl_FragColor = vec4(color, sampled.a * alpha);
  }
`
