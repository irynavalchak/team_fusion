'use client';

import React, {FC, useState} from 'react';
import Link from 'next/link';
import {Container, Nav, Navbar} from 'components/bootstrap';
import AuthButton from 'components/common/AuthButton';

const isTabsShow = process.env.NEXT_PUBLIC_SHOW_ALL_NAVBAR_TABS === 'true';

const NavBar: FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      expanded={expanded}
      className="border-bottom border-dark-subtle">
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/" onClick={() => setExpanded(false)}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} href="/finance" onClick={() => setExpanded(false)}>
              Finance
            </Nav.Link>
            <Nav.Link as={Link} href="/ai_assistant" onClick={() => setExpanded(false)}>
              AI Assistant
            </Nav.Link>

            {isTabsShow && (
              <>
                <Nav.Link as={Link} href="/documents" onClick={() => setExpanded(false)}>
                  Documents
                </Nav.Link>
                <Nav.Link as={Link} href="/team" onClick={() => setExpanded(false)}>
                  Team
                </Nav.Link>
                <Nav.Link as={Link} href="/tasks" onClick={() => setExpanded(false)}>
                  Tasks
                </Nav.Link>
                <Nav.Link as={Link} href="/communication" onClick={() => setExpanded(false)}>
                  Communication
                </Nav.Link>
                <Nav.Link as={Link} href="/settings" onClick={() => setExpanded(false)}>
                  Settings
                </Nav.Link>
              </>
            )}
          </Nav>

          <AuthButton />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
