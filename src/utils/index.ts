import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { ethers } from "ethers"
import BN from "bignumber.js"
import ERC20ABI from '../constants/abi/ERC20.json'
import POOLABI from '../constants/abi/stakePool.json'
import {
  SFI_TOKEN_ADDRESS,
  WETH_TOKEN_ADDRESS,
  ETH_SFI_UNI_LP_TOKEN_ADDRESS,
  WETH_POOL_ADDRESS,
  SFI_POOL_ADDRESS,
  ETH_SFI_UNI_LP_POOL_ADDRESS
} from '../constants/tokenAddresses'

export const getERC20Contract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ERC20ABI.abi as unknown as AbiItem, address)
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