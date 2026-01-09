import React, { useState } from 'react';

/**
 * PvPChallengePage Component
 * 
 * This page allows players to challenge a friend by entering their wallet address.
 */
const PvPChallengePage: React.FC<{ onNavigate: (page: string, data?: any) => void }> = ({ onNavigate }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateAndChallenge = async () => {
    setError('');
    
    // Basic validation
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    // Sui wallet address validation (starts with 0x and is 66 characters)
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      setError('Invalid Sui wallet address format');
      return;
    }

    setIsValidating(true);

    try {
      // For now, we'll navigate to the battle page with the challenged wallet
      // In a real implementation, this would send a challenge notification
      setTimeout(() => {
        onNavigate('pvpBattle', { opponentWallet: walletAddress });
      }, 1000);
    } catch (err) {
      setError('Failed to send challenge. Please try again.');
      setIsValidating(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen text-white p-8"
      style={{
        background: '#000000',
        border: '4px solid',
        borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        boxShadow: `
          inset 0 0 20px rgba(255,255,255,0.1),
          0 0 30px rgba(255,255,255,0.15)
        `
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 
          className="text-5xl font-black tracking-wider"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            fontFamily: 'Impact, "Arial Black", sans-serif',
            letterSpacing: '0.1em'
          }}
        >
          CHALLENGE A FRIEND
        </h1>
        
        <button
          onClick={() => onNavigate('player')}
          className="px-6 py-2 rounded-3xl font-black text-lg text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group relative"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #b8b8b8 15%, #e8e8e8 30%, #a0a0a0 45%, #f0f0f0 60%, #909090 75%, #e0e0e0 90%, #c0c0c0 100%)',
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.6),
              0 10px 20px rgba(0,0,0,0.4),
              inset 0 3px 8px rgba(255,255,255,0.9),
              inset 0 -3px 8px rgba(0,0,0,0.4),
              0 0 20px rgba(255,255,255,0.3)
            `,
            textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.3)',
          }}
        >
          <span className="relative z-10">Back to Deck</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div 
          className="w-full p-12 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '3px solid',
            borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090) 1',
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.8),
              inset 0 0 30px rgba(255,255,255,0.05)
            `
          }}
        >
          <h2 
            className="text-3xl font-black mb-6 text-center"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 50%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
              fontFamily: 'Impact, "Arial Black", sans-serif',
            }}
          >
            Enter Your Friend's Wallet Address
          </h2>

          <p className="text-gray-400 text-center mb-8">
            Challenge a friend to battle by entering their Sui wallet address
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-6 py-4 rounded-2xl text-lg font-mono bg-black bg-opacity-50 border-2 transition-all duration-300 focus:outline-none"
              style={{
                borderColor: error ? '#ff4444' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: error 
                  ? '0 0 20px rgba(255, 68, 68, 0.3)' 
                  : '0 0 20px rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
              disabled={isValidating}
            />
            {error && (
              <p className="text-red-400 mt-2 text-sm">{error}</p>
            )}
          </div>

          <button
            onClick={validateAndChallenge}
            disabled={isValidating}
            className="w-full py-5 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group relative"
            style={{
              background: isValidating 
                ? 'linear-gradient(145deg, #808080 0%, #606060 50%, #707070 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #b8b8b8 15%, #e8e8e8 30%, #a0a0a0 45%, #f0f0f0 60%, #909090 75%, #e0e0e0 90%, #c0c0c0 100%)',
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.6),
                0 10px 20px rgba(0,0,0,0.4),
                inset 0 3px 8px rgba(255,255,255,0.9),
                inset 0 -3px 8px rgba(0,0,0,0.4),
                0 0 20px rgba(255,255,255,0.3)
              `,
              textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.3)',
              cursor: isValidating ? 'not-allowed' : 'pointer',
              opacity: isValidating ? 0.7 : 1
            }}
          >
            <span className="relative z-10">
              {isValidating ? 'Sending Challenge...' : 'Send Challenge'}
            </span>
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Make sure your friend is connected to the app</p>
            <p className="mt-2">They will receive a notification to accept or refuse</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PvPChallengePage;
