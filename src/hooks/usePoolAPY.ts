import {
  useState,
  useEffect,
  useCallback,
} from "react"
import { useWallet } from "use-wallet"
import { getPoolAPY } from '../utils'
import { provider } from "web3-core"

export interface IPoolAPY {
  WETH: number | null | undefined
  SFI: number | null | undefined
  ETHSFI: number | null | undefined
}

export const usePoolAPY = () => {  
  const [poolAPY, setPoolAPY] = useState<IPoolAPY>()

  const {
    ethereum,
    account,
  }: { ethereum: provider; account: string | null } = useWallet()

  const getPoolAPYs = useCallback(async () => {
    const promisedPoolsAPY = async () => {
      const poolAPYs = await getPoolAPY(
        ethereum
      )
      return {
        WETH: poolAPYs?.wethPoolAPY,
        SFI: poolAPYs?.sfiPoolAPY,
        ETHSFI: poolAPYs?.ethSFIPoolAPY,
      }
    }

    const resolvedPoolAPY = await promisedPoolsAPY()
    setPoolAPY(resolvedPoolAPY)
  }, [ethereum, account])

  useEffect(() => {
    getPoolAPYs()
    const refreshInterval = setInterval(getPoolAPYs, 10000)
    return () => clearInterval(refreshInterval)
  }, [getPoolAPYs])

  return poolAPY
}