import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database/firebase-config";
import { Link } from "react-router-dom";

const Footer = () => {
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      <footer className="footer-container">
        <ul className="footer-list">
          <li className="footer-link">
            <Link to="/">
              <i className="fa fa-home" aria-hidden="true"></i>
            </Link>
          </li>
          {user ? (
            <>
              <li className="footer-link">
                <Link to="/journal">
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </Link>
              </li>
              <li className="footer-link">
                <Link to="/garden">
                  <i className="fa fa-leaf" aria-hidden="true"></i>
                </Link>
              </li>
              <li className="footer-link">
                <Link to="/favorites">
                  <i className="fa fa-heart-o" aria-hidden="true"></i>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="footer-link">
                <Link to="/signUp">
                  <i className="fa fa-user-o" aria-hidden="true"></i> Log
                  In/Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </footer>
    </>
  );
};

export default Footer;
