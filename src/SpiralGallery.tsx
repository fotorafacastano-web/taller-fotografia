import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import "./SpiralGallery.css";

const PHOTOS = [
  "/RafaCastano-1.avif",
  "/RafaCastano-2.avif",
  "/RafaCastano-3.avif",
  "/RafaCastano-4.avif",
  "/RafaCastano-5.avif",
  "/RafaCastano-6.avif",
];

const PROJECT_TITLES = [
  "Almería Turismo",
  "Mallorca Turismo",
  "Roquetas de Mar",
  "Sierra de las Nieves",
  "Verano Ceremonia",
  "Agricultura",
  "Identidad Visual",
  "Diseño Web",
  "Copade",
  "Cool Green",
  "Interflora Internacional",
];

const DESCRIPTIONS = [
  "Campañas de contenido y vídeo para promoción turística, capturando paisajes y experiencias auténticas.",
  "Producción visual para destinos mediterráneos, combinando fotografía editorial y storytelling de marca.",
  "Identidad visual y reportaje fotográfico para un municipio en plena transformación costera.",
  "Documentación visual de espacios naturales protegidos, con foco en luz natural y composición.",
  "Cobertura fotográfica de bodas y eventos de verano, capturando momentos con un estilo cinematográfico.",
  "Reportaje de producción agrícola local, mostrando el proceso desde el campo hasta el producto final.",
  "Desarrollo de identidad visual completa: logotipo, paleta y aplicaciones de marca.",
  "Diseño y desarrollo de experiencias web a medida, con foco en narrativa visual y rendimiento.",
  "Branding y producción de contenido para una marca con propósito social.",
  "Dirección de arte y fotografía de producto para una marca de bienestar y sostenibilidad.",
  "Campaña internacional de contenido floral, fotografía de producto y dirección creativa.",
];

const ITEM_COUNT = 30;
const RADIUS = 85.0;
const HEIGHT_STEP = 6.0;
const ANGLE_STEP = 0.45;

const VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uOffset;
  uniform float uTime;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float isGlitch = step(0.985, noise(vec2(uTime * 1.2, floor(uv.y * 30.0))));
    float glitchForce = (abs(uOffset) * 2.5) * isGlitch;

    pos.x += glitchForce * sin(uTime * 25.0);

    float wave = sin(uv.y * 8.0 + uTime * 3.0) * abs(uOffset) * 0.4;
    pos.x += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uTextTexture;
  uniform float uAlpha;
  uniform float uHover;
  uniform float uTime;
  uniform float uOffset;

  void main() {
    float shift = (abs(uOffset) * 0.06);
    vec4 tex;

    if (gl_FrontFacing) {
      float r = texture2D(uTextTexture, vUv + vec2(shift, 0.0)).r;
      float g = texture2D(uTextTexture, vUv).g;
      float b = texture2D(uTextTexture, vUv - vec2(shift, 0.0)).b;
      tex = vec4(r, g, b, 1.0);
    } else {
      vec2 imgUv = vec2(1.0 - vUv.x, vUv.y);
      float r = texture2D(uTexture, imgUv + vec2(shift, 0.0)).r;
      float g = texture2D(uTexture, imgUv).g;
      float b = texture2D(uTexture, imgUv - vec2(shift, 0.0)).b;
      tex = vec4(r, g, b, 1.0);
    }

    float scanline = sin(vUv.y * 1000.0) * 0.03;
    float n = (fract(sin(dot(vUv, vec2(12.9898, 78.233) * uTime)) * 43758.5453)) * 0.05;

    tex.rgb -= scanline;
    tex.rgb += n;

    gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
  }
