import React from 'react'

export default function PoolLogo({logos}) {
  const generateLogo = (logos: string[]) => {
    return logos.map((e, i) => (
      <img
        alt=""
        src={e}
        width="23"
        height="23"
        className="d-inline-block align-middle mt-n1"
      />
    ))
  }

  return (
    <>
      {generateLogo(logos)}
    </>
  )
}