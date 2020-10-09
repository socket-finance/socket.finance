import React from 'react'
import { useParams } from 'react-router-dom'
import { usePoolStats } from '../hooks/usePoolStats'
import StakePanel from '../components/stakePanel'

interface ParamTypes {
  id: string
}

export default function Pool() {
  const { id } = useParams<ParamTypes>()

  const pools = usePoolStats()
  const pool = pools.find((e, i) => {return (e.id === id)})

  if (id && pools.length > 0 && pool) {
    return (
      <StakePanel pool={pool} />
    )
  } else {
    return (<></>)
  }
}