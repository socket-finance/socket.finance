import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { vaultsLiteStake, vaultsLiteUnStake } from "../../utils"

export const useVaultsLiteStake = (pid: number) => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleVaultsLiteStake = useCallback(
    async (amount: string) => {
      if (account) {
        const txHash = await vaultsLiteStake(ethereum, pid, amount, account)
        return txHash
      }
    },
    [account, ethereum]
  )

  const handleVaultsLiteUnStake = useCallback(
    async (amount: string) => {
      if (account) {
        const txHash = await vaultsLiteUnStake(ethereum, pid, amount, account)
        return txHash
      }
    },
    [account, ethereum]
  )

  return { onVaultsLiteStake: handleVaultsLiteStake, onVaultsLiteUnStake: handleVaultsLiteUnStake }
}