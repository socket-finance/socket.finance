import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { ethers } from "ethers"
import BN from "bignumber.js"
import ERC20ABI from '../constants/abi/ERC20.json'
import POOLABI from '../constants/abi/stakePool.json'
import SOCKETLGEABI from '../constants/abi/socketLGE.json'
import VAULTSLITEABI from '../constants/abi/vaultsLite.json'
import NBUNIERC20ABI from '../constants/abi/NBUNIERC20.json'
import {
  SFI_TOKEN_ADDRESS,
  WETH_TOKEN_ADDRESS,
  ETH_SFI_UNI_LP_TOKEN_ADDRESS,
  WETH_POOL_ADDRESS,
  SFI_POOL_ADDRESS,
  ETH_SFI_UNI_LP_POOL_ADDRESS,
  SOCKET_LGE_ADDRESS,
  SOCKET_TOKEN_ADDRESS,
  VAULTS_LITE_ADDRESS,
} from '../constants/tokenAddresses'
import {
  SOCKET_VAULTS_LITE_TOTAL_POINT
} from '../constants/socketFarmPool'

export const getERC20Contract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ERC20ABI.abi as unknown as AbiItem, address)
  return contract
}

export const getNBUNIERC20Contract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (NBUNIERC20ABI as unknown) as AbiItem,
    address
  )
  return contract
}

export const getPoolContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (POOLABI as unknown) as AbiItem,
    address
  )
  return contract
}

export const getSocketLGEContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (SOCKETLGEABI as unknown) as AbiItem,
    address
  )
  return contract
}

export const getVaultsLiteContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (VAULTSLITEABI as unknown) as AbiItem,
    address
  )
  return contract
}

interface PoolStats {
  halvingTime: string
  totalStaked: string
  poolRate: BN | null
  unclaimed: BN | null
  staked: BN | null
}

export const getPoolStats = async (
  provider: provider,
  poolAddress: string,
  account: string | null
): Promise<PoolStats | null> => {
  if (provider && account) {
    try {
      let poolContract
      let halvingTime
      let totalStaked
      let poolRate
      let unclaimed
      let staked

      poolContract = getPoolContract(provider, poolAddress)
      halvingTime = await poolContract.methods.periodFinish().call()
      totalStaked = await poolContract.methods.totalSupply().call()
      poolRate = await poolContract.methods.initreward().call()
      unclaimed = await poolContract.methods.earned(account).call()
      staked = await poolContract.methods.balanceOf(account).call()

      return {
        halvingTime,
        totalStaked,
        poolRate,
        unclaimed,
        staked
      }
    } catch (e) {
      console.log(e)
      return null
    }
  } else {
    return null
  }
}

export const getTokenBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string
): Promise<string> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress)
    const balance: string = await tokenContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return "0"
  }
}

