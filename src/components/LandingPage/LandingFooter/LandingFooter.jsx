import { Link } from "react-router-dom";
import {Logo} from "../../../assets"
import "./landingfooter.scss"

const LandingFooter = () => {
    return (
        <footer className="footer">
          <div>
            <Link className="logo-container" to="/">
              <img className="navbar-logo" src={Logo} alt="PawFinds Logo" />
              <p>Pawsitive Paths</p>
            </Link>
          </div>
          <div className="below-footer">
            <p>
              You can reach me at{" "}
              <a className="mail-links" href="mailto:pawsitivepaths@gmail.com">
                pawsitivepaths@gmail.com
              </a>
            </p>
            <p>
              <a
                className="contact-links"
                href="#"
              >
                <i className="fa fa-linkedin-square"></i> Linkedin
              </a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a
                className="contact-links"
                href="#"
              >
                <i className="fa fa-github"></i> GitHub
              </a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a
                className="contact-links"
                href="#"
              >
                <i className="fa fa-instagram"></i> Instagram
              </a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a
                className="contact-links"
                href="#"
              >
                <i className="fa fa-whatsapp"></i> WhatsApp
              </a>
            </p>
            <p>&copy; 2025 Pawsitive Paths</p>
          </div>
        </footer>
      );
}

export default LandingFooter