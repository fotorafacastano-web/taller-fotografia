import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar-brand" href="#inicio">
        Foco<span>Pro</span>
      </a>
      <nav className="navbar-links">
        <a href="#programa">Programa</a>
        <a href="#instructores">Instructores</a>
        <a href="#galeria">Galería</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="navbar-cta" href="#inscribirse">
        Reservar mi cupo
      </a>
    </header>
  )
}

export default Navbar
