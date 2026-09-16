import React, { useEffect, useRef } from 'react';

export function InductionCardEffect({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
        if (!gl) return;

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

        const FS_BTN = `
            precision highp float;
            uniform vec2 u_res;
            uniform float u_time;
            uniform float u_arcs;
            uniform float u_flash;
            
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
            float sdRBox(vec2 p, vec2 b, float r){
                vec2 q = abs(p) - b + r;
                return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
            }
            void main(){
                vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
                float ar = u_res.x / u_res.y;
                // Ajustamos el tamaño de la caja para que ocupe todo el canvas menos un margen (0.02)
                vec2 hs = vec2(ar * 0.5 - 0.02, 0.5 - 0.02);
                float d = sdRBox(p, hs, 0.04);
                float t = u_time;
                float hover = clamp(u_arcs / 6.0, 0.0, 1.0);
                
                // Fondo transparente
                vec4 col = vec4(0.0);
                
                float a = atan(p.y, p.x);
                vec3 arcCol = vec3(0.0);
                for (int i = 0; i < 6; i++) {
                    float fi = float(i);
                    float w = clamp(u_arcs - fi, 0.0, 1.0);
                    float n1 = fbm(vec2(a * 2.4 + fi * 11.3, t * (1.6 + fi * 0.27) + fi * 53.1));
                    float off = (n1 - 0.5) * (0.11 + u_flash * 0.1);
                    float seg = smoothstep(0.35, 0.75, noise(vec2(a * 1.8 + fi * 7.7, t * (0.9 + fi * 0.13) + fi * 19.0)));
                    seg = 0.3 + 0.7 * seg;
                    float g = 0.002 / (abs(d + off) + 0.002);
                    // Colores lilas/morados para los arcos
                    arcCol += (vec3(0.6, 0.1, 0.9) * g + vec3(0.8, 0.4, 1.0) * g * g * 0.55) * w * seg;
                }
                float outerMask = 1.0 - smoothstep(0.01, 0.05, d);
                // Si está dentro de la tarjeta (d < 0), mantenemos arcCol pero muy tenue si queremos, o solo borde.
                // En este caso, arcCol brilla en el borde (d=0).
                
                vec3 finalRGB = arcCol * (0.6 + 0.4 * hover) * outerMask;
                float ring = 0.006 / (abs(d) + 0.006);
                finalRGB += vec3(0.8, 0.5, 1.0) * ring * u_flash * 1.5 * outerMask;
                finalRGB += vec3(0.7, 0.3, 0.9) * u_flash * 0.16 * outerMask;
                
                // Opacidad basada en el brillo para que el centro sea transparente
                float alpha = clamp(length(finalRGB), 0.0, 1.0);
                
                gl_FragColor = vec4(finalRGB, alpha);
            }
        `;

        const prog = createProgram(gl, VS, FS_BTN);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
        const locP = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(locP);
        gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, 'u_res');
        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uArcs = gl.getUniformLocation(prog, 'u_arcs');
        const uFlash = gl.getUniformLocation(prog, 'u_flash');

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
            const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        }
        window.addEventListener('resize', resize);
        resize();

        let arcs = 3.5, arcsTarget = 3.5, flash = 0, crawl = 0;
        let last = performance.now();
        let frameId;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Simulate continuous hover to keep arcs alive
        const handleEnter = () => arcsTarget = 6.0;
        const handleLeave = () => arcsTarget = 3.5;
        
        const parent = canvas.parentElement;
        if (parent) {
            parent.addEventListener('mouseenter', handleEnter);
            parent.addEventListener('mouseleave', handleLeave);
        }

        function frame(now) {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            arcs += (arcsTarget - arcs) * Math.min(1, dt * 5);
            flash *= Math.exp(-3.6 * dt);
            crawl += dt * (0.4 + (arcs / 6) * 0.8 + flash * 2.0);
            resize();
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, reduced ? 3.0 : crawl);
            gl.uniform1f(uArcs, arcs);
            gl.uniform1f(uFlash, flash);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            frameId = requestAnimationFrame(frame);
        }
        frameId = requestAnimationFrame(frame);
        
        return () => {
            window.removeEventListener('resize', resize);
            if (parent) {
                parent.removeEventListener('mouseenter', handleEnter);
                parent.removeEventListener('mouseleave', handleLeave);
            }
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className={`absolute inset-0 w-full h-full pointer-events-none block z-0 ${className}`} 
            aria-hidden="true" 
        />
    );
}
