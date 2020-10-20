import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { usePriceFeedContext } from "../context/PriceFeedContext"
import { getTotalValueLocked } from '../utils'

export const useTotalValueLocked = () => {

  const [totalValueLockedInUSD, setTotalValueLockedInUSD] = useState<Number>(0)
  const { coinGecko } = usePriceFeedContext()
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchTotalValue = useCallback(async () => {
    if (!ethereum || !coinGecko) {
      return
    }
    const totalValue = new Number(await getTotalValueLocked(ethereum, coinGecko))
    setTotalValueLockedInUSD(totalValue)
  }, [
    ethereum,
    coinGecko
  ])

  useEffect(() => {
    if (coinGecko && ethereum) {
      fetchTotalValue()
      const refreshInterval = setInterval(fetchTotalValue, 10000)
      return () => clearInterval(refreshInterval)
    } else {
      return
    }
  }, [
    ethereum,
    coinGecko,
    fetchTotalValue,
  ])

  return totalValueLockedInUSD
}