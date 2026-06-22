import { useEffect, useRef } from "react";
import "./HeroEditorial.css";

export default function HeroEditorial() {
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    wordsRef.current.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => el.classList.add("he-w--vis"), 150 * i + 200);
    });
  }, []);

  const ref = (i: number) => (el: HTMLSpanElement | null) => {
    if (el) wordsRef.current[i] = el;
  };

  return (
    <section className="he-hero">
      <nav className="he-nav">
        <a href="/" className="he-nav-logo">UNM</a>
        <div className="he-nav-links">
          <a href="#metodo">Método</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#reservar">Reservar</a>
        </div>
      </nav>

      <div className="he-body">
        <span className="he-side">Scroll · 001</span>
        <div className="he-main">
          <p className="he-label">( servicios )</p>
          <h1 className="he-title">
            <span className="he-line1">
              <span className="he-w" ref={ref(0)}>del </span>
              <span className="he-w he-bold" ref={ref(1)}>humo</span>
            </span>
            <span className="he-line2">
              <span className="he-w" ref={ref(2)}>también se</span>
              <span className="he-sale-wrap">
                <span className="he-w he-bold he-italic he-red" ref={ref(3)}>
                  sale
                </span>
              </span>
            </span>
          </h1>

          <div className="he-video-wrap">
            <video
              src="/Vintage team.m4v"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          <a href="#contacto" className="he-cta">quiero salir</a>
        </div>
      </div>

      <div className="he-footer">
        <p className="he-desc">
          Creatividad, foto, vídeo y diseño<br />
          para marcas que quieren dejar huella.
        </p>
      </div>
    </section>
  );
}
