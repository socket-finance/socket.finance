import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

export default function VaultsLite() {

  return (
    <Container className="sfi-container">
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Card text={"white"} className="rounded-lg border-dark bg-transparent"> 
            <Card.Body>
              <Card.Title className="text-white-75 font-weight-bold">Vaults Lite</Card.Title>
              <Card.Text className="text-white-70">
                Coming soon...
              </Card.Text>
              <Card.Text className="text-white-70">
                Vaults Lite is a project within SFI ecosystem that introduces a deflationary farming coin - SOCKET. Read <a href="https://socketfinance.medium.com/socket-coin-deflationary-farming-experiment-b44c5bb0c049">Socket Coin — Deflationary Farming Experiment</a> to learn more.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}