import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import { useCirculatingSupply } from '../hooks/useCirculatingSupply'
import { useSFIPrice } from '../hooks/useSFIPrice'
import { useTotalValueLocked } from '../hooks/useTotalValueLocked'

export default function Home() {
  const circulatingSupply = useCirculatingSupply()
  const price = useSFIPrice()
  const totalValueLocked = useTotalValueLocked()

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

      <Row className="justify-content-md-center">
        <Col xs="12" md="6" lg="4" className="mt-2">
          <Card text={"white"} className="rounded-lg bg-transparent border-dark"> 
            <Card.Body>
              <Card.Title className="text-white small">Circulating Supply</Card.Title>
              <Card.Text>
                {circulatingSupply ? 
                  <span className="text-white font-weight-bold h3">{Number(circulatingSupply.toFixed(4)).toLocaleString()}</span> :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="12" md="6" lg="4" className="mt-2">
          <Card text={"white"} className="rounded-lg bg-transparent border-dark"> 
            <Card.Body>
              <Card.Title className="text-white small">Market Cap</Card.Title>
              <Card.Text>
                {circulatingSupply && price ? 
                  <span className="text-white font-weight-bold h3">{Number((Number(circulatingSupply) * Number(price)).toFixed(4)).toLocaleString()}</span> :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col xs="12" md="6" lg="4" className="mt-2">
          <Card text={"white"} className="rounded-lg bg-transparent border-dark"> 
            <Card.Body>
              <Card.Title className="text-white small">Price</Card.Title>
              <Card.Text>
                {price ? 
                  <span className="text-white font-weight-bold h3">{Number(price.toFixed(4)).toLocaleString()}</span> :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="12" md="6" lg="4" className="mt-2">
          <Card text={"white"} className="rounded-lg bg-transparent border-dark"> 
            <Card.Body>
              <Card.Title className="text-white small">Total Value Locked</Card.Title>
              <Card.Text>
                {totalValueLocked ? 
                  <span className="text-white font-weight-bold h3">{Number(totalValueLocked.toFixed(2)).toLocaleString()}</span> :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}