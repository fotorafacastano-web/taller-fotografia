import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./DirectorSection.css";

gsap.registerPlugin(useGSAP);

interface DirectorSectionProps {
  cover?: boolean;
}

export default function DirectorSection({ cover = false }: DirectorSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".ds-name-line span", { opacity: 0 });
      gsap.set(".ds-role span", { y: "115%" });

      if (!cover) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        sectionRef.current?.scrollIntoView({ block: "start" });
        gsap.set(".ds-media", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".ds-media video", { scale: 1 });
        gsap.set(".ds-name-line span", { opacity: 1 });
        gsap.set(".ds-role span", { y: 0 });
        gsap.set(".ds-marquee", { opacity: 1 });
        return;
      }

      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

      tl.fromTo(
        ".ds-media",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.3 },
        0
      );

      tl.to(".ds-media video", { scale: 1, duration: 2.2, ease: "power2.out" }, 0);

      tl.to(".ds-name-line--1 span", { opacity: 1, duration: 0.5, ease: "steps(10)" }, 0.3);

      tl.to(".ds-name-line--2 span", { opacity: 1, duration: 0.5, ease: "steps(10)" }, 0.6);

      tl.from(".ds-role span", { y: "115%", duration: 0.8, ease: "expo.out" }, 0.8);

      tl.to(".ds-marquee", { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.9);
    },
    { scope: sectionRef, dependencies: [cover] }
  );

  return (
    <div className="ds-wrap" ref={sectionRef}>
      <header className="ds-hero">
        <div className="ds-media">
          <video muted loop playsInline autoPlay src="/fondo-web.mp4" />
        </div>

        <div className="ds-nav">
          <a href="#">RC</a>
          <nav>
            <a href="#work">Works</a>
            <a href="#">Info</a>
          </nav>
          <span>HABLEMOS</span>
        </div>

        <div className="ds-center">
          <h2 className="ds-name">
            <span className="ds-name-line ds-name-line--1"><span>Rafa</span></span>
            <span className="ds-name-line ds-name-line--2"><span>Castaño</span></span>
          </h2>
          <div className="ds-role-line">
            <p className="ds-role"><span>Director</span></p>
          </div>
        </div>

        <div className="ds-marquee">
          <div className="ds-marquee-track">
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
            <span>Contenido — Diseño Web — Branding — Fotografía — Vídeo —&nbsp;</span>
          </div>
        </div>
      </header>
    </div>
  );
}
