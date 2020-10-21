import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import StakeCard from '../components/stakeCard'
import Spinner from 'react-bootstrap/Spinner'
import { usePoolStats } from '../hooks/usePoolStats'
import { usePoolAPY } from '../hooks/usePoolAPY'
import { useTotalValueLocked } from '../hooks/useTotalValueLocked'

export default function Stake() {

  const pools = usePoolStats()
  const poolAPY = usePoolAPY()
  const totalValueLocked = useTotalValueLocked()

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
                SFI is the governance token of Socket.Finance, hold SFI to receive dividends from future projects such as vault, lending, swap, NFT etc.
              </Card.Text>
              <Card.Text className="text-white-70 small">
              Dev keys of all 4 contracts have been burnt:
              <li><a target="_blank" href="https://etherscan.io/tx/0x77f5ed0004a5035f72cedf5eca97f299359330841557867fbd70cac2dc6779eb">[SFI Token]</a></li>
              <li><a target="_blank" href="https://etherscan.io/tx/0x30c83fe40f60a21980a1c2774f83f01f3fd7d49ff0d03af798335fb8e8430e89">[WETH Pool]</a></li>
              <li><a target="_blank" href="https://etherscan.io/tx/0x91678145bffe95b6edc4f55282af250c7d02df849588a7fe91b8f20c3a91374a">[SFI Pool]</a></li>
              <li><a target="_blank" href="https://etherscan.io/tx/0x4015ddeb432b63cdcebbec7a418ab9f2224a7dfa7702559f965edd801adb05e9">[ETH-SFI Pool]</a></li>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center pt-4">
        <Col xs lg="3">
          <span className="text-white font-weight-bold">Participating pools</span>
        </Col>
        <Col xs lg="3" className="text-right text-white">
          {totalValueLocked ?
            <>
              <span>TVL: {Number(totalValueLocked.toFixed(2)).toLocaleString()}</span>
              <span> </span>
              <span className="small">USD</span>
            </> :
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          }
        </Col>
      </Row>

      {pools && pools.map((pool, e) => {
        return (
          <Row className="justify-content-md-center pt-4">
            <Col xs lg="6">
              <StakeCard pool={pool} poolAPY={poolAPY ? (poolAPY[pool?.id] ? poolAPY[pool?.id] : 0) : 0} />
            </Col>
          </Row>
        )})
      }
      
    </Container>
  )
}