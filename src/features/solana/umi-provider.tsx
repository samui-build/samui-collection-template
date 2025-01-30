import { useWallet } from '@solana/wallet-adapter-react'
import React, { ReactNode, useMemo } from 'react'
import { getUmi, Umi } from './get-umi'

export interface UmiProviderContext {
  umi: Umi
}

const UmiContext = React.createContext<UmiProviderContext>({} as UmiProviderContext)

export function UmiProvider(props: { children: ReactNode; endpoint: string }) {
  const { children } = props
  const wallet = useWallet()
  const umi = useMemo(() => getUmi({ endpoint: props.endpoint, wallet }), [props.endpoint, wallet])

  const value = {
    umi,
  }
  return <UmiContext.Provider value={value}>{children}</UmiContext.Provider>
}

export function useUmi() {
  return React.useContext(UmiContext)
}
