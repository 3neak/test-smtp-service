import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container >
                <Navbar.Brand href="/">SMTP Service</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/mailings">Templates List</Nav.Link>
                        <Nav.Link href="/smtp-settings">SMTP Settings</Nav.Link>
                        {/* <Nav.Link href="/smtp-settings">Templates</Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header