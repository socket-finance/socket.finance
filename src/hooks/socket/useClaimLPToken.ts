import { useCallback } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import { claimETHxSOCKETLPToken } from "../../utils"
import { claimSFIxSOCKETLPToken } from "../../utils"

export const useClaimLPToken = () => {
  const {
    account,
    ethereum,
  }: { account: string | null; ethereum: provider } = useWallet()

  const handleClaimETHxSOCKETLPToken = useCallback(async () => {
    if (account) {
      const txHash = await claimETHxSOCKETLPToken(ethereum, account)
      return txHash
    }
  }, [account, ethereum])

  const handleClaimSFIxSOCKETLPToken = useCallback(async () => {
    if (account) {
      const txHash = await claimSFIxSOCKETLPToken(ethereum, account)
      return txHash
    }
  }, [account, ethereum])

  return { onClaimETHxSOCKETLPToken: handleClaimETHxSOCKETLPToken, onClaimSFIxSOCKETLPToken: handleClaimSFIxSOCKETLPToken }
}