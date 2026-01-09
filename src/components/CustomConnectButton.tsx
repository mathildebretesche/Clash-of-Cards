import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit'

const CustomConnectButton = () => {
  const currentAccount = useCurrentAccount()

  return (
    <ConnectModal
      trigger={
        <button
          className="relative px-8 py-3 rounded-3xl font-black text-xl text-gray-900 transition-all duration-300 overflow-hidden group cursor-pointer"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #b8b8b8 15%, #e8e8e8 30%, #a0a0a0 45%, #f0f0f0 60%, #909090 75%, #e0e0e0 90%, #c0c0c0 100%)',
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.6),
              0 10px 20px rgba(0,0,0,0.4),
              inset 0 3px 8px rgba(255,255,255,0.9),
              inset 0 -3px 8px rgba(0,0,0,0.4),
              inset 3px 0 8px rgba(255,255,255,0.5),
              inset -3px 0 8px rgba(0,0,0,0.3),
              0 0 20px rgba(255,255,255,0.3)
            `,
            textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.3)',
            transform: 'perspective(1000px) rotateX(2deg)'
          }}
        >
          <span className="relative z-10">
            {currentAccount ? 'Wallet Connected' : 'Connect Wallet'}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #d0d0d0 20%, #ffffff 40%, #b0b0b0 60%, #ffffff 80%, #c8c8c8 100%)',
              boxShadow: `
                0 25px 50px rgba(0,0,0,0.7),
                inset 0 4px 12px rgba(255,255,255,1),
                inset 0 -4px 12px rgba(0,0,0,0.5),
                0 0 30px rgba(255,255,255,0.5)
              `
            }}
          />
        </button>
      }
    />
  )
}

export default CustomConnectButton
