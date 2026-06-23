import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./ManifestoSection.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PHOTOS = [
  { src: "/RafaCastano-1.avif", className: "mf-photo--1", baseRotate: -7, strength: 0.6 },
  { src: "/RafaCastano-2.avif", className: "mf-photo--2", baseRotate: 5, strength: 0.9 },
  { src: "/RafaCastano-3.avif", className: "mf-photo--3", baseRotate: 6, strength: 0.8 },
  { src: "/RafaCastano-4.avif", className: "mf-photo--4", baseRotate: -4, strength: 1.1 },
  { src: "/RafaCastano-5.avif", className: "mf-photo--5", baseRotate: 8, strength: 0.7 },
  { src: "/RafaCastano-6.avif", className: "mf-photo--6", baseRotate: -6, strength: 1.0 },
];

export default function ManifestoSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<HTMLDivElement[]>([]);
  const photoRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const stageEl = stageRef.current;
      if (!stageEl) return;

      const stageRect = stageEl.getBoundingClientRect();
      const stageCenterX = stageRect.width / 2;
      const stageCenterY = stageRect.height / 2;

      wrapRefs.current.forEach((wrapEl) => {
        const photoRect = wrapEl.getBoundingClientRect();
        const localLeft = photoRect.left - stageRect.left;
        const localTop = photoRect.top - stageRect.top;
        const photoCenterX = localLeft + photoRect.width / 2;
        const photoCenterY = localTop + photoRect.height / 2;

        gsap.fromTo(
          wrapEl,
          { x: stageCenterX - photoCenterX, y: stageCenterY - photoCenterY, scale: 0.6 },
          {
            x: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stageEl,
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          }
        );
      });

      const setters = photoRefs.current.map((el, i) => ({
        x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
        rotate: gsap.quickTo(el, "rotate", { duration: 0.6, ease: "power3.out" }),
        strength: PHOTOS[i].strength,
        baseRotate: PHOTOS[i].baseRotate,
      }));

      const handleMove = (e: PointerEvent) => {
        const rect = stageEl.getBoundingClientRect();
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

      stageEl.addEventListener("pointermove", handleMove);
      stageEl.addEventListener("pointerleave", handleLeave);

      return () => {
        stageEl.removeEventListener("pointermove", handleMove);
        stageEl.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: stageRef }
  );

  return (
    <section className="mf-section">
      <div className="mf-stage" ref={stageRef}>
        {PHOTOS.map((p, i) => (
          <div
            className={`mf-photo-wrap ${p.className}`}
            key={i}
            ref={(el) => {
              if (el) wrapRefs.current[i] = el;
            }}
          >
            <div
              className="mf-photo"
              ref={(el) => {
                if (el) photoRefs.current[i] = el;
              }}
              style={{ transform: `rotate(${p.baseRotate}deg)` }}
            >
              <img src={p.src} alt="" />
            </div>
          </div>
        ))}

        <div className="mf-center">
          <p className="mf-text">
            Tu marca tiene algo
            <br />
            que decir.
            <br />
            Yo hago que merezca
            <br />
            la pena escucharlo.
          </p>
          <a href="#equipo" className="mf-cta">CONECTA</a>
        </div>
      </div>
    </section>
  );
}
