import {
  useState,
  useEffect,
  useCallback,
} from "react"
import BN from "bignumber.js"
import { useWallet } from "use-wallet"
import { getSocketVaultsLiteStats } from '../../utils'
import { provider } from "web3-core"
import { SOCKET_FARM_POOLS } from '../../constants/socketFarmPool'

export interface IVaultsLiteStats {
  id: number
  path: string
  name: string
  logos: string[]
  tokenName: string
  tokenAddress: string
  totalLPStaked: number | undefined
  userLPStaked: BN | null
  poolAPY: number | undefined
  userClaimableSOCKET: number | undefined
}

export const useVaultsLiteStats = () => {  
  const [vaultsLiteStatus, setVaultsLiteStats] = useState<IVaultsLiteStats[]>([])

  const {
    ethereum,
    account,
  }: { ethereum: provider; account: string | null } = useWallet()

  const getVaultsLiteStats = useCallback(async () => {
    const promisedVaultsLiteStatsArr = SOCKET_FARM_POOLS.map(async (pool) => {
      const _vaultsLiteStats = await getSocketVaultsLiteStats(
        ethereum,
        pool.id,
        account
      )
      return {
        id: pool.id,
        path: pool.path,
        name: pool.name,
        logos: pool.logos,
        tokenName: pool.tokenName,
        tokenAddress: pool.tokenAddress,
        totalLPStaked: _vaultsLiteStats?.totalLPStaked,
        userLPStaked: _vaultsLiteStats?.userLPStaked ? new BN(_vaultsLiteStats?.userLPStaked) : null,
        poolAPY: _vaultsLiteStats?.poolAPY,
        userClaimableSOCKET: _vaultsLiteStats?.userClaimableSOCKET,
      }
    })

    const resolvedVaultsLiteStatsArr = await Promise.all(promisedVaultsLiteStatsArr)
    setVaultsLiteStats(resolvedVaultsLiteStatsArr)
  }, [ethereum, account])

  useEffect(() => {
    getVaultsLiteStats()
    const refreshInterval = setInterval(getVaultsLiteStats, 10000)
    return () => clearInterval(refreshInterval)
  }, [getVaultsLiteStats])

  return vaultsLiteStatus
}