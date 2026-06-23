import { useState } from "react";
import "./WorkSection.css";

const PHOTOS = [
  "/RafaCastano-1.avif",
  "/RafaCastano-2.avif",
  "/RafaCastano-3.avif",
  "/RafaCastano-4.avif",
  "/RafaCastano-5.avif",
  "/RafaCastano-6.avif",
];

const PROJECT_NAMES = [
  "Proyecto Uno",
  "Proyecto Dos",
  "Proyecto Tres",
  "Proyecto Cuatro",
  "Proyecto Cinco",
  "Proyecto Seis",
  "Proyecto Siete",
  "Proyecto Ocho",
  "Proyecto Nueve",
  "Proyecto Diez",
];

const PROJECTS = PROJECT_NAMES.map((name, i) => ({
  name,
  images: Array.from({ length: 4 }, (_, j) => PHOTOS[(i + j) % PHOTOS.length]),
}));

export default function WorkSection() {
  const [hovered, setHovered] = useState(0);

  return (
    <section className="work-section">
      <div className="work-body">
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

        <div className="work-media">
          <div className="work-media-stack" key={hovered}>
            {PROJECTS[hovered].images.map((src, j) => (
              <img key={j} src={src} alt={PROJECTS[hovered].name} className="work-media-img" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
