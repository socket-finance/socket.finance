import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { claim } from "../utils"

export const useClaimRewards = (poolContract: string) => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleClaim = useCallback(async () => {
    if (account) {
      const txHash = await claim(ethereum, poolContract, account)
      return txHash
    }
  }, [account, poolContract, ethereum])

  return { onClaim: handleClaim }
}
