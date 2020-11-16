import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import PoolLogo from './poolLogo'
import {
  getFullDisplayBalance, 
} from '../utils'

export default function SocketFarmCard({pool}) {
  return (
    <Card text={"white"} className="rounded-lg border-dark"  bg={"transparent"}> 
      <Card.Body>
        <Card.Title className="text-white-75 font-weight-bold">
            <Row className="sfi-text-height-2">
              <Col xs="8">
                <PoolLogo logos={pool?.logos ? pool.logos : []} />
                {' '}
                <span className="sfi-bg-color-linear sfi-bg-color-linear-text">{pool?.name ? pool.name : ''}</span>
              </Col>
              <Col xs="4" className="text-right">
                <Button href={"/#/vaultslite/" + pool.path} variant="outline-light" size="sm">Deposit</Button>
              </Col>
            </Row>
        </Card.Title>
        <Row className="text-white-70 mt-2">
          <Col xs="6">Total staked</Col>
          <Col xs="6" className="text-right">
            {pool?.totalLPStaked != undefined ?
              <>
                <span className="h5">{pool?.totalLPStaked.toFixed(4)}</span>
                {' '}
                <span className="small">{pool.tokenName}</span>
              </> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
        <Row className="text-white-70 mt-2">
          <Col xs="6">You staked</Col>
          <Col xs="6" className="text-right">
            {pool?.userLPStaked != undefined ?
              <>
                <span className="h5">{getFullDisplayBalance(pool?.userLPStaked, 4)}</span>
                {' '}
                <span className="small">{pool.tokenName}</span>
              </> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
        <Row className="text-white-70 mt-2">
          <Col xs="6">APY</Col>
          <Col xs="6" className="text-right">
            {pool?.poolAPY != undefined ?
              <>
                <span className="h5">{Number(((pool?.poolAPY * 100).toFixed(2))).toLocaleString()}</span>
                <span> </span>
                <span className="small">%</span>
              </> :
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
