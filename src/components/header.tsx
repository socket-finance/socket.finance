import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import ConnectWallet from './connectWallet'

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand href="/">
          <img
            alt=""
            src="logo.svg"
            width="22"
            height="22"
            className="d-inline-block align-top mr-2"
            style={{margin: "4px"}}
          />{' '}
        <span className="sfi-bg-color-linear sfi-bg-color-linear-text font-weight-bold d-none d-sm-inline-block">socket.finance</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#stake">Stake</Nav.Link>
          <Nav.Link href="#about">About</Nav.Link>
        </Nav>
        <Nav><ConnectWallet/></Nav>
      </Navbar.Collapse>
  </Navbar>
  )
}