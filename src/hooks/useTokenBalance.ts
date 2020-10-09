import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getTokenBalance } from '../utils'

export const useTokenBalance = (accountAddress?: string | null, tokenAddress?: string | null, decimals = 18) => {

  const [balance, setBalance] = useState<BigNumber>()
  const { ethereum }: { ethereum: provider } = useWallet()

  const fetchBalance = useCallback(async () => {
    if (!accountAddress || !ethereum || !tokenAddress) {
      return
    }
    const bal = new BigNumber(await getTokenBalance(ethereum, tokenAddress, accountAddress))
    setBalance(bal)
  }, [
    accountAddress,
    ethereum,
    tokenAddress,
  ])

  useEffect(() => {
    if (accountAddress && ethereum) {
      fetchBalance()
      const refreshInterval = setInterval(fetchBalance, 5000)
      return () => clearInterval(refreshInterval)
    } else {
      return
    }
  }, [
    accountAddress,
    decimals,
    ethereum,
    tokenAddress,
    fetchBalance,
  ])

  return balance
}