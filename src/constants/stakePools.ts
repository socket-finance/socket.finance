import {
  WETH_POOL_ADDRESS,
  WETH_TOKEN_ADDRESS,
} from './tokenAddresses'

export const STAKE_POOLS = [
  {
    id: 'WETH',
    logos: ["/images/weth.svg"],
    name: 'WETH Pool',
    address: WETH_POOL_ADDRESS,
    tokenAddress: WETH_TOKEN_ADDRESS,
    tokenName: 'WETH',
    poolRateUnit: 'SFI / week'
  },
]