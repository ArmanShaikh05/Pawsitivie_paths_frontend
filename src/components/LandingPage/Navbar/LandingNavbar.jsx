import { Link } from "react-router-dom";
import {Logo} from "../../../assets"
import "./landingnavbar.scss"

const LandingNavbar = () => {
  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={Logo} alt="PawFinds Logo" />
          <p>Pawsitive Paths</p>
        </Link>
      </div>
      <div>
        <Link to="/home">
          <button className="Navbar-button w-max px-5 py-2">Adopt Pet Today</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingNavbar;
