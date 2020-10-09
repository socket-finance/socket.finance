import {
  useState,
  useEffect,
  useCallback,
} from "react"
import { useWallet } from "use-wallet"
import BN from "bignumber.js"
import { STAKE_POOLS } from '../constants/stakePools'
import { getPoolStats } from '../utils'
import { provider } from "web3-core"

export interface IPool {
  id: string
  name: string
  logos: string[]
  address: string
  tokenAddress: string
  totalStaked: BN | null
  halvingTime: BN | null
  tokenName: string
  poolRate: BN | null
  poolRateUnit: string
  unclaimed: BN | null
  staked: BN | null
}

export const usePoolStats = () => {  
  const [pools, setPools] = useState<IPool[]>([])

  const {
    ethereum,
    account,
  }: { ethereum: provider; account: string | null } = useWallet()

  const getStats = useCallback(async () => {
    const promisedPoolsArr = STAKE_POOLS.map(async (pool) => {
      const poolStats = await getPoolStats(
        ethereum,
        pool.address,
        account
      )
      return {
        id: pool.id,
        name: pool.name,
        logos: pool.logos,
        address: pool.address,
        tokenAddress: pool.tokenAddress,
        tokenName: pool.tokenName,
        poolRateUnit: pool.poolRateUnit,
        totalStaked: poolStats?.totalStaked ? new BN(poolStats?.totalStaked) : null,
        halvingTime: poolStats?.halvingTime ? new BN(poolStats?.halvingTime) : null,
        poolRate: poolStats?.poolRate ? new BN(poolStats?.poolRate) : null,
        unclaimed: poolStats?.unclaimed ? new BN(poolStats?.unclaimed) : null,
        staked: poolStats?.staked ? new BN(poolStats?.staked) : null,
      }
    })

    const resolvedPool = await Promise.all(promisedPoolsArr)
    setPools(resolvedPool)
  }, [ethereum, account])

  useEffect(() => {
    getStats()
    const refreshInterval = setInterval(getStats, 10000)
    return () => clearInterval(refreshInterval)
  }, [getStats])

  return pools
}