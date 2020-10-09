import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import StakeCard from '../components/stakeCard'
import { usePoolStats } from '../hooks/usePoolStats'

export default function Stake() {

  const pools = usePoolStats()

  return (
    <Container className="sfi-container">
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Card text={"white"} className="rounded-lg border-0 sfi-bg-color-linear"> 
            <Card.Body>
              <Card.Title className="text-white-75 font-weight-bold">Stake</Card.Title>
              <Card.Text className="text-white-70 small">
                Deposit your WETH / SFI / Liquidity Provider tokens to receive SFI.
              </Card.Text>
              <Card.Text className="text-white-70 small">
                SFI is the goverence token of Socket.Finance, hold SFI to receive dividens from future projects such as vault, lending, swap, NFT etc.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center pt-4">
        <Col xs lg="3">
          <span className="text-white font-weight-bold">Participating pools</span>
        </Col>
        <Col xs lg="3" className="text-right">
        {/* <span className="text-white">TVL: -</span> */}
        </Col>
      </Row>

      {pools && pools.map((pool, e) => {
        return (
          <Row className="justify-content-md-center pt-4">
            <Col xs lg="6">
              <StakeCard pool={pool} />
            </Col>
          </Row>
        )})
      }
      
    </Container>
  )
}