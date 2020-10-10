import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import {
  getFullDisplayBalance, 
  getFormattedDate
} from '../utils'
import PoolLogo from './poolLogo'

export default function StakeCard({pool}) {
  return (
    <Card text={"white"} className="rounded-lg border-dark"  bg={"transparent"}> 
      <Card.Body>
        <Card.Title className="text-white-75 font-weight-bold">
            <Row className="sfi-text-height-2">
              <Col xs="6" lg="6">
                <PoolLogo logos={pool?.logos ? pool.logos : []} />
                {' '}
                <span className="sfi-bg-color-linear sfi-bg-color-linear-text">{pool?.name ? pool.name : ''}</span>
              </Col>
              <Col xs="6" lg="6" className="text-right">
                <Button href={"/#/stake/" + pool.id} variant="outline-light" size="sm">Deposit</Button>
              </Col>
            </Row>
        </Card.Title>
        <Row className="text-white-70 mt-2">
          <Col lg="6">Total staked</Col>
          <Col lg="6" className="text-right">
            {pool?.totalStaked ?
              <>
                <span className="h5">{getFullDisplayBalance(pool?.totalStaked)}</span>
                {' '}
                <span className="small">{pool.tokenName}</span>
              </> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
        <Row className="text-white-70 mt-2">
          <Col lg="6">Pool rate</Col>
          <Col lg="6" className="text-right">
            {pool?.poolRate ?
              <>
                <span className="h5">{getFullDisplayBalance(pool?.poolRate)}</span>
                <span> </span>
                <span className="small">{pool.poolRateUnit}</span>
              </> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
        <Row className="text-white-70 mt-2">
          <Col lg="6" className="small">Halving time</Col>
          <Col lg="6" className="text-right">
            {pool?.halvingTime ?
              <span className="small">{getFormattedDate(pool?.halvingTime)}</span> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