`;

function createTextTexture(title: string, index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";

  ctx.globalAlpha = 1.0;
  ctx.font = 'italic 400 80px "Cormorant Garamond", serif';
  ctx.fillText((index + 1).toString().padStart(2, "0"), 100, 150);

  ctx.globalAlpha = 0.15;
  ctx.fillRect(100, 200, 120, 2);

  ctx.globalAlpha = 0.95;
  ctx.font = '400 42px "Inter", sans-serif';
  const description = DESCRIPTIONS[index % DESCRIPTIONS.length];
  const words = description.split(" ");
  let line = "";
  let y = 320;
  const maxWidth = 900;
  const lineHeight = 58;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 100, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, y);

  ctx.globalAlpha = 0.4;
  ctx.font = 'italic 400 22px "Cormorant Garamond", serif';
  ctx.fillText(`PROYECTO: ${title.toUpperCase()}`, 100, 750);
  ctx.fillText(`ID: 0x${(index * 13).toString(16).toUpperCase()}`, 100, 790);
  ctx.fillText(`ESTADO: ACTIVO`, 100, 830);

  ctx.textAlign = "right";
  ctx.globalAlpha = 0.2;
  ctx.font = 'italic 400 22px "Cormorant Garamond", serif';
  ctx.fillText("RAFA CASTAÑO // ARCHIVE", 1500, 120);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export default function SpiralGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.006);

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 160);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030303);
    container.appendChild(renderer.domElement);

    const spiralGroup = new THREE.Group();
    scene.add(spiralGroup);

    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(32, 18, 32, 32);
    const hitGeometry = new THREE.PlaneGeometry(32, 18);
    const hitMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });

    interface ItemData {
      container: THREE.Group;
      mesh: THREE.Mesh;
      hitMesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      initialIndex: number;
      state: { flip: number; scale: number };
    }

    const items: ItemData[] = [];

    for (let i = 0; i < ITEM_COUNT; i++) {
      const photo = PHOTOS[i % PHOTOS.length];
      const texture = textureLoader.load(photo);
      const title = PROJECT_TITLES[i % PROJECT_TITLES.length];
      const textTexture = createTextTexture(title, i);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uTextTexture: { value: textTexture },
          uOffset: { value: 0.0 },
          uAlpha: { value: 0.0 },
          uTime: { value: 0.0 },
          uHover: { value: 0.0 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

      const cardContainer = new THREE.Group();
      cardContainer.add(mesh);
      cardContainer.add(hitMesh);

      const itemData: ItemData = {
        container: cardContainer,
        mesh,
        hitMesh,
        material,
        initialIndex: i,
        state: { flip: 0, scale: 1 },
      };

      spiralGroup.add(cardContainer);
      items.push(itemData);
      gsap.to(material.uniforms.uAlpha, { value: 1, duration: 1.5, delay: i * 0.03 });
    }

    let scrollY = 0;
    let targetScrollY = 0;
    let currentItemIndex = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredItem: ItemData | null = null;

    const onWheel = (e: WheelEvent) => {
      targetScrollY += e.deltaY * 0.005;
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    const animate = (time: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);

      scrollY += (targetScrollY - scrollY) * 0.06;
      const scrollSpeed = targetScrollY - scrollY;

      camera.position.y = scrollY * -HEIGHT_STEP;
      camera.lookAt(0, camera.position.y, 0);
      spiralGroup.rotation.y = -scrollY * ANGLE_STEP;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(items.map((i) => i.hitMesh));

      let detected: ItemData | null = null;
      if (intersects.length > 0) {
        const targetHitMesh = intersects[0].object;
        const targetData = items.find((i) => i.hitMesh === targetHitMesh) ?? null;
        if (targetData) {
          let vIdx = targetData.initialIndex - scrollY;
          const half = ITEM_COUNT / 2;
          while (vIdx < -half) vIdx += ITEM_COUNT;
          while (vIdx > half) vIdx -= ITEM_COUNT;
          if (Math.abs(vIdx) < 4.0) detected = targetData;
        }
      }

      if (detected !== hoveredItem) {
        if (hoveredItem) {
          gsap.to(hoveredItem.material.uniforms.uHover, { value: 0, duration: 0.6 });
          gsap.to(hoveredItem.state, { flip: 0, scale: 1, duration: 0.8, ease: "power2.inOut" });
        }
        hoveredItem = detected;
        if (hoveredItem) {
          gsap.to(hoveredItem.material.uniforms.uHover, { value: 1, duration: 0.4 });
          gsap.to(hoveredItem.state, { flip: Math.PI, scale: 1.15, duration: 0.8, ease: "power3.out" });
        }
      }

      const nIndex = ((Math.round(scrollY) % ITEM_COUNT) + ITEM_COUNT) % ITEM_COUNT;
      if (nIndex !== currentItemIndex) {
        currentItemIndex = nIndex;
        if (counterRef.current) counterRef.current.innerText = (currentItemIndex + 1).toString().padStart(2, "0");
        if (titleRef.current) titleRef.current.innerText = PROJECT_TITLES[currentItemIndex % PROJECT_TITLES.length];
      }

      items.forEach((item) => {
        let virtualIdx = item.initialIndex - scrollY;
        const half = ITEM_COUNT / 2;
        while (virtualIdx < -half) virtualIdx += ITEM_COUNT;
        while (virtualIdx > half) virtualIdx -= ITEM_COUNT;

        const actualIdx = virtualIdx + scrollY;
        const angle = actualIdx * ANGLE_STEP;
        const yPos = actualIdx * -HEIGHT_STEP;
        const targetAngle = Math.atan2(Math.sin(angle), Math.cos(angle)) + Math.PI;

        item.container.position.set(Math.sin(angle) * RADIUS, yPos, Math.cos(angle) * RADIUS);
        item.container.rotation.set(0, targetAngle, 0);

        item.mesh.rotation.y = item.state.flip;
        item.mesh.scale.set(item.state.scale, item.state.scale, 1);

        item.material.uniforms.uTime.value = time * 0.001;
        item.material.uniforms.uOffset.value = scrollSpeed;

        const dist = Math.abs(virtualIdx);
        const baseAlpha = THREE.MathUtils.clamp(4.0 - dist * 0.45, 0.05, 1.0);
        item.material.uniforms.uAlpha.value = baseAlpha;

        item.container.renderOrder = item.material.uniforms.uHover.value > 0.1 ? 1000 : Math.floor(200 - dist);
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      items.forEach((item) => {
        item.material.dispose();
        item.material.uniforms.uTexture.value?.dispose();
        item.material.uniforms.uTextTexture.value?.dispose();
      });
      geometry.dispose();
      hitGeometry.dispose();
      hitMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="spiral-section">
      <div className="spiral-grid" />
      <div className="spiral-ui">
        <div className="spiral-header">
          <span className="spiral-brand">RAFA CASTAÑO // ARCHIVE</span>
        </div>
        <div className="spiral-footer">
          <div className="spiral-meta">
            <span>
              PROYECTO: <span ref={counterRef}>01</span> / 30
            </span>
            <span>SCROLL PARA EXPLORAR</span>
          </div>
          <h2 className="spiral-title" ref={titleRef}>
            Almería Turismo
          </h2>
        </div>
      </div>
      <div className="spiral-canvas" ref={containerRef} />
    </section>
  );
}
