import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getCirculatingSupply } from '../utils'

export const useCirculatingSupply = () => {

  const [circulatingSupply, setCirculatingSupply] = useState<Number>(0)
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchCirculatingSupply = useCallback(async () => {
    if (!ethereum) {
      return
    }
    const supply = new Number(await getCirculatingSupply(ethereum))
    setCirculatingSupply(supply)
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

  return circulatingSupply
}