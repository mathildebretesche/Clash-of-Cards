import '@mysten/dapp-kit/dist/index.css'
import '@radix-ui/themes/styles.css'
import '@suiware/kit/main.css'
import SuiProvider from '@suiware/kit/SuiProvider'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC, StrictMode, useState, useEffect } from 'react'
import IndexPage from '~~/dapp/pages/IndexPage'
import PlayerInterface from '~~/dapp/pages/PlayerInterface'
import CombatPage from '~~/dapp/pages/CombatPage'
import ShopPage from '~~/dapp/pages/ShopPage'
import PvPChallengePage from '~~/dapp/pages/PvPChallengePage'
import PvPArena from '~~/dapp/pages/PvPArena'
import { APP_NAME } from '~~/config/main'
import { getThemeSettings } from '~~/helpers/theme'
import useNetworkConfig from '~~/hooks/useNetworkConfig'
import ThemeProvider from '~~/providers/ThemeProvider'
import '~~/styles/index.css'
import { ENetwork } from '~~/types/ENetwork'

const themeSettings = getThemeSettings()

const MainContent: FC = () => {
  const currentAccount = useCurrentAccount()
  const [currentPage, setCurrentPage] = useState<'home' | 'player' | 'combat' | 'shop' | 'pvp' | 'pvpBattle'>('home')
  const [pvpData, setPvpData] = useState<any>(null)

  useEffect(() => {
    console.log('App: currentAccount changed', currentAccount);
    if (currentAccount) {
      // Only redirect to player if we are on the home page
      // This prevents resetting to 'player' when navigating to 'shop' or 'pvp'
      if (currentPage === 'home') {
        console.log('App: Setting page to player because account connected and on home');
        setCurrentPage('player')
      }
    } else {
      console.log('App: Setting page to home because no account');
      setCurrentPage('home')
    }
  }, [currentAccount, currentPage])

  console.log('App: Rendering page:', currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'player':
        return <PlayerInterface onNavigate={(page: string, data?: any) => {
          setCurrentPage(page as any)
          if (data) setPvpData(data)
        }} />
      case 'combat':
        return <CombatPage onNavigate={(page: string) => setCurrentPage(page as any)} />
      case 'shop':
        return <ShopPage onNavigate={(page: string) => setCurrentPage(page as any)} />
      case 'pvp':
        return <PvPChallengePage onNavigate={(page: string, data?: any) => {
          setCurrentPage(page as any)
          if (data) setPvpData(data)
        }} />
      case 'pvpBattle':
        return <PvPArena onNavigate={(page: string) => setCurrentPage(page as any)} opponentWallet={pvpData?.opponentWallet} />
      default:
        return (
          <div>
            <IndexPage />
            {/* Optional: Keep manual button for testing if needed, or remove if auto-switch is sufficient */}

          </div>
        )
    }
  }

  return (
    <>
      {renderPage()}

    </>
  )
}

const App: FC = () => {
  const { networkConfig } = useNetworkConfig()

  return (
    <StrictMode>
      <ThemeProvider>
        <SuiProvider
          customNetworkConfig={networkConfig}
          defaultNetwork={ENetwork.LOCALNET}
          walletAutoConnect={false}
          walletStashedName={APP_NAME}
          themeSettings={themeSettings}
        >
          <MainContent />
        </SuiProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
