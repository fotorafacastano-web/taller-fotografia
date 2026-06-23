import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./ManifestoSection.css";

gsap.registerPlugin(useGSAP);

const PHOTOS = [
  { src: "/hero-bg.jpg", className: "mf-photo--1", baseRotate: -7, strength: 0.6 },
  { src: "/hero-bg.jpg", className: "mf-photo--2", baseRotate: 5, strength: 0.9 },
  { src: "/hero-bg.jpg", className: "mf-photo--3", baseRotate: 6, strength: 0.8 },
  { src: "/hero-bg.jpg", className: "mf-photo--4", baseRotate: -4, strength: 1.1 },
];

export default function ManifestoSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const setters = photoRefs.current.map((el, i) => ({
        x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
        rotate: gsap.quickTo(el, "rotate", { duration: 0.6, ease: "power3.out" }),
        strength: PHOTOS[i].strength,
        baseRotate: PHOTOS[i].baseRotate,
      }));

      const handleMove = (e: PointerEvent) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        setters.forEach((s) => {
          s.x(nx * 60 * s.strength);
          s.y(ny * 60 * s.strength);
          s.rotate(s.baseRotate + nx * 10 * s.strength);
        });
      };

      const handleLeave = () => {
        setters.forEach((s) => {
          s.x(0);
          s.y(0);
          s.rotate(s.baseRotate);
        });
      };

      const stageEl = stageRef.current;
      stageEl?.addEventListener("pointermove", handleMove);
      stageEl?.addEventListener("pointerleave", handleLeave);

      return () => {
        stageEl?.removeEventListener("pointermove", handleMove);
        stageEl?.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: stageRef }
  );

  return (
    <section className="mf-section">
      <div className="mf-stage" ref={stageRef}>
        {PHOTOS.map((p, i) => (
          <div
            className={`mf-photo ${p.className}`}
            key={i}
            ref={(el) => {
              if (el) photoRefs.current[i] = el;
            }}
            style={{ transform: `rotate(${p.baseRotate}deg)` }}
          >
            <img src={p.src} alt="" />
          </div>
        ))}

        <div className="mf-center">
          <p className="mf-text">
            «Una y no más» no es solo un nombre. Es un grito.
            <br />
            <br />
            Lo que dices cuando te venden humo.
            <br />
            Cuando te prometen estrategia y te entregan postureo.
            <br />
            Cuando ves marcas tan vacías como sus feeds.
          </p>
          <a href="#equipo" className="mf-cta">Conócenos</a>
        </div>
      </div>
    </section>
  );
}
