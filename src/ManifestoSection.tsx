import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./ManifestoSection.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SLOTS = [
  { className: "mf-photo--1", baseRotate: -7, strength: 0.6 },
  { className: "mf-photo--2", baseRotate: 5, strength: 0.9 },
  { className: "mf-photo--3", baseRotate: 6, strength: 0.8 },
  { className: "mf-photo--4", baseRotate: -4, strength: 1.1 },
  { className: "mf-photo--5", baseRotate: 8, strength: 0.7 },
  { className: "mf-photo--6", baseRotate: -6, strength: 1.0 },
];

const IMAGE_SRCS = [
  "/RafaCastano-1.avif",
  "/RafaCastano-2.avif",
  "/RafaCastano-3.avif",
  "/RafaCastano-4.avif",
  "/RafaCastano-5.avif",
  "/RafaCastano-6.avif",
];

function shuffled<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function ManifestoSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<HTMLDivElement[]>([]);
  const photoRefs = useRef<HTMLDivElement[]>([]);
  const [order, setOrder] = useState(() => shuffled(IMAGE_SRCS));
  const wasVisible = useRef(false);

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          setOrder(shuffled(IMAGE_SRCS));
        }
        wasVisible.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );

    observer.observe(stageEl);
    return () => observer.disconnect();
  }, []);

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
        const offsetX = photoCenterX - stageCenterX;
        const offsetY = photoCenterY - stageCenterY;

        gsap.fromTo(
          wrapEl,
          { x: -offsetX, y: -offsetY, scale: 0.6 },
          {
            x: offsetX * 0.1,
            y: offsetY * 0.1,
            scale: 1.75,
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
        strength: SLOTS[i].strength,
        baseRotate: SLOTS[i].baseRotate,
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
        {SLOTS.map((slot, i) => (
          <div
            className={`mf-photo-wrap ${slot.className}`}
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
              style={{ transform: `rotate(${slot.baseRotate}deg)` }}
            >
              <img src={order[i]} alt="" />
            </div>
          </div>
        ))}

        <div className="mf-center">
          <p className="mf-text">
            Tu marca tiene mucho que decir.
            <br />
            Yo hago que merezca
            <br />
            la pena escucharlo.
          </p>
          <a href="#equipo" className="mf-cta">Cuéntame tu proyecto</a>
        </div>
      </div>
    </section>
  );
}
