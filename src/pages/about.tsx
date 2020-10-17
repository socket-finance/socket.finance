import React from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

export default function About() {
  return (
    <Container className="sfi-container">
      <Row className="text-center">
        <Col>
          <img
            alt=""
            src="logo.svg"
            width="120"
            height="120"
            className="d-inline-block align-top"
            style={{margin: "4px"}}
          />{' '}
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col lg="8">
          <Card border="dark" bg={"transparent"} className="text-white-50">
            <Card.Body>
              <Card.Title className="h1 sfi-bg-color-linear sfi-bg-color-linear-text font-weight-bold">About Socket Finance</Card.Title>
              <Card.Text>
              Socket Finance is an experiment in DeFi world. It is a suite of decentralized finance (DeFi) products focused on creating a simple way to generate returns for our users. Future projects will involve Vaults, Swap, NFT, etc.
              </Card.Text>
              <Card.Text>
              Socket Finance won't be another fork, we will focus on developing products by ourself. Meanwhile your voices and requirements will decide our roadmap. Join us on <a href="https://discord.gg/qEYfJK2">Discord</a> and <a href="https://t.me/SocketFinanceOfficial">Telegram</a> for discussing.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col lg="8">
          <Card border="dark" bg={"transparent"} className="text-white-50">
            <Card.Body>
              <Card.Title className="h1 sfi-bg-color-linear sfi-bg-color-linear-text font-weight-bold">Blueprint</Card.Title>
              <Image src="blueprint.svg" className="border border-0 bg-transparent" thumbnail />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col lg="8">
          <Card border="dark" bg={"transparent"} className="text-white-50">
            <Card.Body>
              <Card.Title className="h1 sfi-bg-color-linear sfi-bg-color-linear-text font-weight-bold">About SFI</Card.Title>
              <Card.Text>
              SFI is the goverence token of Socket.Finance. No presale. No premine. 
              </Card.Text>
              <Card.Text>
              Token Contract: <a href="https://etherscan.io/token/0x1E15abF152067e9Fe4A48bbf094A71f5bB16325D">0x1E15abF152067e9Fe4A48bbf094A71f5bB16325D</a>
              </Card.Text>
              <Card.Text className="font-weight-bold">
              Total Supply: 31,500
              </Card.Text>
              <Card.Text className="font-weight-bold">
              Allocation:
              </Card.Text>
              <div>
                <li>Reward 6,000 for WETH Pool (about 19.1%)</li>
                <li>Reward 6,000 for SFI Pool (about 19.1%)</li>
                <li>Reward 18,000 for ETH-SFI LP Pool (about 57.1%)</li>
                <li>Reward 1,500 for development fund (about 4.7%). Linear vesting in one year ≈ 4.1 SFI / day.</li>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col lg="8">
          <Card border="dark" bg={"transparent"} className="text-white-50">
            <Card.Body>
              <Card.Title className="h1 sfi-bg-color-linear sfi-bg-color-linear-text font-weight-bold">About Staking</Card.Title>
              <Card.Text>
                There are 3 pools for staking and receiving SFI.
              </Card.Text>
              <Card.Text className="font-weight-bold">
                WETH Pool: 
              </Card.Text>
              <div>
                <li>Contract: <a href="https://etherscan.io/address/0x52fac8e7a139127a734a208fb288e5d3604ba0fd">0x52fac8e7a139127a734a208fb288e5d3604ba0fd</a> </li>
                <li>Stake WETH for SFI </li>
                <li>Total reward: 6,000</li>
                <li>First week: 3,000</li>
                <li>Halving every week</li>
                <span>Switch your ETH to WETH: <a href="https://relay.radar.tech/">https://relay.radar.tech</a></span>
              </div>
              <Card.Text className="mt-4 font-weight-bold">
                SFI Pool:
              </Card.Text>
              <div>
                <li>Contract: <a href="https://etherscan.io/address/0xf1145745ad0abfc7587cfe3b4d1c498be85446c7">0xf1145745ad0abfc7587cfe3b4d1c498be85446c7</a> </li>
                <li>Stake SFI for SFI </li>
                <li>Total reward: 6,000</li>
                <li>First week: 3,000</li>
                <li>Halving every week</li>
                <span>Buy SFI on Uniswap: <a href="#">coming soon</a></span>
              </div>
              <Card.Text className="mt-4 font-weight-bold">
                ETH-SFI Pool:
              </Card.Text>
              <div>
                <li>Stake ETH-SFI LP token for SFI </li>
                <li>Total reward: 18,000</li>
                <li>First week: 9,000</li>
                <li>Halving every week</li>
                <span>Add liquidity for ETH-SFI on Uniswap: <a href="#">coming soon</a></span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}