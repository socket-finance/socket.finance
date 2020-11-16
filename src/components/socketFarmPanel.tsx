import React, { useCallback, useState } from 'react'
import { useWallet } from 'use-wallet'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import PoolLogo from '../components/poolLogo'
import BN from "bignumber.js"
import { useTokenBalance } from '../hooks/useTokenBalance'
import { useVaultsLiteClaim } from '../hooks/socket/useVaultsLiteClaim'
import { useApprove } from '../hooks/useApprove'
import { useAllowance } from '../hooks/useAllowance'
import { useVaultsLiteStake } from "../hooks/socket/useVaultsLiteStake"
import {
  getFullDisplayBalance,
  decStrToBn
} from '../utils'
import {
  VAULTS_LITE_ADDRESS,
} from '../constants/tokenAddresses'

export default function SocketFarmPanel({pool}) {
  const allowance: BN = useAllowance(pool.tokenAddress, VAULTS_LITE_ADDRESS)

  const { onApprove } = useApprove(pool.tokenAddress, VAULTS_LITE_ADDRESS)
  const [requestedApproval, setRequestedApproval] = useState<boolean>(false)

  const { onVaultsLiteStake } = useVaultsLiteStake(pool.id)
  const [requestedStake, setRequestedStake] = useState<boolean>(false)

  const { onVaultsLiteUnStake } = useVaultsLiteStake(pool.id)
  const [requestedUnstake, setRequestedUnstake] = useState<boolean>(false)
  
  const { account } = useWallet()
  const tokenBalance = useTokenBalance(account, pool?.tokenAddress)
  const { userLPStaked } = pool

  const [ stakeAmount, setStakeAmount ] = useState<string>("")
  const [ unstakeAmount, setUnstakeAmount ] = useState<string>("")

  const [requestedClaim, setRequestedClaim] = useState<boolean>(false)
  const { onVaultsLiteClaim } = useVaultsLiteClaim(pool?.id)

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onVaultsLiteClaim()
      if (!txHash) {
        throw new Error("Transactions error")
      } else {
        setRequestedClaim(false)
      }
    } catch (e) {
      console.log(e)
      setRequestedClaim(false)
    }
  }, [onVaultsLiteClaim, setRequestedClaim])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
      setRequestedApproval(false)
    }
  }, [onApprove, setRequestedApproval])

  const handlePercentageStakeInputs = (percentage) => {
    const numberBalance = tokenBalance ? tokenBalance.dividedBy(new BN(10).pow(new BN(18))) : new BN(0)
    const stringValue = (numberBalance.multipliedBy(percentage).toFixed(4, 1)).toString()
    setStakeAmount(stringValue)
  }

  const handlePercentageUnstakeInputs = (percentage) => {
    const numberBalance = userLPStaked ? userLPStaked.dividedBy(new BN(10).pow(new BN(18))) : new BN(0)
    const stringValue = (numberBalance.multipliedBy(percentage).toFixed(4, 1)).toString()
    setUnstakeAmount(stringValue)
  }

  const handleStake = useCallback(async () => {
    try {
      setRequestedStake(true)
      const txHash = await onVaultsLiteStake(stakeAmount)
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedStake(false)
        setStakeAmount("")
      }
    } catch (e) {
      console.log(e)
      setRequestedStake(false)
    }
  }, [stakeAmount, onVaultsLiteStake])

  const handleUnstake = useCallback(async () => {
    try {
      setRequestedUnstake(true)
      const txHash = await onVaultsLiteUnStake(unstakeAmount)
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedUnstake(false)
        setUnstakeAmount("")
      }
    } catch (e) {
      console.log(e)
      setRequestedUnstake(false)
    }
  }, [unstakeAmount, onVaultsLiteUnStake])

  const shouldDisableClaimButton = () => {
    return pool?.userClaimableSOCKET <= 0 || requestedClaim
  }

  const shouldDisableStakeButton = () => {
    return requestedStake || !account || !stakeAmount || decStrToBn(stakeAmount).isLessThanOrEqualTo(new BN(0)) || decStrToBn(stakeAmount).isGreaterThan(tokenBalance ? tokenBalance : new BN(0))
  }

  const shouldDisableUnstakeButton = () => {
    return requestedUnstake || !account || !unstakeAmount ||  decStrToBn(unstakeAmount).isLessThanOrEqualTo(new BN(0)) || decStrToBn(unstakeAmount).isGreaterThan(pool?.userLPStaked)
  }

  const generateInformationCard = (title, value, unit) => {
    return (
      <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
        <Card.Body>
          <Card.Title className="small">{title}</Card.Title>
          <div className="text-center">
            {value ?
              <>
                <span className="h3">{value.toFixed(4)}</span>
                <span> </span>
                <span className="small">{unit}</span>
              </> :
              <Spinner as="span" animation="border" role="status" aria-hidden="true" />
            }
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Container className="sfi-container font-weight-bold">
      <Row className="justify-content-md-center text-white">
        <Col xs lg="3">
          <span className="sfi-bg-color-linear sfi-bg-color-linear-text h5">{pool.name}</span>
        </Col>
        <Col xs lg="3" className="text-right">
          <PoolLogo logos={pool?.logos ? pool.logos : []} />
        </Col>
      </Row>

      <Row className="justify-content-md-center text-white mt-2">
        <Col xs lg="6">
          {generateInformationCard("Total deposits", pool?.totalLPStaked, pool.tokenName)}
        </Col>
      </Row>

      <Row className="justify-content-md-center text-white mt-4">
        <Col xs lg="6">
          <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
            <Card.Body>
              <Card.Title className="small">Your unclaimed SOCKET</Card.Title>
              <div className="text-center p-2">
                {pool?.userClaimableSOCKET != undefined ?
                  <span className="h3">{pool?.userClaimableSOCKET.toFixed(8)}</span> :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                }
              </div>
              <div className="text-center mt-2">
                <Button variant="outline-primary"
                        disabled={shouldDisableClaimButton()}
                        onClick={() => handleClaim()}>
                  {requestedClaim ? "Claiming" : "Claim SOCKET"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center text-white mt-4">
        <Col xs lg="3">
          <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
            <Card.Body>
              <Card.Title className="small">Your wallet</Card.Title>
              <div className="text-right">
                <span className="small">
                  {tokenBalance ? 
                    getFullDisplayBalance(tokenBalance, 4) :
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" />
                  }
                </span>
                <span> </span>
                <span className="small">{pool.tokenName}</span>
              </div>
              <Form>
                <Form.Group>
                  <Form.Control size="sm" type="text" placeholder="Amount" value={stakeAmount} onChange={(e) => {setStakeAmount(e.target.value)}} disabled={!allowance.toNumber() || tokenBalance?.isEqualTo(new BN(0))}/>
                </Form.Group>
              </Form>
              <ButtonToolbar className="justify-content-center mt-n2 mb-3">
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageStakeInputs(0.25)} disabled={!allowance.toNumber() || tokenBalance?.isEqualTo(new BN(0))}>25%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageStakeInputs(0.5)} disabled={!allowance.toNumber() || tokenBalance?.isEqualTo(new BN(0))}>50%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageStakeInputs(0.75)} disabled={!allowance.toNumber() || tokenBalance?.isEqualTo(new BN(0))}>75%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup>
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageStakeInputs(1)} disabled={!allowance.toNumber() || tokenBalance?.isEqualTo(new BN(0))}>100%</Button>
                </ButtonGroup>
              </ButtonToolbar>
              <div className="text-center">
                {!allowance.toNumber() ?
                  <Button variant="outline-primary"
                          disabled={requestedApproval || !account}
                          onClick={() => handleApprove()}>
                    {requestedApproval ? "Approving" : "Approve " + pool.tokenName}
                  </Button> :
                  <Button variant="outline-primary"
                          disabled={shouldDisableStakeButton()}
                          onClick={() => handleStake()}>
                    {requestedStake ? "Staking" : "Stake " + pool.tokenName}
                  </Button>
                }
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs lg="3">
          <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
            <Card.Body>
              <Card.Title className="small">Staked token</Card.Title>
              <div className="text-right">
                <span className="small">
                  {pool?.userLPStaked != undefined ?
                    getFullDisplayBalance(pool?.userLPStaked, 4) : 
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" />
                  }
                </span>
                <span> </span>
                <span className="small">{pool.tokenName}</span>
              </div>
              <Form>
                <Form.Group>
                  <Form.Control size="sm" type="text" placeholder="Amount" value={unstakeAmount} onChange={(e) => {setUnstakeAmount(e.target.value)}} disabled={!pool?.userLPStaked?.toFixed()}/>
                </Form.Group>
              </Form>
              <ButtonToolbar className="justify-content-center mt-n2 mb-3">
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageUnstakeInputs(0.25)} disabled={!pool?.userLPStaked?.toFixed()}>25%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageUnstakeInputs(0.5)} disabled={!pool?.userLPStaked?.toFixed()}>50%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup className="mr-2">
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageUnstakeInputs(0.75)} disabled={!pool?.userLPStaked?.toFixed()}>75%</Button>{' '}
                </ButtonGroup>
                <ButtonGroup>
                  <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageUnstakeInputs(1)} disabled={!pool?.userLPStaked?.toFixed()}>100%</Button>
                </ButtonGroup>
              </ButtonToolbar>
              <div className="text-center">
                <Button variant="outline-primary"
                        disabled={shouldDisableUnstakeButton()}
                        onClick={() => handleUnstake()}>
                  {requestedUnstake ? "Unstaking" : "Unstake " + pool.tokenName}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}