#include <flutter/runtime_effect.glsl>
#define PI    3.14159265

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
    vec2 rectSize = vec2(200., 100.) * 0.5 / u_resolution;
    float radius = PX(50.);

    float box = RBoxSDF(uv, Mst, rectSize, radius);

    float boxShape = smoothstep(PX(1.5), 0., box);
    float edgeRefraction = smoothstep(-.2, 1., smoothstep(PX(15.), PX(-15.), box));

    float ambientLight = boxShape * smoothstep(PX(- 5.), PX(10.), box) * 0.1;

    vec2 lightDir = normalize(vec2(-1., -1.));
    vec2 boxNormal = uv - Mst;
    float diffuseLight = 3.3 * dot(boxNormal, lightDir);
    diffuseLight *= boxShape - smoothstep(0, PX(-2.5), box);

    vec3 light = vec3(ambientLight + abs(diffuseLight));

    vec2 refractedUV = uv - Mst;
    refractedUV *= edgeRefraction;
    refractedUV += Mst;
    vec3 bg = texture(u_texture_input, uv).rgb;

    vec3 color = mix(bg, texture(u_texture_input, refractedUV).rgb, boxShape);
    color += light;

    frag_color = vec4(color, 1.0);
//    frag_color = vec4(vec3(edgeRefraction), 1.);
}