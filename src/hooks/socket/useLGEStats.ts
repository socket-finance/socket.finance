import {
  useState,
  useEffect,
  useCallback,
} from "react"
import { useWallet } from "use-wallet"
import { getSOCKETLGEStats } from '../../utils'
import { provider } from "web3-core"
import { usePriceFeedContext } from "../../context/PriceFeedContext"

export interface ISocketLGEStats {
  liquidityGenerationOngoing: boolean | undefined
  totalETHContributed: number | undefined
  totalSFIContributed: number | undefined
  socketPriceEstimateAfterLGE: number | undefined
  socketMarketCapEstimateAfterLGE: number | undefined
  userETHContributed: number | undefined
  userSFIContributed: number | undefined
  lgeParticipationAgreement: string | undefined
  secondsLeftInLiquidityGenerationEvent: number | undefined
  lpPerETHUnit: number | undefined
  lpPerSFIUnit: number | undefined
  socketForSFIAllocate: number | undefined
}

export const useLGEStats = () => {  
  const [lgeStatus, setLgeStats] = useState<ISocketLGEStats>()
  const { coinGecko } = usePriceFeedContext()

  const {
    ethereum,
    account,
  }: { ethereum: provider; account: string | null } = useWallet()

  const getLGEStats = useCallback(async () => {
    const promisedLGEStats = async () => {
      const _lgeStats = await getSOCKETLGEStats(
        ethereum,
        coinGecko,
        account
      )
      return {
        liquidityGenerationOngoing: _lgeStats?.liquidityGenerationOngoing,
        totalETHContributed: _lgeStats?.totalETHContributed,
        totalSFIContributed: _lgeStats?.totalSFIContributed,
        socketPriceEstimateAfterLGE: _lgeStats?.socketPriceEstimateAfterLGE,
        socketMarketCapEstimateAfterLGE: _lgeStats?.socketMarketCapEstimateAfterLGE,
        userETHContributed: _lgeStats?.userETHContributed,
        userSFIContributed: _lgeStats?.userSFIContributed,
        lgeParticipationAgreement: _lgeStats?.lgeParticipationAgreement,
        secondsLeftInLiquidityGenerationEvent: _lgeStats?.secondsLeftInLiquidityGenerationEvent,
        lpPerETHUnit: _lgeStats?.lpPerETHUnit,
        lpPerSFIUnit: _lgeStats?.lpPerSFIUnit,
        socketForSFIAllocate: _lgeStats?.socketForSFIAllocate,
      }
    }

    const resolvedLGEStats = await promisedLGEStats()
    setLgeStats(resolvedLGEStats)
  }, [ethereum, coinGecko, account])

  useEffect(() => {
    getLGEStats()
    const refreshInterval = setInterval(getLGEStats, 10000)
    return () => clearInterval(refreshInterval)
  }, [getLGEStats])

  return lgeStatus
}