export const claim = async (
  provider: provider,
  poolAddress: string,
  account: string | null
) => {
  try {
    const poolContract = getPoolContract(provider, poolAddress)
    return poolContract.methods
      .getReward()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

export const approve = async (
  provider: provider,
  tokenAddress: string,
  poolAddress: string,
  account: string | null
) => {
  const tokenContract = getERC20Contract(provider, tokenAddress)
  const maxApprovalAmount = ethers.constants.MaxUint256.toString()
  try {
    return tokenContract.methods
      .approve(poolAddress, maxApprovalAmount)
      .send({ from: account, gas: 80000 })
  } catch (e) {
    console.log(e)
  }
}

export const getAllowance = async (
  provider: provider,
  tokenAddress: string,
  poolAddress: string,
  account: string
): Promise<string> => {
  try {
    const tokenContract = getERC20Contract(provider, tokenAddress)
    const allowance: string = await tokenContract.methods
      .allowance(account, poolAddress)
      .call()
    return allowance
  } catch (e) {
    return "0"
  }
}

export const stake = async (
  provider: provider,
  poolAddress: string,
  amount: string,
  account: string
) => {
  const poolContract = getPoolContract(provider, poolAddress)
  const web3 = new Web3(provider)
  const tokens = web3.utils.toWei(amount.toString(), "ether")
  const bntokens = web3.utils.toBN(tokens)
  return poolContract.methods
    .stake(bntokens)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (
  provider: provider,
  poolAddress: string,
  amount: string,
  account: string
) => {
  try {
    const poolContract = getPoolContract(provider, poolAddress)
    const web3 = new Web3(provider)
    const tokens = web3.utils.toWei(amount.toString(), "ether")
    const bntokens = web3.utils.toBN(tokens)
    return poolContract.methods
      .withdraw(bntokens)
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

export const exit = async (
  provider: provider,
  poolAddress: string,
  account: string
) => {
  try {
    const poolContract = getPoolContract(provider, poolAddress)
    return poolContract.methods
      .exit()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

const getWeeklyRewards = async function (synthContract) {
  const rewardRate = await synthContract.methods.initreward().call()
  return bnToDec(new BN(rewardRate))
}

interface PoolAPY {
  ethSFIPoolAPY: number | null
  wethPoolAPY: number | null
  sfiPoolAPY: number | null
}

export const getPoolAPY = async (provider: provider): Promise<PoolAPY | null> => {
  if (provider) {
    try {
      const ethSFIPoolContract = getPoolContract(provider, ETH_SFI_UNI_LP_POOL_ADDRESS)
      const sfiPoolContract = getPoolContract(provider, SFI_POOL_ADDRESS)
      const wethPoolContract = getPoolContract(provider, WETH_POOL_ADDRESS)

      const ethSFIPoolRate = await getWeeklyRewards(ethSFIPoolContract)
      const sfiPoolRate = await getWeeklyRewards(sfiPoolContract)
      const wethPoolRate = await getWeeklyRewards(wethPoolContract)

      const sfiTokenContract = getERC20Contract(provider, SFI_TOKEN_ADDRESS)
      const wethContract = getERC20Contract(provider, WETH_TOKEN_ADDRESS)
      const ethSFILPContract = getERC20Contract(provider, ETH_SFI_UNI_LP_TOKEN_ADDRESS)

      const totalSFIInUniswap = (await sfiTokenContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18
      const totalWETHInUniswap = (await wethContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18
      const totalETHSFILPStaked = (await ethSFIPoolContract.methods.totalSupply().call()) / 1e18
      const totalETHSFILP = (await ethSFILPContract.methods.totalSupply().call()) / 1e18
      const totalWETHStaked = (await wethPoolContract.methods.totalSupply().call()) / 1e18
      const totalSFIStaked = (await sfiPoolContract.methods.totalSupply().call()) / 1e18

      const ethSFIPoolAPY = ethSFIPoolRate / 7.0 * 365.0 / (totalETHSFILPStaked / totalETHSFILP * totalSFIInUniswap * 2)
      const wethPoolAPY = wethPoolRate / 7.0 * 365 / (totalWETHStaked * totalSFIInUniswap / totalWETHInUniswap)
      const sfiPoolAPY = sfiPoolRate / 7.0 * 365 / (totalSFIStaked)

      return {
        ethSFIPoolAPY,
        wethPoolAPY,
        sfiPoolAPY
      }
    } catch (e) {
      console.log(e)
      return null
    }
  } else {
    return null
  }
}

export const getTotalValueLocked = async (provider: provider, coinGecko: any): Promise<number> => {
  if (provider && coinGecko) {
    try {
      const { data } = await coinGecko.simple.fetchTokenPrice({
        contract_addresses: WETH_TOKEN_ADDRESS,
        vs_currencies: "usd",
      })

      const wethPoolContract = getPoolContract(provider, WETH_POOL_ADDRESS)
      const sfiPoolContract = getPoolContract(provider, SFI_POOL_ADDRESS)

      const sfiTokenContract = getERC20Contract(provider, SFI_TOKEN_ADDRESS)
      const wethContract = getERC20Contract(provider, WETH_TOKEN_ADDRESS)

      const totalSFIInUniswap = (await sfiTokenContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18
      const totalWETHInUniswap = (await wethContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18
      const totalWETHStaked = (await wethPoolContract.methods.totalSupply().call()) / 1e18
      const totalSFIStaked = (await sfiPoolContract.methods.totalSupply().call()) / 1e18

      const totalValueLockedInUniswap = totalWETHInUniswap * 2 * data[WETH_TOKEN_ADDRESS].usd
      const totalValueLockedInWETHPool = totalWETHStaked * data[WETH_TOKEN_ADDRESS].usd
      const totalValueLockedInSFIPool = totalSFIStaked * totalWETHInUniswap / totalSFIInUniswap * data[WETH_TOKEN_ADDRESS].usd

      return totalValueLockedInUniswap + totalValueLockedInWETHPool + totalValueLockedInSFIPool
    } catch (e) {
      console.log(e)
      return 0
    }
  } else {
    return 0
  }
}

export const getCirculatingSupply = async (provider: provider): Promise<number> => {
  if (provider) {
    try {
      const sfiTokenContract = getERC20Contract(provider, SFI_TOKEN_ADDRESS)

      const ethSFIPoolContract = getPoolContract(provider, ETH_SFI_UNI_LP_POOL_ADDRESS)
      const sfiPoolContract = getPoolContract(provider, SFI_POOL_ADDRESS)
      const wethPoolContract = getPoolContract(provider, WETH_POOL_ADDRESS)

      const totalSFIMinted = (await sfiTokenContract.methods.totalSupply().call()) / 1e18 - 1500

      const ethSFIPoolRewardRate = await ethSFIPoolContract.methods.rewardRate().call() / 1e18
      const sfiPoolRewardRate = await sfiPoolContract.methods.rewardRate().call() / 1e18
      const wethPoolRewardRate = await wethPoolContract.methods.rewardRate().call() / 1e18

      const ethSFIPeriodFinish = await ethSFIPoolContract.methods.periodFinish().call()
      const sfiPoolPeriodFinish = await sfiPoolContract.methods.periodFinish().call()
      const wethPoolPeriodFinish = await wethPoolContract.methods.periodFinish().call()

      const currentTimestamp = new Date().getTime() / 1000 

      const ethSFIPoolRemainAmount = currentTimestamp <= ethSFIPeriodFinish ? (ethSFIPeriodFinish - currentTimestamp) * ethSFIPoolRewardRate : 0
      const sfiPoolRemainAmount = currentTimestamp <= sfiPoolPeriodFinish ? (sfiPoolPeriodFinish - currentTimestamp) * sfiPoolRewardRate : 0
      const wethPoolRemainAmount = currentTimestamp <= wethPoolPeriodFinish ? (wethPoolPeriodFinish - currentTimestamp) * wethPoolRewardRate : 0

      const ethSFIPoolDevFund = await ethSFIPoolContract.methods.devWithdrawnAmt().call() / 1e18
      const wethPoolDevFund = await wethPoolContract.methods.devWithdrawnAmt().call() / 1e18
      const sfiPoolDevFund = await sfiPoolContract.methods.devWithdrawnAmt().call() / 1e18

      return totalSFIMinted - ethSFIPoolRemainAmount - sfiPoolRemainAmount - wethPoolRemainAmount + ethSFIPoolDevFund + wethPoolDevFund + sfiPoolDevFund
    } catch (e) {
      console.log(e)
      return 0
    }
  } else {
    return 0
  }
}

export const getSFIPrice = async (provider: provider, coinGecko: any) : Promise<number> => {
  if (provider && coinGecko) {
    try {
      const { data } = await coinGecko.simple.fetchTokenPrice({
        contract_addresses: WETH_TOKEN_ADDRESS,
        vs_currencies: "usd",
      })
      const sfiTokenContract = getERC20Contract(provider, SFI_TOKEN_ADDRESS)
      const wethContract = getERC20Contract(provider, WETH_TOKEN_ADDRESS)

      const totalSFIInUniswap = (await sfiTokenContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18
      const totalWETHInUniswap = (await wethContract.methods.balanceOf(ETH_SFI_UNI_LP_TOKEN_ADDRESS).call()) / 1e18

      return totalWETHInUniswap / totalSFIInUniswap * data[WETH_TOKEN_ADDRESS].usd
    } catch (e) {
      console.log(e)
      return 0
    }
  } else {
    return 0
  }
}

interface SocketLGEStats {
  liquidityGenerationOngoing: boolean
  totalETHContributed: number
  totalSFIContributed: number
  socketPriceEstimateAfterLGE: number
  socketMarketCapEstimateAfterLGE: number
  userETHContributed: number
  userSFIContributed: number
  lgeParticipationAgreement: string
  secondsLeftInLiquidityGenerationEvent: number
  lpPerETHUnit: number
  lpPerSFIUnit: number
}

export const getSOCKETLGEStats = async (provider: provider, coinGecko: any, account: string | null) : Promise<SocketLGEStats | null> => {
  if (provider && coinGecko && account) {
    try {
      const { data } = await coinGecko.simple.fetchTokenPrice({
        contract_addresses: [WETH_TOKEN_ADDRESS, SFI_TOKEN_ADDRESS],
        vs_currencies: "usd",
      })

      const socketLGEContract = getSocketLGEContract(provider, SOCKET_LGE_ADDRESS)

      const liquidityGenerationOngoing = await socketLGEContract.methods.liquidityGenerationOngoing().call()
      const totalETHContributed = await socketLGEContract.methods.totalETHContributed().call() / 1e18
      const totalSFIContributed = await socketLGEContract.methods.totalSFIContributed().call() / 1e18
      const userETHContributed = await socketLGEContract.methods.ethContributed(account).call() / 1e18
      const userSFIContributed = await socketLGEContract.methods.sfiContributed(account).call() / 1e18
      const lgeParticipationAgreement = await socketLGEContract.methods.liquidityGenerationParticipationAgreement().call()
      const socketPriceEstimateAfterLGE = (totalETHContributed * data[WETH_TOKEN_ADDRESS].usd + totalSFIContributed * data[SFI_TOKEN_ADDRESS].usd) / 10000
      const socketMarketCapEstimateAfterLGE = socketPriceEstimateAfterLGE * 10000
      const lpPerETHUnit = await socketLGEContract.methods.LPperETHUnit().call() / 1e18
      const lpPerSFIUnit = await socketLGEContract.methods.LPperSFIUnit().call() / 1e18

      let secondsLeftInLiquidityGenerationEvent
      try {
        secondsLeftInLiquidityGenerationEvent = await socketLGEContract.methods.getSecondsLeftInLiquidityGenerationEvent().call()
      } catch (e) {
        secondsLeftInLiquidityGenerationEvent = 0
      }

      return {
        liquidityGenerationOngoing,
        totalETHContributed,
        totalSFIContributed,
        socketPriceEstimateAfterLGE,
        socketMarketCapEstimateAfterLGE,
        userETHContributed,
        userSFIContributed,
        lgeParticipationAgreement,
        secondsLeftInLiquidityGenerationEvent,
        lpPerETHUnit,
        lpPerSFIUnit
      }
    } catch (e) {
      console.log(e)
      return null
    }
  } else {
    return null
  }
}

export const contributeETHForSocketLGE = async (
  provider: provider,
  amount: string,
  account: string
) => {
  const socketLGEContract = getSocketLGEContract(provider, SOCKET_LGE_ADDRESS)
  const web3 = new Web3(provider)
  const tokens = web3.utils.toWei(amount.toString(), "ether")
  const bntokens = web3.utils.toBN(tokens)
  return socketLGEContract.methods
    .addLiquidity(true)
    .send({ from: account, value: bntokens})
    .on("transactionHash", (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}


export const contributeSFIForSocketLGE = async (
  provider: provider,
  amount: string,
  account: string
) => {
  const socketLGEContract = getSocketLGEContract(provider, SOCKET_LGE_ADDRESS)
  const web3 = new Web3(provider)
  const tokens = web3.utils.toWei(amount.toString(), "ether")
  const bntokens = web3.utils.toBN(tokens)
  return socketLGEContract.methods
    .addLiquidityForSFI(true, bntokens)
    .send({ from: account})
    .on("transactionHash", (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const claimETHxSOCKETLPToken = async (
  provider: provider,
  account: string | null
) => {
  try {
    const socketLGEContract = getSocketLGEContract(provider, SOCKET_LGE_ADDRESS)
    return socketLGEContract.methods
      .claimLPTokens()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

export const claimSFIxSOCKETLPToken = async (
  provider: provider,
  account: string | null
) => {
  try {
    const socketLGEContract = getSocketLGEContract(provider, SOCKET_LGE_ADDRESS)
    return socketLGEContract.methods
      .claimLPTokensForSFI()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

interface VaultsLiteStats {
  totalLPStaked: number
  userLPStaked: BN
  poolAPY: number
  userClaimableSOCKET: number
}

export const getSocketVaultsLiteStats = async (provider: provider, pid: number, account: string | null) : Promise<VaultsLiteStats | null> => {
  if (provider && pid != undefined && account) {
    try {
      const socketTokenContract = getNBUNIERC20Contract(provider, SOCKET_TOKEN_ADDRESS)
      const vaultsLiteContract = getVaultsLiteContract(provider, VAULTS_LITE_ADDRESS)

      const poolInfo = await vaultsLiteContract.methods.poolInfo(pid).call()
      const lpTokenContract = getERC20Contract(provider, poolInfo.token)

      const epochCalculationStartBlock = await vaultsLiteContract.methods.epochCalculationStartBlock().call()

      const web3 = new Web3(provider)
      const block = web3.eth.getBlock(epochCalculationStartBlock)
      const epochCalculationStartTimestap = Number((await block).timestamp)

      const rewardsInThisEpoch = await vaultsLiteContract.methods.rewardsInThisEpoch().call() / 1e18

      const totalLPSupply = await lpTokenContract.methods.totalSupply().call() / 1e18
      const totalLPStaked = await lpTokenContract.methods.balanceOf(VAULTS_LITE_ADDRESS).call() / 1e18
      const totalSOCKETInUniswap = (await socketTokenContract.methods.balanceOf(poolInfo.token).call()) / 1e18

      const userLPStaked = (await vaultsLiteContract.methods.userInfo(pid, account).call()).amount

      const totalRewardFullYear = rewardsInThisEpoch / ((Date.now() / 1000) - Number(epochCalculationStartTimestap)) * 24 * 3600 * 365

      const poolAPY = totalRewardFullYear * Number(poolInfo.allocPoint) / SOCKET_VAULTS_LITE_TOTAL_POINT / ((totalLPStaked / totalLPSupply) * totalSOCKETInUniswap * 2)

      const userClaimableSOCKET = await vaultsLiteContract.methods.pendingSocket(pid, account).call() / 1e18

      return {
        totalLPStaked,
        userLPStaked,
        poolAPY,
        userClaimableSOCKET
      }
    } catch (e) {
      console.log(e)
      return null
    }
  } else {
    return null
  }
}

export const vaultsLiteClaim = async (
  provider: provider,
  pid: number,
  account: string | null
) => {
  try {
    const vaultsLiteContract = getVaultsLiteContract(provider, VAULTS_LITE_ADDRESS)
    return vaultsLiteContract.methods
      .getReward(pid)
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

export const vaultsLiteStake = async (
  provider: provider,
  pid: number,
  amount: string,
  account: string
) => {
  const vaultsLiteContract = getVaultsLiteContract(provider, VAULTS_LITE_ADDRESS)
  const web3 = new Web3(provider)
  const tokens = web3.utils.toWei(amount.toString(), "ether")
  const bntokens = web3.utils.toBN(tokens)
  return vaultsLiteContract.methods
    .deposit(pid, bntokens)
    .send({ from: account })
    .on("transactionHash", (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const vaultsLiteUnStake = async (
  provider: provider,
  pid: number,
  amount: string,
  account: string
) => {
  try {
    const vaultsLiteContract = getVaultsLiteContract(provider, VAULTS_LITE_ADDRESS)
    const web3 = new Web3(provider)
    const tokens = web3.utils.toWei(amount.toString(), "ether")
    const bntokens = web3.utils.toBN(tokens)
    return vaultsLiteContract.methods
      .withdraw(pid, bntokens)
      .send({ from: account })
      .on("transactionHash", (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } catch (e) {
    console.log(e)
  }
}

export const bnToDec = (bn: BigNumber, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

export const decStrToBn = (str: string, decimals = 18) => {
  return new BigNumber(str).multipliedBy(new BigNumber(10).pow(decimals))
}

export const getFullDisplayBalance = (balance: BigNumber, format = 4, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFormat(format)
}

export const getFormattedDate = (timestamp: BigNumber) => {
  return new Date(Number(timestamp.toFixed()) * 1000).toLocaleString()
}

export const secondsToDhms = (seconds: number) => {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  //var s = Math.floor(seconds % 60);
  
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
  //var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay;
}