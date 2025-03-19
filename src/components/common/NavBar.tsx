'use client';

import React, {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Container, Navbar} from 'components/bootstrap';

import AuthButton from 'components/common/AuthButton';

const NavBar: FC = () => {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="border-bottom border-dark-subtle">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
          <Image
            src="/images/logo.png"
            alt="TeamFusion Logo"
            width={30}
            height={30}
            className="me-2"
          />
          TeamFusion
        </Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  );
};

export default NavBar;
