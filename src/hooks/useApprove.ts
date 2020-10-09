import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { approve } from "../utils"

export const useApprove = (tokenAddress: string, poolAddress: string) => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(ethereum, tokenAddress, poolAddress, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, tokenAddress, poolAddress, ethereum])

  return {
    onApprove: handleApprove
  }
}