import {
  ETH_SOCKET_UNI_LP_TOKEN_ADDRESS,
  SFI_SOCKET_UNI_LP_TOKEN_ADDRESS,
} from './tokenAddresses'

export const SOCKET_VAULTS_LITE_TOTAL_POINT = 200

export const SOCKET_FARM_POOLS = [
  {
    id: 0,
    path: "ETH-SOCKET",
    logos: ["/images/eth.png", "/images/socket.png"],
    name: 'ETH-SOCKET LP Pool',
    tokenAddress: ETH_SOCKET_UNI_LP_TOKEN_ADDRESS,
    tokenName: 'ETH-SOCKET',
  },
  {
    id: 1,
    path: "SFI-SOCKET",
    logos: ["/images/sfi.png", "/images/socket.png"],
    name: 'SFI-SOCKET LP Pool',
    tokenAddress: SFI_SOCKET_UNI_LP_TOKEN_ADDRESS,
    tokenName: 'SFI-SOCKET',
  }
]