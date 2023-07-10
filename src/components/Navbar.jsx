import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";
import { ThemeContext } from "../contexts/ThemeContext";

function Navbar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  const handleLogout = (event) => {
    props.onLogout(event);
    navigate("/login");
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-title">
          MyDestiny
        </Link>
      </div>
      <div className="navbar-right">
        {!props.logado &&
          location.pathname !== "/login" &&
          location.pathname !== "/recuperarsenha" &&
          location.pathname !== "/cadastrarconta" && (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        <button
          className={`dark-mode-button ${darkMode ? "dark-mode-active" : ""}`}
          onClick={handleDarkModeToggle}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        {props.logado && (
          <>
            <Link to="/meus-pacotes" className="navbar-link">
              Meus Pacotes
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
