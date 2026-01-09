import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC } from 'react'
import GreetingForm from '~~/dapp/components/GreetingForm'
import Layout from '~~/components/layout/Layout'
import NetworkSupportChecker from '../../components/NetworkSupportChecker'
import CustomConnectButton from '~~/components/CustomConnectButton'

const IndexPage: FC = () => {
  const currentAccount = useCurrentAccount()

  return (
    <Layout>
      <NetworkSupportChecker />
      <div className="flex flex-grow flex-col items-center justify-center rounded-md p-3 h-full w-full relative">
        {currentAccount ? (
          <div className="flex flex-col items-center justify-center gap-12">
            <GreetingForm />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-12">
              <h1 
                className="text-7xl font-black tracking-wider"
                style={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                  fontFamily: 'Impact, "Arial Black", sans-serif',
                  letterSpacing: '0.1em'
                }}
              >
                CLASH OF CARDS
              </h1>
              <div className="flex flex-col items-center justify-center gap-8">
                <CustomConnectButton />
                <h2 
                  className="text-2xl tracking-widest uppercase"
                  style={{
                    fontFamily: 'Impact, "Arial Black", sans-serif',
                    background: 'linear-gradient(180deg, #aaaaaa 0%, #e0e0e0 50%, #aaaaaa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    letterSpacing: '0.2em'
                  }}
                >
                  Own Your Cards. Own the Game.
                </h2>
              </div>
            </div>
            <p 
              className="text-xs tracking-wide"
              style={{
                position: 'absolute',
                bottom: '2rem',
                color: '#888888',
                opacity: 0.7,
                letterSpacing: '0.1em'
              }}
            >
              powered by sui blockchain
            </p>
          </>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
