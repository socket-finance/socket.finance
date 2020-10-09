import React from 'react'
import { useWallet } from 'use-wallet'
import Button from 'react-bootstrap/Button'

export default function ConnectWallet() {
  const { status, account, connect, reset } = useWallet()

  const isConnecting = () => {
    return status === 'connecting'
  }

  const isDisconnected = () => {
    return status === 'disconnected'
  }

  const isConnected = () => {
    return status === 'connected'
  }

  const handleClick = () => {
    if (isDisconnected()) {
      connect('injected')
    } else {
      reset()
    }
  }

  const getWalletAddress = () => {
    if (account) {
      return account.substring(0, 6) + '...' + account.substring(account.length - 4, account.length)
    }
    return ""
  }

  return (
    <Button variant={isConnected() ? 'outline-success' : "outline-primary"}
      disabled={isConnecting()}
      onClick={() => handleClick()}>
        {isConnected() ? getWalletAddress() : isConnecting() ? 'Connecting…' : 'Connect Wallet'}
    </Button>
  )
}