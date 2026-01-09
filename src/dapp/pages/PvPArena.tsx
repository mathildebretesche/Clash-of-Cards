import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import useOwnCards from '../hooks/useOwnCards';
import PvPGame from '../components/PvPGame';
import { PvPGameService, MatchRequest } from '../services/PvPGameService';

interface PvPArenaProps {
  onNavigate: (page: string) => void;
  opponentWallet?: string;
}

type ArenaState = 'menu' | 'create_match' | 'waiting' | 'playing';

const PvPArena: React.FC<PvPArenaProps> = ({ onNavigate, opponentWallet }) => {
  const currentAccount = useCurrentAccount();
  const { data: cards, isPending } = useOwnCards();
  const [arenaState, setArenaState] = useState<ArenaState>('menu');
  const [opponentAddress, setOpponentAddress] = useState(opponentWallet || '');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MatchRequest[]>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  // Filter to get only game cards (excluding "dos" card back)
  const gameCards = React.useMemo(() => {
    if (!cards?.data) return [];
    return cards.data.filter((card: any) => {
      const gameField = card.data?.content?.fields?.game;
      const cardName = card.data?.content?.fields?.name;
      return gameField === "Game Card" && cardName !== "dos";
    });
  }, [cards]);

  // Auto-start game if opponent wallet is provided
  useEffect(() => {
    if (opponentWallet && gameCards.length >= 7) {
      setOpponentAddress(opponentWallet);
      setArenaState('playing');
      setCurrentGameId(`pvp_${Date.now()}`);
    }
  }, [opponentWallet, gameCards]);

  // Auto-select first 7 cards
  useEffect(() => {
    if (gameCards.length >= 7) {
      setSelectedCards(gameCards.slice(0, 7).map((c: any) => c.data.objectId));
    }
  }, [gameCards]);

  const handleCreateMatch = () => {
    if (!opponentAddress || selectedCards.length < 7) {
      alert('Please enter opponent address and select at least 7 cards');
      return;
    }
    
    setArenaState('waiting');
    // TODO: Call blockchain to create match request
  };

  const handleAcceptMatch = (requestId: string) => {
    // TODO: Accept match request
    setCurrentGameId(requestId);
    setArenaState('playing');
  };

  const handleRejectMatch = (requestId: string) => {
    // TODO: Reject match request
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-2xl">Loading your deck...</div>
      </div>
    );
  }

  if (gameCards.length < 7) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-screen text-white p-8"
        style={{
          background: '#000000',
          border: '4px solid',
          borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        }}
      >
        <h1 
          className="text-4xl font-black mb-4"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Impact, sans-serif'
          }}
        >
          Not Enough Cards
        </h1>
        <p className="text-xl text-gray-400 mb-8">You need at least 7 cards to play 1v1!</p>
        <button 
          onClick={() => onNavigate('shop')}
          className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #c0c0c0 100%)',
            color: '#000',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          Go to Shop
        </button>
      </div>
    );
  }

  if (arenaState === 'playing' && currentGameId) {
    return <PvPGame gameId={currentGameId} onNavigate={onNavigate} onExit={() => setArenaState('menu')} />;
  }

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
          PVP ARENA
        </h1>
        
        <button
          onClick={() => onNavigate('player')}
          className="relative px-6 py-2 rounded-3xl font-black text-lg text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
          <span className="relative z-10">Back to Menu</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          {arenaState === 'menu' && (
            <>
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4"
                  style={{
                    background: 'linear-gradient(to right, #dc2626, #ef4444)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Challenge a Player
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-2">
                  Enter your opponent's Sui address to start a 1v1 match. Winner takes a card from the loser!
                </p>
                <p className="text-sm text-gray-500">
                  Your deck: {gameCards.length} cards ({selectedCards.length} selected)
                </p>
              </div>

              {/* Create Match Section */}
              <div className="mb-12 p-8 bg-black/30 rounded-xl border border-white/10">
                <label className="block text-red-300 font-bold text-xl uppercase tracking-wider mb-4">
                  Opponent Address
                </label>
                <input
                  type="text"
                  value={opponentAddress}
                  onChange={(e) => setOpponentAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none mb-6"
                />

                <button
                  onClick={handleCreateMatch}
                  disabled={!opponentAddress || selectedCards.length < 7}
                  className="group relative w-full px-12 py-5 rounded-full font-black text-2xl tracking-wider shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(145deg, #dc2626 0%, #991b1b 100%)',
                    color: '#fff',
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.6),
                      0 10px 20px rgba(0,0,0,0.4),
                      inset 0 3px 8px rgba(255,255,255,0.2),
                      0 0 20px rgba(220,38,38,0.3)
                    `,
                  }}
                >
                  <span className="relative z-10">CHALLENGE</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>

              {/* Pending Requests Section */}
              {pendingRequests.length > 0 && (
                <div className="p-8 bg-black/30 rounded-xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                    Incoming Challenges
                  </h3>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div 
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-yellow-500/30"
                      >
                        <div>
                          <p className="text-sm text-gray-400">From:</p>
                          <p className="font-mono text-sm">{request.challenger.slice(0, 10)}...{request.challenger.slice(-8)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptMatch(request.id)}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectMatch(request.id)}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {arenaState === 'waiting' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8 animate-pulse">
                Waiting for opponent to accept...
              </h2>
              <div className="text-gray-400 mb-8">
                Challenge sent to: <span className="font-mono">{opponentAddress}</span>
              </div>
              <button
                onClick={() => setArenaState('menu')}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PvPArena;
