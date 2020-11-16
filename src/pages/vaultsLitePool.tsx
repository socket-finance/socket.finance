import React from 'react'
import { useParams } from 'react-router-dom'
import { useVaultsLiteStats } from '../hooks/socket/useVaultsLiteStats'
import SocketFarmPanel from '../components/socketFarmPanel'

interface ParamTypes {
  path: string
}

export default function VaultsLitePool() {
  const { path } = useParams<ParamTypes>()

  const pools = useVaultsLiteStats()
  const pool = pools.find((e, i) => {return (e.path === path)})

  if (path && pools.length > 0 && pool) {
    return (
      <SocketFarmPanel pool={pool} />
    )
  } else {
    return (<></>)
  }
}