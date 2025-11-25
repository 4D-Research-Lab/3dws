import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

import { useAuth } from '$context/AuthContext';

function Layout({ children }) {
  const { displayName } = useAuth();

  return (
    <div className="layout">
      <Navbar className="spacing" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <Image
              src="/3Dworkspace_logo_menu.png"
              alt="logo"
              className="logo-header"
              width="240"
              height="56"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/models">Models</Nav.Link>
              <Nav.Link href="/collections">Collections</Nav.Link>
              <Nav.Link href="/collections">Learning Pathways</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <span className="ms-auto">
              <Row>
                {!displayName && (
                  <Col>
                    {' '}
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Col>
                )}
                {displayName && (
                  <Col>
                    {' '}
                    <Nav.Link href="/account">
                      <FaUserCircle />
                    </Nav.Link>
                  </Col>
                )}
              </Row>
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
