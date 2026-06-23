import { useState } from "react";
import "./WorkSection.css";

const PROJECTS = [
  {
    name: "Proyecto Uno",
    images: ["/RafaCastano-1.avif", "/RafaCastano-2.avif"],
  },
  {
    name: "Proyecto Dos",
    images: ["/RafaCastano-3.avif", "/RafaCastano-4.avif"],
  },
  {
    name: "Proyecto Tres",
    images: ["/RafaCastano-5.avif", "/RafaCastano-6.avif"],
  },
  {
    name: "Proyecto Cuatro",
    images: ["/RafaCastano-1.avif", "/RafaCastano-3.avif"],
  },
];

export default function WorkSection() {
  const [hovered, setHovered] = useState(0);

  return (
    <section className="work-section">
      <p className="work-label">( work )</p>

      <div className="work-body">
        <ul className="work-list">
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
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className={`work-media-group${hovered === i ? " work-media-group--visible" : ""}`}
            >
              {p.images.map((src, j) => (
                <img key={j} src={src} alt={p.name} className={`work-media-img work-media-img--${j}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
