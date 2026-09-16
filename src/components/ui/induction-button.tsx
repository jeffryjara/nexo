"use client";

import { useMemo, type CSSProperties } from "react";

type FocusRole = "background" | "button" | "visual";
type EffectMode = "light" | "dark";

type FocusTarget = {
  selector: string;
  role: FocusRole;
  fit?: "cover" | "contain-square" | "wide-wordmark" | "portrait-stage";
  preserveTransform?: boolean;
};

type EffectDefinition = {
  title: string;
  source: string;
  background: string;
  targets: readonly FocusTarget[];
  theme?: {
    nativeMode?: EffectMode;
    lightBackground: string;
    darkBackground: string;
    invertBackground?: boolean;
  };
  transformSource?: (source: string, mode: EffectMode) => string;
  hiddenTargets?: readonly string[];
  introWordmark?: {
    sceneSelector: string;
    text: string;
    fontSize: number;
    endTime: number;
    holdTime: number;
    logoSvg: string;
  };
};

const inductionSource = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VALENCE CORE | Kinetic Induction</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body class="bg-neutral-950 text-neutral-50 h-screen w-screen overflow-hidden font-sans flex flex-col relative antialiased">
    <canvas id="bg-canvas" class="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-none" aria-hidden="true"></canvas>
    <script>
        (function () {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            function compileShader(gl, type, src) {
                const s = gl.createShader(type);
                gl.shaderSource(s, src);
                gl.compileShader(s);
                return s;
            }
            function createProgram(gl, vsSrc, fsSrc) {
                const prog = gl.createProgram();
                gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vsSrc));
                gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fsSrc));
                gl.linkProgram(prog);
                return prog;
            }
            const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
            function initBackgroundGL() {
                const canvas = document.getElementById('bg-canvas');
                const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
                if (!gl) return;
                const FS_BG = \`
                    precision highp float;
                    uniform vec2 u_res;
                    uniform float u_time;
                    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
                    float noise(vec2 p){
                        vec2 i=floor(p), f=fract(p);
                        vec2 u=f*f*(3.0-2.0*f);
                        return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
                                   mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
                    }
                    float fbm(vec2 p){
                        float v=0.0; float a=0.5;
                        for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.05+vec2(9.7,3.1); a*=0.5; }
                        return v;
                    }
                    void main(){
                        vec2 uv = gl_FragCoord.xy / u_res.y;
                        float t = u_time * 0.1;
                        float n1 = fbm(uv * 1.5 + vec2(t * 0.2, t * 0.1));
                        float n2 = fbm(uv * 2.0 - vec2(t * 0.15, -t * 0.2) + n1);
                        vec3 baseCol = vec3(0.039, 0.039, 0.039);
                        vec3 highlightCol = vec3(0.05, 0.01, 0.10); // Changed to purple natively
                        vec3 col = mix(baseCol, highlightCol, n2 * 0.5);
                        vec2 grid = fract(uv * 20.0);
                        float line = smoothstep(0.95, 1.0, max(grid.x, grid.y));
                        col += vec3(0.015) * line * (1.0 - n1);
                        gl_FragColor = vec4(col, 1.0);
                    }
                \`;
                const prog = createProgram(gl, VS, FS_BG);
                gl.useProgram(prog);
                const buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
                const locP = gl.getAttribLocation(prog, 'p');
                gl.enableVertexAttribArray(locP);
                gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);
                const uRes = gl.getUniformLocation(prog, 'u_res');
                const uTime = gl.getUniformLocation(prog, 'u_time');
                function resize() {
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    const w = Math.round(canvas.clientWidth * dpr);
                    const h = Math.round(canvas.clientHeight * dpr);
                    if (canvas.width !== w || canvas.height !== h) {
                        canvas.width = w; canvas.height = h;
                        gl.viewport(0, 0, w, h);
                    }
                }
                window.addEventListener('resize', resize);
                resize();
                function render(now) {
                    resize();
                    gl.uniform2f(uRes, canvas.width, canvas.height);
                    gl.uniform1f(uTime, reduced ? 0 : now / 1000);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);
                    requestAnimationFrame(render);
                }
                requestAnimationFrame(render);
            }
            initBackgroundGL();
        })();
    </script>
</body>
</html>`;

const INDUCTION_EFFECT: EffectDefinition = {
  title: "Induction Background",
  source: inductionSource,
  background: "#050505",
  theme: {
    nativeMode: "dark",
    lightBackground: "#f4f7fb",
    darkBackground: "#050505",
    invertBackground: true,
  },
  targets: [
    { selector: "#bg-canvas", role: "background" }
  ],
};

export type InductionButtonProps = {
  mode?: EffectMode;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

const DEFAULTS = {
  mode: "dark" as EffectMode,
  hue: 0,
  saturation: 1,
  brightness: 1,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function effectBackground(definition: EffectDefinition, mode: EffectMode) {
  return definition.theme?.[`${mode}Background`] ?? definition.background;
}

function buildFocusedDocument(definition: EffectDefinition, mode: EffectMode) {
  const background = effectBackground(definition, mode);
  const invertBackground =
    definition.theme?.invertBackground === true &&
    definition.theme.nativeMode !== mode;
  const source =
    definition.transformSource?.(definition.source, mode) ?? definition.source;
  const targetJson = JSON.stringify(definition.targets).replace(
    /</g,
    "\\u003c",
  );
  const hiddenTargetJson = JSON.stringify(
    definition.hiddenTargets ?? [],
  ).replace(/</g, "\\u003c");
  const introWordmarkJson = JSON.stringify(
    definition.introWordmark ?? null,
  ).replace(/</g, "\\u003c");
  const modeJson = JSON.stringify(mode);
  const backgroundFilter = invertBackground
    ? "filter: invert(1) hue-rotate(180deg) saturate(.92) brightness(1.02) !important;"
    : "";
  const focusStyle = `<style data-threeui-focus>
html, body { width: 100% !important; height: 100% !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background: ${background} !important; color-scheme: ${mode} !important; }
body { position: relative !important; display: flex !important; align-items: center !important; justify-content: center !important; }
body > * { visibility: hidden !important; }
body[data-threeui-ready] > [data-threeui-role] { visibility: visible !important; }
[data-threeui-residual] { display: none !important; }
[data-threeui-hidden] { display: none !important; }
[data-threeui-role="background"] { position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; z-index: 0 !important; opacity: 1 !important; pointer-events: none !important; ${backgroundFilter} }
</style>`;
  const focusScript = `<script data-threeui-focus>
(function () {
  document.documentElement.dataset.sfMode = ${modeJson};
  var isolated = false;
  function isolate() {
    if (isolated) return;
    var specs = ${targetJson};
    var roots = [];
    specs.forEach(function (spec) {
      var element = document.querySelector(spec.selector);
      if (!element) return;
      element.setAttribute('data-threeui-role', spec.role);
      if (!roots.some(function (root) { return root.contains(element); })) roots.push(element);
    });
    if (!roots.length) return;
    isolated = true;
    roots.forEach(function (root) {
      document.body.appendChild(root);
    });
    Array.from(document.body.children).forEach(function (element) {
      if (roots.indexOf(element) !== -1) return;
      element.setAttribute('data-threeui-residual', '');
      element.setAttribute('aria-hidden', 'true');
    });
    document.body.setAttribute('data-threeui-ready', '');
  }
  function scheduleIsolation() { setTimeout(isolate, 100); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleIsolation, { once: true });
  else scheduleIsolation();
  window.addEventListener('load', isolate, { once: true });
})();
</script>`;
  return source
    .replace(/<\/head>/i, `${focusStyle}</head>`)
    .replace(/<\/body>/i, `${focusScript}</body>`);
}

function NeuformIsolatedEffect({
  definition,
  mode = DEFAULTS.mode,
  hue = DEFAULTS.hue,
  saturation = DEFAULTS.saturation,
  brightness = DEFAULTS.brightness,
  className,
  style,
}: InductionButtonProps & { definition: EffectDefinition }) {
  const safeMode: EffectMode = mode === "light" ? "light" : "dark";
  const background = effectBackground(definition, safeMode);
  const source = useMemo(
    () => buildFocusedDocument(definition, safeMode),
    [definition, safeMode],
  );
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      className={className}
      data-mode={safeMode}
      title={definition.title}
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background,
        filter,
        ...style,
      }}
    />
  );
}

export function InductionBackground(props: InductionButtonProps) {
  return <NeuformIsolatedEffect {...props} definition={INDUCTION_EFFECT} />;
}
