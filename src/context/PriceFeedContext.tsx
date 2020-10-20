import React, { createContext,useState, useContext, useEffect } from "react"
import CoinGecko from "coingecko-api"

interface ModalsContext {
  coinGecko: unknown
}

export const Context = createContext<ModalsContext>({
  coinGecko: CoinGecko,
})

export const PriceFeedProvider: React.FC = ({ children }) => {
  const [coinGecko, setCoinGecko] = useState<any>(null)
  useEffect(() => {
    const CoinGeckoClient = new CoinGecko()
    setCoinGecko(CoinGeckoClient)
  }, [setCoinGecko])
  return (
    <Context.Provider
      value={{
        coinGecko,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const usePriceFeedContext = () => useContext(Context) as ModalsContext