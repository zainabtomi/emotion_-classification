import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import styles from './CustomNavbar.module.css';
import logoImage from '../../../assets/images/Logo.png';

export default function CustomNavbar() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
toast.success("Logged out successfully");
    navigate("/login");
  };

  const isIndexPage = location.pathname === "/index";

  return (
    <div className={styles.navWrapper}>
      <Navbar expand="lg" className={styles.navbar}>
        <Container fluid className={styles.navContainer}>
          {/* ✅ الشعار على اليمين */}
          {isIndexPage && (
            <Navbar.Brand as={Link} to="/" className={styles.logoContainer}>
              <img src={logoImage} alt="Logo" className={styles.logo} />
              <span className={styles.logoText}>Emotion Classification</span>
            </Navbar.Brand>
          )}

          <Navbar.Toggle aria-controls="navbar-nav" />
          
          {/* ✅ روابط التنقل على اليسار */}
          <Navbar.Collapse id="navbar-nav" className={styles.navLinksWrapper}>
            <Nav className={styles.navLinks}>
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/help">Help</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              {isIndexPage && (
                <>
                  <Nav.Link as={Link} to="/history">History</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}


