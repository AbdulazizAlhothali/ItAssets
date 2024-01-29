import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function myNavbar() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>It Assets</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/">Table</Nav.Link>
        
          </Nav>
        </Container>
      </Navbar>
        </>
    )
}

export default myNavbar