import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./DirectorSection.css";

gsap.registerPlugin(useGSAP);

const EASE = "expo.inOut";

export default function DirectorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".ds-name-line span, .ds-role span", { y: "115%" });

      if (reduce) {
        gsap.set(introRef.current, { display: "none" });
        gsap.set([".ds-intro-word b", ".ds-name-line span", ".ds-role span"], { y: 0 });
        gsap.set(".ds-media", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".ds-media video", { scale: 1 });
        gsap.set(".ds-marquee", { opacity: 1 });
        return;
      }

      function runCounter(durationMs: number) {
        const start = performance.now();
        function tick(now: number) {
          const p = Math.min((now - start) / durationMs, 1);
          const val = Math.floor(p * 100)
            .toString()
            .padStart(2, "0");
          if (counterRef.current) counterRef.current.textContent = `[ ${val} — 100 ]`;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      runCounter(1700);

      const tl = gsap.timeline({ defaults: { ease: EASE } });

      tl.to(".ds-intro-word b", { y: 0, duration: 1.1, stagger: 0.08 }, 0.2);

      tl.to(".ds-intro-word b", { y: "-110%", duration: 0.9, stagger: 0.05 }, "+=0.45");

      tl.to(introRef.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.35").set(
        introRef.current,
        { display: "none" }
      );

      tl.fromTo(
        ".ds-media",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.inOut" },
        "-=0.9"
      );

      tl.to(".ds-media video", { scale: 1, duration: 2.4, ease: "power2.out" }, "<");

      tl.to(".ds-name-line span", { y: 0, duration: 1.0, stagger: 0.12, ease: "expo.out" }, "-=1.0");

      tl.from(".ds-role span", { y: "115%", duration: 0.8, ease: "expo.out" }, "-=0.6");

      tl.to(".ds-marquee", { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.5");
    },
    { scope: sectionRef }
  );

  return (
    <div className="ds-wrap" ref={sectionRef}>
      <div className="ds-intro" ref={introRef} aria-hidden="true">
        <div className="ds-intro-word">
          <span className="ds-mask"><b>H</b></span>
          <span className="ds-mask"><b>e</b></span>
          <span className="ds-mask"><b>r</b></span>
          <span className="ds-mask"><b>v</b></span>
          <span className="ds-mask"><b>é</b></span>
        </div>
        <div className="ds-intro-count" ref={counterRef}>[ 00 — 100 ]</div>
      </div>

      <header className="ds-hero">
        <div className="ds-media">
          <video
            muted
            loop
            playsInline
            autoPlay
            src="https://player.vimeo.com/progressive_redirect/playback/838044050/rendition/1080p/file.mp4?loc=external&log_user=0&signature=bcef4ae2f0bd8991a60d80af61f608d9f46a669afaff63294d546cf4bfb496ce"
          />
        </div>

        <div className="ds-nav">
          <a href="#">HB</a>
          <nav>
            <a href="#">Works</a>
            <a href="#">Info</a>
          </nav>
          <span>Montréal, QC</span>
        </div>

        <div className="ds-center">
          <h2 className="ds-name">
            <span className="ds-name-line"><span>Hervé</span></span>
            <span className="ds-name-line"><span>Baillargeon</span></span>
          </h2>
          <div className="ds-role-line">
            <p className="ds-role"><span>Director</span></p>
          </div>
        </div>

        <div className="ds-marquee">
          <div className="ds-marquee-track">
            <span>Hervé Baillargeon — Director —&nbsp;</span>
            <span>Hervé Baillargeon — Director —&nbsp;</span>
            <span>Hervé Baillargeon — Director —&nbsp;</span>
            <span>Hervé Baillargeon — Director —&nbsp;</span>
          </div>
        </div>
      </header>
    </div>
  );
}
