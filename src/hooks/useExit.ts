import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { exit } from "../utils"

export const useExit = () => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleExit = useCallback(
    async (poolContract: string) => {
      if (account) {
        const txHash = await exit(ethereum, poolContract, account)
        return txHash
      }
    },
    [account, ethereum]
  )

  return { onExit: handleExit }
}