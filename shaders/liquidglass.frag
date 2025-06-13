#include <flutter/runtime_effect.glsl>
#define PI    3.14159265

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_texture_input;

out vec4 frag_color;

#define PX(a) a / u_resolution.y

float RBoxSDF(vec2 p, vec2 center, vec2 size, float radius) {
    vec2 q = abs(p - center) - size + radius;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

void main() {
    vec2 uv = FlutterFragCoord().xy / u_resolution;
    vec2 Mst = u_mouse / u_resolution;
    vec2 rectSize = vec2(200., 150.) * 0.5 / u_resolution;
    float radius = PX(75.);

    float box = RBoxSDF(uv, Mst, rectSize, radius);

    float boxShape = smoothstep(PX(1.5), 0., box);
    float edgeRefraction = smoothstep(-.7, 1., smoothstep(PX(15.), PX(- 15.), box));

    float ambientLight = boxShape * smoothstep(PX(- 5.), PX(10.), box) * 0.1;

    // Using mouse coord
    vec2 lightDir = normalize(vec2(.5,1.) - Mst);
    vec2 boxNormal = uv - Mst;
    float diffuseLight = 2.3 * dot(boxNormal, lightDir);
    diffuseLight *= boxShape - smoothstep(0, PX(- 2.5), box);
    vec3 light = vec3(ambientLight + abs(diffuseLight));

    float shadow = (1. - abs(box));
    shadow = max(0.,(shadow - .99) * 10);
    // Adjust basing light
//    shadow *= -dot(boxNormal, lightDir);

    vec2 refractedUV = uv - Mst;
    refractedUV *= edgeRefraction;
    refractedUV += Mst;

    vec3 color = mix(texture(u_texture_input, uv).rgb, texture(u_texture_input, refractedUV).rgb, boxShape);
    color += light;
    color -= shadow;

    frag_color = vec4(color, 1.0);
//    frag_color = vec4(vec3(shadow), 1.);
}
