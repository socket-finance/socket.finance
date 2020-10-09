import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { ethers } from "ethers"
import BN from "bignumber.js"
import ERC20ABI from '../constants/abi/ERC20.json'
import POOLABI from '../constants/abi/stakePool.json'

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