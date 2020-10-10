import React from 'react'
import Container from 'react-bootstrap/Container'

export default function Home() {
  return (
    <Container className="sfi-container text-center">
      <img
        alt=""
        src="logo.svg"
        width="120"
        height="120"
        className="d-inline-block align-top"
        style={{margin: "4px"}}
      />{' '}
      <h1 className="sfi-bg-color-linear sfi-bg-color-linear-text sfi-brand-title pt-5">
        <span className="d-none d-md-block">Socket.Finance</span>
        <span className="d-none d-sm-block d-md-none h1 display-4 font-weight-bold">Socket.Finance</span>
        <span className="d-block d-sm-none h1 font-weight-bold">Socket.Finance</span>
      </h1>
      <p className="text-white-50">This project is in beta. Use at your own risk.</p>
    </Container>
  )
}