import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { vaultsLiteClaim } from "../../utils"

export const useVaultsLiteClaim = (pid: number) => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleVaultsLiteClaim = useCallback(async () => {
    if (account) {
      const txHash = await vaultsLiteClaim(ethereum, pid, account)
      return txHash
    }
  }, [account, ethereum])

  return { onVaultsLiteClaim: handleVaultsLiteClaim }
}
