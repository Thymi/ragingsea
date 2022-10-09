varying vec3 vDepthColor;
varying vec3 vSurfaceColor;
varying float vElevation;
varying float vColorOffset;
varying float vColorMultiplier;

void main() {
   float colorDepthMix = (vElevation + vColorOffset) * vColorMultiplier;
   vec3 color = mix(vDepthColor, vSurfaceColor, colorDepthMix);
   gl_FragColor = vec4(color, 1.0);
}