import React from 'react'
import Nav from 'react-bootstrap/Nav'

export default function Footer() {
  return (
    <Nav className="justify-content-center">
      <Nav.Item>
        <Nav.Link target="_blank" href="https://twitter.com/SocketFinance">Twitter</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link target="_blank" href="https://github.com/socket-finance">Github</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link target="_blank" href="https://t.me/SocketFinanceOfficial">Telegram</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link target="_blank" href="https://discord.gg/qEYfJK2">Discord</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link target="_blank" href="https://medium.com/@SocketFinance">Medium</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}