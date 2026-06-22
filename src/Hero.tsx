import "./Hero.css";

export default function HeroEditorial() {
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
            <span className="he-line1">del humo</span>
            <span className="he-line2">también se <em className="he-italic">sale</em></span>
          </h1>
        </div>
      </div>

      <div className="he-footer">
        <p className="he-desc">
          Creatividad, foto, vídeo y diseño<br />
          para marcas que quieren dejar huella.
        </p>
        <a href="#reservar" className="he-cta">Reservar mi cupo →</a>
      </div>
    </section>
  );
}
