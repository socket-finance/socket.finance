import {
  WETH_POOL_ADDRESS,
  WETH_TOKEN_ADDRESS,
  SFI_POOL_ADDRESS,
  SFI_TOKEN_ADDRESS,
  ETH_SFI_UNI_LP_POOL_ADDRESS,
  ETH_SFI_UNI_LP_TOKEN_ADDRESS,
} from './tokenAddresses'

export const STAKE_POOLS = [
  {
    id: 'ETHSFI',
    logos: ["/images/eth.png", "/images/sfi.png"],
    name: 'ETH-SFI LP Pool',
    address: ETH_SFI_UNI_LP_POOL_ADDRESS,
    tokenAddress: ETH_SFI_UNI_LP_TOKEN_ADDRESS,
    tokenName: 'ETH-SFI LP',
    poolRateUnit: 'SFI / week'
  },
  {
    id: 'WETH',
    logos: ["/images/weth.svg"],
    name: 'WETH Pool',
    address: WETH_POOL_ADDRESS,
    tokenAddress: WETH_TOKEN_ADDRESS,
    tokenName: 'WETH',
    poolRateUnit: 'SFI / week'
  },
  {
    id: 'SFI',
    logos: ["/images/sfi.png"],
    name: 'SFI Pool',
    address: SFI_POOL_ADDRESS,
    tokenAddress: SFI_TOKEN_ADDRESS,
    tokenName: 'SFI',
    poolRateUnit: 'SFI / week'
  },
]