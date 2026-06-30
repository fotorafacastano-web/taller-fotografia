import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import VideoGrainOverlay from "./VideoGrainOverlay";
import "./DirectorSection.css";

gsap.registerPlugin(useGSAP);

interface DirectorSectionProps {
  cover?: boolean;
}

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) =>
        char === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span className="ds-char" key={i}>
            <span className="ds-char-inner">{char}</span>
          </span>
        )
      )}
    </>
  );
}

export default function DirectorSection({ cover = false }: DirectorSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoEl(videoRef.current);
  }, []);

  useGSAP(
    () => {
      gsap.set(".ds-char-inner", { yPercent: 120, rotate: 6 });
      gsap.set(".ds-role span", { y: "115%" });

      if (!cover) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        sectionRef.current?.scrollIntoView({ block: "start" });
        gsap.set(".ds-media", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".ds-media video", { scale: 1 });
        gsap.set(".ds-char-inner", { yPercent: 0, rotate: 0 });
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

      tl.to(".ds-name-line--1 .ds-char-inner", {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.03,
      }, 0.3);

      tl.from(".ds-role span", { y: "115%", duration: 0.8, ease: "expo.out" }, 0.8);

      tl.to(".ds-marquee", { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.9);
    },
    { scope: sectionRef, dependencies: [cover] }
  );

  return (
    <div className="ds-wrap" ref={sectionRef}>
      <header className="ds-hero">
        <div className="ds-media">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            src="/fondo-web.mp4"
            className="ds-media-video-source"
          />
          <VideoGrainOverlay video={videoEl} />
        </div>

        <div className="ds-nav">
          <a href="#">RC</a>
          <nav>
            <a href="#work">Works</a>
            <a href="#">Info</a>
          </nav>
          <a href="#contacto">HABLEMOS</a>
        </div>

        <div className="ds-center">
          <h2 className="ds-name">
            <span className="ds-name-line ds-name-line--1"><SplitChars text="Rafa" /></span>
            <span className="ds-name-line ds-name-line--1"><SplitChars text="Castaño" /></span>
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
