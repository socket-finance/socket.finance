import React, { useCallback, useState } from 'react'
import { useWallet } from 'use-wallet'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import BN from "bignumber.js"
import { useApprove } from '../hooks/useApprove'
import { useAllowance } from '../hooks/useAllowance'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { useContributeETH } from '../hooks/socket/useContributeETH'
import { useContributeSFI } from '../hooks/socket/useContributeSFI'
import { useClaimLPToken } from '../hooks/socket/useClaimLPToken'
import {
  getFullDisplayBalance,
  secondsToDhms,
  decStrToBn
} from '../utils'
import {
  SFI_TOKEN_ADDRESS,
  SOCKET_LGE_ADDRESS,
} from '../constants/tokenAddresses'

export default function SocketLGE({lgeStats}) {
  const allowance: BN = useAllowance(SFI_TOKEN_ADDRESS, SOCKET_LGE_ADDRESS)

  const { onApprove } = useApprove(SFI_TOKEN_ADDRESS, SOCKET_LGE_ADDRESS)
  const [requestedApproval, setRequestedApproval] = useState<boolean>(false)

  const { onContributeETH } = useContributeETH()
  const [requestedContributeETH, setRequestedContributeETH] = useState<boolean>(false)

  const { onContributeSFI } = useContributeSFI()
  const [requestedContributeSFI, setRequestedContributeSFI] = useState<boolean>(false)

  const { onClaimETHxSOCKETLPToken, onClaimSFIxSOCKETLPToken } = useClaimLPToken()
  const [requestedClaimETHxSOCKETLPToken, setRequestedClaimETHxSOCKETLPToken] = useState<boolean>(false)
  const [requestedClaimSFIxSOCKETLPToken, setRequestedClaimSFIxSOCKETLPToken] = useState<boolean>(false)

  const { account, balance } = useWallet()
  const ethBalance = new BN(balance)
  const sfiBalance = useTokenBalance(account, SFI_TOKEN_ADDRESS)

  const [ contributeETHAmount, setContributeETHAmount ] = useState<string>("")
  const [ contributeSFIAmount, setContributeSFIAmount ] = useState<string>("")

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

  const handlePercentageETHInputs = (percentage) => {
    const numberBalance = ethBalance ? ethBalance.dividedBy(new BN(10).pow(new BN(18))) : new BN(0)
    const stringValue = (numberBalance.multipliedBy(percentage).toFixed(4, 1)).toString()
    setContributeETHAmount(stringValue)
  }

  const handlePercentageSFIInputs = (percentage) => {
    const numberBalance = sfiBalance ? sfiBalance.dividedBy(new BN(10).pow(new BN(18))) : new BN(0)
    const stringValue = (numberBalance.multipliedBy(percentage).toFixed(4, 1)).toString()
    setContributeSFIAmount(stringValue)
  }

  const handleConributeETH = useCallback(async () => {
    try {
      setRequestedContributeETH(true)
      const txHash = await onContributeETH(contributeETHAmount)
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedContributeETH(false)
        setContributeETHAmount("")
      }
    } catch (e) {
      console.log(e)
      setRequestedContributeETH(false)
    }
  }, [contributeETHAmount, onContributeETH])

  const handleConributeSFI = useCallback(async () => {
    try {
      setRequestedContributeSFI(true)
      const txHash = await onContributeSFI(contributeSFIAmount)
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedContributeSFI(false)
        setContributeSFIAmount("")
      }
    } catch (e) {
      console.log(e)
      setRequestedContributeSFI(false)
    }
  }, [contributeSFIAmount, onContributeSFI])

  const handleClaimETHxSOCKETLPToken = useCallback(async () => {
    try {
      setRequestedClaimETHxSOCKETLPToken(true)
      const txHash = await onClaimETHxSOCKETLPToken()
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedClaimETHxSOCKETLPToken(false)
      }
    } catch (e) {
      console.log(e)
      setRequestedClaimETHxSOCKETLPToken(false)
    }
  }, [onClaimETHxSOCKETLPToken])

  const handleClaimSFIxSOCKETLPToken = useCallback(async () => {
    try {
      setRequestedClaimSFIxSOCKETLPToken(true)
      const txHash = await onClaimSFIxSOCKETLPToken()
      if (!txHash) {
        throw new Error("Transaction error")
      } else {
        setRequestedClaimSFIxSOCKETLPToken(false)
      }
    } catch (e) {
      console.log(e)
      setRequestedClaimSFIxSOCKETLPToken(false)
    }
  }, [onClaimSFIxSOCKETLPToken])

  const shouldDisableContributeETHButton = () => {
    return requestedContributeETH || requestedContributeSFI || !account || !contributeETHAmount || decStrToBn(contributeETHAmount).isLessThanOrEqualTo(new BN(0)) || decStrToBn(contributeETHAmount).isGreaterThan(ethBalance ? ethBalance : new BN(0))
  }

  const shouldDisableContributeSFIButton = () => {
    return requestedContributeETH || requestedContributeSFI || !account || !contributeSFIAmount || decStrToBn(contributeSFIAmount).isLessThanOrEqualTo(new BN(0)) || decStrToBn(contributeSFIAmount).isGreaterThan(sfiBalance ? sfiBalance : new BN(0))
  }

  const shouldDisableClaimETHxSOCKETLPButton = () => {
    return requestedClaimETHxSOCKETLPToken || requestedClaimSFIxSOCKETLPToken || lgeStats == undefined || lgeStats?.userETHContributed == 0
  }

  const shouldDisableClaimSFIxSOCKETLPButton = () => {
    return requestedClaimETHxSOCKETLPToken || requestedClaimSFIxSOCKETLPToken || lgeStats == undefined || lgeStats?.userSFIContributed == 0
  }

  const generateETHContributeCard = () => {
    return (
      <Col xs lg="6" className="mt-4">
        <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
          <Card.Body>
            <Card.Title className="small">Add Liquidity for ETH x SOCKET</Card.Title>
            <div className="text-right">
              <span className="small">
                {account && ethBalance ? 
                  getFullDisplayBalance(ethBalance, 4) :
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" />
                }
              </span>
              <span> </span>
              <span className="small">ETH</span>
            </div>
            <Form>
              <Form.Group>
                <Form.Control size="sm" type="text" placeholder="Amount" value={contributeETHAmount} onChange={(e) => {setContributeETHAmount(e.target.value)}} disabled={ethBalance?.isEqualTo(new BN(0))}/>
              </Form.Group>
            </Form>
            <ButtonToolbar className="justify-content-center mt-n2 mb-3">
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageETHInputs(0.25)} disabled={ethBalance?.isEqualTo(new BN(0))}>25%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageETHInputs(0.5)} disabled={ethBalance?.isEqualTo(new BN(0))}>50%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageETHInputs(0.75)} disabled={ethBalance?.isEqualTo(new BN(0))}>75%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageETHInputs(1)} disabled={ethBalance?.isEqualTo(new BN(0))}>100%</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <div className="text-center">
              <Button variant="outline-primary"
                      disabled={shouldDisableContributeETHButton()}
                      onClick={() => handleConributeETH()}>
                {requestedContributeETH ? "Adding" : "Add Liquidity"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  const generateSFIContributeCard = () => {
    return (
      <Col xs lg="6" className="mt-4">
        <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
          <Card.Body>
            <Card.Title className="small">Add Liquidity for SFI x SOCKET</Card.Title>
            <div className="text-right">
              <span className="small">
                {sfiBalance ?
                  getFullDisplayBalance(sfiBalance, 4) : 
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" />
                }
              </span>
              <span> </span>
              <span className="small">SFI</span>
            </div>
            <Form>
              <Form.Group>
                <Form.Control size="sm" type="text" placeholder="Amount" value={contributeSFIAmount} onChange={(e) => {setContributeSFIAmount(e.target.value)}} disabled={!sfiBalance?.toFixed()}/>
              </Form.Group>
            </Form>
            <ButtonToolbar className="justify-content-center mt-n2 mb-3">
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageSFIInputs(0.25)} disabled={sfiBalance?.isEqualTo(new BN(0))}>25%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageSFIInputs(0.5)} disabled={sfiBalance?.isEqualTo(new BN(0))}>50%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup className="mr-2">
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageSFIInputs(0.75)} disabled={sfiBalance?.isEqualTo(new BN(0))}>75%</Button>{' '}
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline-primary" size="sm" className="border-0" onClick={() => handlePercentageSFIInputs(1)} disabled={sfiBalance?.isEqualTo(new BN(0))}>100%</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <div className="text-center">
              {!allowance.toNumber() ?
                <Button variant="outline-primary"
                        disabled={requestedApproval || !account}
                        onClick={() => handleApprove()}>
                  {requestedApproval ? "Approving" : "Approve SFI"}
                </Button> :
                <Button variant="outline-primary"
                        disabled={shouldDisableContributeSFIButton()}
                        onClick={() => handleConributeSFI()}>
                  {requestedContributeSFI ? "Adding" : "Add Liquidity"}
                </Button>
              }
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  const generateETHxSOCKETLPClaimCard = () => {
    return (
      <Col xs lg="6" className="mt-4">
        <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
          <Card.Body>
            <Card.Title className="small">Your unclaimed ETH x SOCKET LP token</Card.Title>
            <div className="text-center p-2">
              {lgeStats?.lpPerETHUnit * lgeStats?.userETHContributed ?
                <span className="h3">{(lgeStats?.lpPerETHUnit * lgeStats?.userETHContributed).toFixed(4)}</span> :
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              }
            </div>
            <div className="text-center mt-2">
              <Button variant="outline-primary"
                      disabled={shouldDisableClaimETHxSOCKETLPButton()}
                      onClick={() => handleClaimETHxSOCKETLPToken()}>
                {requestedClaimETHxSOCKETLPToken ? "Claiming" : "Claim ETH x SOCKET LP"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  const generateSFIxSOCKETLPClaimCard = () => {
    return (
      <Col xs lg="6" className="mt-4">
        <Card bg={"transparent"} text={"white"} className="rounded-lg border-dark">
          <Card.Body>
            <Card.Title className="small">Your unclaimed SFI x SOCKET LP token</Card.Title>
            <div className="text-center p-2">
              {lgeStats?.lpPerSFIUnit * lgeStats?.userSFIContributed ?
                <span className="h3">{(lgeStats?.lpPerSFIUnit * lgeStats?.userSFIContributed).toFixed(4)}</span> :
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />
              }
            </div>
            <div className="text-center mt-2">
              <Button variant="outline-primary"
                      disabled={shouldDisableClaimSFIxSOCKETLPButton()}
                      onClick={() => handleClaimSFIxSOCKETLPToken()}>
                {requestedClaimSFIxSOCKETLPToken ? "Claiming" : "Claim SFI x SOCKET LP"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
  }

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col xs lg="12">
          <Card text={"white"} className="rounded-lg border-dark" bg={"transparent"}>
            <Card.Body>
              <Card.Text>
                <span>LGE will finish in </span>
                {lgeStats?.secondsLeftInLiquidityGenerationEvent != undefined ?
                  <>
                    <span className="font-weight-bold">{lgeStats?.secondsLeftInLiquidityGenerationEvent > 0 ? secondsToDhms(lgeStats?.secondsLeftInLiquidityGenerationEvent) : "0 minutes"} (But it might end earlier if necessary)</span>
                  </> :
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                }
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col xs="6">
                    <span>Total ETH contributed: </span>
                  </Col>
                  <Col xs="6" className="text-right text-white">
                    {lgeStats?.totalETHContributed ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.totalETHContributed} ETH</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col xs="6">
                    <span>Total SFI contributed: </span>
                  </Col>
                  <Col xs="6" className="text-right text-white">
                    {lgeStats?.totalSFIContributed ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.totalSFIContributed.toFixed(4)} SFI</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col xs="8">
                    <span>SOCKET price estimate after LGE: </span>
                  </Col>
                  <Col xs="4" className="text-right text-white">
                    {lgeStats?.socketPriceEstimateAfterLGE ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.socketPriceEstimateAfterLGE.toLocaleString()} USD</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col xs="8">
                    <span>SOCKET market cap estimate after LGE: </span>
                  </Col>
                  <Col xs="4" className="text-right text-white">
                    {lgeStats?.socketMarketCapEstimateAfterLGE ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.socketMarketCapEstimateAfterLGE.toLocaleString()} USD</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>


              {account && lgeStats?.liquidityGenerationOngoing && lgeStats?.secondsLeftInLiquidityGenerationEvent && <Card.Text>
                <Row>
                  <Col xs="12">
                    <span>ETH-SOCKET Pool estimate after LGE: </span>
                  </Col>
                  <Col xs="6" className="text-center text-white">
                    {lgeStats?.totalETHContributed ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.totalETHContributed.toFixed(4)} ETH</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                  <Col xs="6" className="text-center text-white">
                    {lgeStats?.socketForSFIAllocate != undefined ?
                      <>
                        <span className="font-weight-bold">{10000 - lgeStats?.socketForSFIAllocate.toFixed(4)} SOCKET</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>}

              {account && lgeStats?.liquidityGenerationOngoing && lgeStats?.secondsLeftInLiquidityGenerationEvent && <Card.Text>
                <Row>
                  <Col xs="12">
                    <span>SFI-SOCKET Pool estimate after LGE: </span>
                  </Col>
                  <Col xs="6" className="text-center text-white">
                    {lgeStats?.totalSFIContributed ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.totalSFIContributed.toFixed(4)} SFI</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                  <Col xs="6" className="text-center text-white">
                    {lgeStats?.socketForSFIAllocate != undefined ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.socketForSFIAllocate.toFixed(4)} SOCKET</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>}

              <Card.Text>
                <Row>
                  <Col xs="8">
                    <span>ETH you have contributed: </span>
                  </Col>
                  <Col xs="4" className="text-right text-white">
                    {lgeStats?.userETHContributed != undefined ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.userETHContributed} ETH</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>

              <Card.Text>
                <Row>
                  <Col xs="8">
                    <span>SFI you have contributed: </span>
                  </Col>
                  <Col xs="4" className="text-right text-white">
                    {lgeStats?.userSFIContributed != undefined ?
                      <>
                        <span className="font-weight-bold">{lgeStats?.userSFIContributed} SFI</span>
                      </> :
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    }
                  </Col>
                </Row>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        {account && lgeStats?.liquidityGenerationOngoing && lgeStats?.secondsLeftInLiquidityGenerationEvent && generateETHContributeCard()}
        {account && lgeStats?.liquidityGenerationOngoing && lgeStats?.secondsLeftInLiquidityGenerationEvent && generateSFIContributeCard()}
        {account && lgeStats?.lgeParticipationAgreement && !lgeStats?.liquidityGenerationOngoing && generateETHxSOCKETLPClaimCard()}
        {account && lgeStats?.lgeParticipationAgreement && !lgeStats?.liquidityGenerationOngoing && generateSFIxSOCKETLPClaimCard()}
      </Row>
    </div>
  )
}