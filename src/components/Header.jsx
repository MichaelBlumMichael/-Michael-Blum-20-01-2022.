import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

import "./header.css";

export default function Header() {
  return (
    <div className="container__Header">
      <span>Herolo Whether app</span>
      <nav>
        <ul className="ul__Header">
          <li className="btn__Header" type="button">
            <Link to="/">Home</Link>
          </li>
          <li className="btn__Header" type="button">
            <Link to="/favorites">Favorites</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
