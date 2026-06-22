import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./DirectorSection.css";

gsap.registerPlugin(useGSAP);

interface DirectorSectionProps {
  cover?: boolean;
}

export default function DirectorSection({ cover = false }: DirectorSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);

  useGSAP(
    () => {
      if (!cover) {
        gsap.set(sectionRef.current, { yPercent: 100 });
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function settle() {
        const heroEl = document.querySelector(".he-hero") as HTMLElement | null;
        const offset = heroEl?.offsetHeight ?? window.innerHeight;
        setSettled(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => window.scrollTo(0, offset));
        });
      }

      gsap.set(".ds-name-line span, .ds-role span", { y: "115%" });

      if (reduce) {
        gsap.set(sectionRef.current, { yPercent: 0 });
        gsap.set(".ds-media", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".ds-media video", { scale: 1 });
        gsap.set([".ds-name-line span", ".ds-role span"], { y: 0 });
        gsap.set(".ds-marquee", { opacity: 1 });
        settle();
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

      tl.to(sectionRef.current, { yPercent: 0, duration: 1.1, onComplete: settle }, 0);

      tl.fromTo(
        ".ds-media",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.3 },
        0.1
      );

      tl.to(".ds-media video", { scale: 1, duration: 2.2, ease: "power2.out" }, 0.1);

      tl.to(
        ".ds-name-line span",
        { y: 0, duration: 1.0, stagger: 0.12, ease: "expo.out", clearProps: "willChange" },
        0.4
      );

      tl.from(".ds-role span", { y: "115%", duration: 0.8, ease: "expo.out" }, 0.8);

      tl.to(".ds-marquee", { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.9);
    },
    { scope: sectionRef, dependencies: [cover] }
  );

  return (
    <div className={`ds-wrap${settled ? "" : " ds-wrap--fixed"}`} ref={sectionRef}>
      <header className="ds-hero">
        <div className="ds-media">
          <video muted loop playsInline autoPlay src="/fondo-web.mp4" />
        </div>

        <div className="ds-nav">
          <a href="#">RC</a>
          <nav>
            <a href="#">Works</a>
            <a href="#">Info</a>
          </nav>
          <span>HABLEMOS</span>
        </div>

        <div className="ds-center">
          <h2 className="ds-name">
            <span className="ds-name-line"><span>RAFA</span></span>
            <span className="ds-name-line"><span>CASTAÑO</span></span>
          </h2>
          <div className="ds-role-line">
            <p className="ds-role"><span>Director</span></p>
          </div>
        </div>

        <div className="ds-marquee">
          <div className="ds-marquee-track">
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
            <span>Contenido creativo — Diseño Web — Branding —&nbsp;</span>
          </div>
        </div>
      </header>
    </div>
  );
}
