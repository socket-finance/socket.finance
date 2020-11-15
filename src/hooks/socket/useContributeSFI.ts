import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { contributeSFIForSocketLGE } from "../../utils"

export const useContributeSFI = () => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleContributeSFI = useCallback(
    async (amount: string) => {
      if (account) {
        const txHash = await contributeSFIForSocketLGE(ethereum, amount, account)
        return txHash
      }
    },
    [account, ethereum]
  )

  return { onContributeSFI: handleContributeSFI }
}