import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar-brand" href="#inicio">
        Rafa Castaño
      </a>
      <nav className="navbar-links">
        <a href="#programa">Programa</a>
        <a href="#instructores">Instructores</a>
        <a href="#galeria">Galería</a>
        <a href="#faq">FAQ</a>
      </nav>
    </header>
  )
}

export default Navbar
