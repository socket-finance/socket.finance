import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { usePriceFeedContext } from "../context/PriceFeedContext"
import { getSFIPrice } from '../utils'

export const useSFIPrice = () => {

  const [sfiPrice, setSFIPrice] = useState<Number>(0)
  const { coinGecko } = usePriceFeedContext()
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchCirculatingSupply = useCallback(async () => {
    if (!ethereum || !coinGecko) {
      return
    }
    const price = new Number(await getSFIPrice(ethereum, coinGecko))
    setSFIPrice(price)
  }, [
    ethereum,
  ])

  useEffect(() => {
    if (ethereum) {
      fetchCirculatingSupply()
      const refreshInterval = setInterval(fetchCirculatingSupply, 10000)
      return () => clearInterval(refreshInterval)
    } else {
      return
    }
  }, [
    ethereum,
    fetchCirculatingSupply,
  ])

  return sfiPrice
}