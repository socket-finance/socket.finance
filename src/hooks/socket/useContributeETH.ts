import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { contributeETHForSocketLGE } from "../../utils"

export const useContributeETH = () => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleContributeETH = useCallback(
    async (amount: string) => {
      if (account) {
        const txHash = await contributeETHForSocketLGE(ethereum, amount, account)
        return txHash
      }
    },
    [account, ethereum]
  )

  return { onContributeETH: handleContributeETH }
}