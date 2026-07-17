import * as THREE from 'three'

export function createSpriteAtlasBubbleMaterial(
  textureUniform: { value: THREE.Texture },
  opacityUniform: { value: number },
  spriteIndexUniform: { value: number },
) {
  return new THREE.ShaderMaterial({
    depthTest: true,
    depthWrite: true,
    fragmentShader: `
      uniform sampler2D videoTexture;
      uniform float spriteIndex;
      uniform float opacity;
      varying vec3 vLocalPosition;
      varying vec3 vNormal;
      varying vec3 vViewDirection;

      vec3 increaseSaturation(vec3 color, float amount) {
        vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
        return mix(gray, color, amount);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewDirection);
        float facing = max(dot(normal, viewDirection), 0.0);
        float fresnel = pow(1.0 - facing, 2.0);
        vec3 distortedPosition = vLocalPosition + normal * fresnel * 0.9;
        vec3 blending = pow(abs(normal), vec3(8.0));
        blending /= max(blending.x + blending.y + blending.z, 0.0001);

        float row = floor(spriteIndex / 8.0);
        float column = mod(spriteIndex, 8.0);
        vec2 spriteSize = vec2(0.125, 0.2);
        vec2 spriteOffset = vec2(column * spriteSize.x, (4.0 - row) * spriteSize.y);
        vec3 triUv = distortedPosition * 0.5 + 0.5;
        vec3 colorX = texture2D(videoTexture, triUv.zy * spriteSize + spriteOffset).rgb;
        vec3 colorY = texture2D(videoTexture, triUv.xz * spriteSize + spriteOffset).rgb;
        vec3 colorZ = texture2D(videoTexture, triUv.xy * spriteSize + spriteOffset).rgb;
        vec3 color = colorX * blending.x + colorY * blending.y + colorZ * blending.z;

        color = pow(max(color, vec3(0.0)), vec3(2.2));
        color = increaseSaturation(color, 1.1);

        vec3 lightDirection = normalize(vec3(-0.55, 0.78, 1.0));
        vec3 halfDirection = normalize(lightDirection + viewDirection);
        float diffuse = max(dot(normal, lightDirection), 0.0);
        float specular = pow(max(dot(normal, halfDirection), 0.0), 40.0);
        vec3 edgeTint = mix(vec3(0.58, 0.86, 1.0), vec3(1.0), facing);

        color *= 0.9 + diffuse * 0.16;
        color += edgeTint * fresnel * 0.2;
        color += vec3(1.0) * specular * 0.22;
        gl_FragColor = vec4(color, opacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    uniforms: {
      opacity: opacityUniform,
      spriteIndex: spriteIndexUniform,
      videoTexture: textureUniform,
    },
    vertexShader: `
      varying vec3 vLocalPosition;
      varying vec3 vNormal;
      varying vec3 vViewDirection;

      void main() {
        vLocalPosition = position;
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(-modelViewPosition.xyz);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
  })
}
