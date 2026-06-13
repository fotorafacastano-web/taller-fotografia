import Navbar from './Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-badge">📸 Taller presencial · Cupos limitados</span>
        <h1>Tu mirada. Tu luz. Tu historia.</h1>
        <p className="hero-subtitle">
          Domina la composición, la iluminación y la edición para crear
          imágenes que cuentan historias. Un taller intensivo guiado por
          fotógrafos profesionales.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#inscribirse">
            Reservar mi cupo
          </a>
          <a className="btn btn-secondary" href="#programa">
            Ver programa
          </a>
        </div>
      </div>
      </section>
      <section className="programa" id="programa">
        <div className="programa-header">
          <span className="section-eyebrow">Programa del curso</span>
          <h2>Todo lo que necesitas para dar el salto</h2>
          <p>
            Seis módulos prácticos que te llevan paso a paso desde los
            fundamentos hasta tener tu propio portfolio profesional.
          </p>
        </div>
        <ol className="programa-list">
          <li className="programa-item">
            <span className="programa-number">01</span>
            <div>
              <h3>Fundamentos de composición</h3>
              <p>
                Reglas de encuadre, perspectiva y equilibrio visual para
                construir imágenes con intención.
              </p>
              <span className="programa-meta">Semana 1</span>
            </div>
          </li>
          <li className="programa-item">
            <span className="programa-number">02</span>
            <div>
              <h3>Dominando la luz</h3>
              <p>
                Luz natural y artificial, esquemas de iluminación y cómo
                moldear el ambiente de cada toma.
              </p>
              <span className="programa-meta">Semana 2</span>
            </div>
          </li>
          <li className="programa-item">
            <span className="programa-number">03</span>
            <div>
              <h3>Cámara en modo manual</h3>
              <p>
                Exposición, ISO, apertura y velocidad: control total sobre tu
                equipo en cualquier situación.
              </p>
              <span className="programa-meta">Semana 3</span>
            </div>
          </li>
          <li className="programa-item">
            <span className="programa-number">04</span>
            <div>
              <h3>Retrato y dirección de modelos</h3>
              <p>
                Comunicación, poses y dinámicas para sacar lo mejor de cada
                sesión con personas reales.
              </p>
              <span className="programa-meta">Semana 4</span>
            </div>
          </li>
          <li className="programa-item">
            <span className="programa-number">05</span>
            <div>
              <h3>Edición y revelado digital</h3>
              <p>
                Flujo de trabajo profesional en Lightroom y Photoshop para
                darle vida a tus imágenes.
              </p>
              <span className="programa-meta">Semana 5</span>
            </div>
          </li>
          <li className="programa-item">
            <span className="programa-number">06</span>
            <div>
              <h3>Proyecto final y portfolio</h3>
              <p>
                Selección, edición y presentación de tu trabajo frente a
                fotógrafos profesionales.
              </p>
              <span className="programa-meta">Semana 6</span>
            </div>
          </li>
        </ol>
      </section>
    </>
  )
}

export default App
