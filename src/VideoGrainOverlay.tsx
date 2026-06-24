import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uVideo;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uVideoResolution;
  varying vec2 vUv;

  float noise(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233)) + uTime * 60.0) * 43758.5453);
  }

  void main() {
    vec2 screenRatio = uResolution / uVideoResolution.x;
    vec2 scale = uResolution / uVideoResolution;
    float coverScale = max(scale.x, scale.y);
    vec2 scaledRes = uVideoResolution * coverScale;
    vec2 offset = (uResolution - scaledRes) * 0.5;
    vec2 uv = (vUv * uResolution - offset) / scaledRes;

    float aberration = 0.0028;
    vec2 dir = uv - 0.5;
    float r = texture2D(uVideo, uv - dir * aberration).r;
    float g = texture2D(uVideo, uv).g;
    float b = texture2D(uVideo, uv + dir * aberration).b;

    vec3 color = vec3(r, g, b);

    float grain = noise(vUv * uResolution) * 0.08;
    color += grain - 0.04;

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      discard;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface VideoGrainOverlayProps {
  video: HTMLVideoElement | null;
}

export default function VideoGrainOverlay({ video }: VideoGrainOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !video) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uVideo: { value: texture },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uVideoResolution: { value: new THREE.Vector2(1920, 1080) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.uResolution.value.set(clientWidth, clientHeight);
      if (video.videoWidth && video.videoHeight) {
        uniforms.uVideoResolution.value.set(video.videoWidth, video.videoHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const animate = (t: number) => {
      uniforms.uTime.value = t / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      texture.dispose();
      material.dispose();
      mesh.geometry.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [video]);

  return <div ref={containerRef} className="ds-grain-overlay" />;
}
