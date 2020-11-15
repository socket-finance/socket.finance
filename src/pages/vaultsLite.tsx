import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import SocketLGE from '../components/socketLGE'
import { useLGEStats } from '../hooks/socket/useLGEStats'

export default function VaultsLite() {

  const lgeStats = useLGEStats()

  return (
    <Container className="sfi-container">
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Card text={"white"} className="rounded-lg border-0 sfi-bg-color-linear"> 
            <Card.Body>
              <Card.Title className="text-white-75 font-weight-bold">Vaults Lite</Card.Title>
              <Card.Text className="text-white-70">
                Vaults Lite is a project within the SFI ecosystem that introduces a deflationary farming coin - SOCKET. Read <a target="_blank" href="https://socketfinance.medium.com/socket-coin-deflationary-farming-experiment-b44c5bb0c049">Socket Coin — Deflationary Farming Experiment</a> to learn more.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-4">
        <Col xs lg="6">
          <Tabs defaultActiveKey="lge" transition={false} id="noanim-tab-example">
            <Tab eventKey="lge" title="Liquidity Generation Event">
              {lgeStats && <SocketLGE lgeStats={lgeStats}/>}
            </Tab>
            <Tab eventKey="farm" title="Farm" disabled>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  )
}