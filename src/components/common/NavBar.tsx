'use client';

import React, {FC} from 'react';
import Link from 'next/link';
import {Container, Nav, Navbar} from 'components/bootstrap';

import AuthButton from 'components/common/AuthButton';

const NavBar: FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="border-bottom border-dark-subtle">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="me-2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          TeamFusion
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/finance">
              Finance
            </Nav.Link>
          </Nav>

          <AuthButton />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
