import { useEffect, useRef, useState } from "react";
import "./WorkSection.css";

const WIDTH_RATIOS = [0.25, 0.5, 0.75, 1];

const PHOTOS = [
  "/RafaCastano-1.avif",
  "/RafaCastano-2.avif",
  "/RafaCastano-3.avif",
  "/RafaCastano-4.avif",
  "/RafaCastano-5.avif",
  "/RafaCastano-6.avif",
];

const PROJECT_NAMES = [
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

const PROJECTS = PROJECT_NAMES.map((name, i) => ({
  name,
  images: Array.from({ length: 4 }, (_, j) => PHOTOS[(i + j) % PHOTOS.length]),
}));

export default function WorkSection() {
  const [hovered, setHovered] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const recalc = () => {
    const mediaEl = mediaRef.current;
    const bodyEl = bodyRef.current;
    if (!mediaEl || !bodyEl) return;
    const containerHeight = mediaEl.clientHeight;
    const maxWidthRatio = window.innerWidth <= 900 ? 0.78 : 0.45;
    const maxWidth = bodyEl.clientWidth * maxWidthRatio;
    if (!containerHeight || !maxWidth) return;

    const aspects = imgRefs.current.map((img) =>
      img && img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null
    );
    if (aspects.some((a) => !a)) return;

    const sum = WIDTH_RATIOS.reduce((acc, r, i) => acc + r / (aspects[i] as number), 0);
    const baseWidth = Math.min(containerHeight / sum, maxWidth);
    setWidths(WIDTH_RATIOS.map((r) => r * baseWidth));
  };

  useEffect(() => {
    setWidths(null);
    recalc();
  }, [hovered]);

  useEffect(() => {
    const bodyEl = bodyRef.current;
    if (!bodyEl) return;
    const observer = new ResizeObserver(() => recalc());
    observer.observe(bodyEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="work-section" id="work">
      <p className="work-label">Works</p>
      <div className="work-body" ref={bodyRef}>
        <ul className="work-list" onMouseLeave={() => setHovered(0)}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.name}
              className={`work-item${hovered === i ? " work-item--active" : ""}`}
              onMouseEnter={() => setHovered(i)}
            >
              <span className="work-name">{p.name}</span>
            </li>
          ))}
        </ul>

        <div className="work-media" ref={mediaRef}>
          <div className="work-media-stack" key={hovered}>
            {PROJECTS[hovered].images.map((src, j) => (
              <img
                key={j}
                src={src}
                alt={PROJECTS[hovered].name}
                className="work-media-img"
                ref={(el) => {
                  imgRefs.current[j] = el;
                }}
                onLoad={recalc}
                style={widths ? { width: `${widths[j]}px` } : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
