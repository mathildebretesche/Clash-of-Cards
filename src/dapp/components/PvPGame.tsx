import React, { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { cards } from '../../cards_data_file';
import { Card } from '../../types/Card';
import VictoryLoot from './VictoryLoot';

interface PvPGameProps {
  gameId: string;
  onNavigate: (page: string) => void;
  onExit: () => void;
}

type GameState = 'loading' | 'waiting_for_opponent' | 'playing' | 'finished' | 'loot';

const PvPGame: React.FC<PvPGameProps> = ({ gameId, onNavigate, onExit }) => {
  const currentAccount = useCurrentAccount();
  const [gameState, setGameState] = useState<GameState>('loading');
  const [round, setRound] = useState(0);
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [revealedMyCards, setRevealedMyCards] = useState<boolean[]>([false, false, false]);
  const [revealedOpponentCards, setRevealedOpponentCards] = useState<boolean[]>([false, false, false]);
  const [mySwapped, setMySwapped] = useState(false);
  const [opponentSwapped, setOpponentSwapped] = useState(false);
  const [showSwapNotification, setShowSwapNotification] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [battleOver, setBattleOver] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentAddress, setOpponentAddress] = useState('');

  // Mock data for now - TODO: Fetch from blockchain
  useEffect(() => {
    // Simulate loading game state from blockchain
    setTimeout(() => {
      setGameState('playing');
      setMyCards([cards[0], cards[1], cards[2]]);
      setOpponentCards([cards[3], cards[4], cards[5]]);
      setRound(0);
      setIsMyTurn(true);
      setOpponentAddress('0xabcd...1234');
    }, 2000);
  }, [gameId]);

  const handleRevealCard = () => {
    if (!isMyTurn || revealedMyCards[round]) return;

    const newRevealed = [...revealedMyCards];
    newRevealed[round] = true;
    setRevealedMyCards(newRevealed);
    setShowSwapNotification(!mySwapped);
  };

  const handleKeep = () => {
    setShowSwapNotification(false);
    // TODO: Call blockchain
    setIsMyTurn(false);
    
    // Simulate opponent turn
    setTimeout(() => {
      const newRevealed = [...revealedOpponentCards];
      newRevealed[round] = true;
      setRevealedOpponentCards(newRevealed);
      
      setTimeout(() => {
        if (round < 2) {
          setRound(round + 1);
          setIsMyTurn(true);
        } else {
          endGame();
        }
      }, 2000);
    }, 1500);
  };

  const handleSwap = () => {
    setShowSwapNotification(false);
    setMySwapped(true);
    
    // Replace card
    const newCards = [...myCards];
    newCards[round] = cards[Math.floor(Math.random() * (cards.length - 1))];
    setMyCards(newCards);
    
    // TODO: Call blockchain
    setIsMyTurn(false);
    
    // Simulate opponent turn
    setTimeout(() => {
      const newRevealed = [...revealedOpponentCards];
      newRevealed[round] = true;
      setRevealedOpponentCards(newRevealed);
      
      setTimeout(() => {
        if (round < 2) {
          setRound(round + 1);
          setIsMyTurn(true);
        } else {
          endGame();
        }
      }, 2000);
    }, 1500);
  };

  const endGame = () => {
    setGameState('finished');
    
    setTimeout(() => {
      const myTotal = myCards.reduce((sum, card) => sum + (typeof card.points === 'number' ? card.points : parseInt(card.points)), 0);
      const opponentTotal = opponentCards.reduce((sum, card) => sum + (typeof card.points === 'number' ? card.points : parseInt(card.points)), 0);
      
      if (myTotal > opponentTotal) {
        setWinner('You');
        setTimeout(() => {
          setGameState('loot');
        }, 3000);
      } else if (opponentTotal > myTotal) {
        setWinner('Opponent');
      } else {
        setWinner('Draw');
      }
      
      setBattleOver(true);
    }, 2000);
  };

  const dosCard = cards.find(c => c.name === 'dos') || cards[0];

  if (gameState === 'loot') {
    return <VictoryLoot opponentCards={opponentCards} onNavigate={onNavigate} />;
  }

  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-bold animate-pulse">Loading match...</h1>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen bg-gray-900 text-white p-4 overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at center, #2d2d2d 0%, #1a1a1a 35%, #000000 70%, #000000 100%)',
      }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={onExit} 
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {gameState === 'waiting_for_opponent' && (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl font-bold animate-pulse">Waiting for opponent...</h1>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'finished') && (
        <div className="flex flex-col h-full justify-between py-10">
          
          {/* Opponent Area */}
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-red-400">
              Opponent {gameState === 'finished' && opponentSwapped && "(Swapped!)"}
            </h2>
            <p className="text-sm text-gray-400 mb-2 font-mono">{opponentAddress}</p>
            <div className="flex gap-4">
              {opponentCards.map((card, index) => (
                <div key={index} className="relative w-32 h-44 transition-all duration-500">
                  {!revealedOpponentCards[index] && (
                    <img 
                      src={dosCard.url} 
                      alt="Card Back" 
                      className="w-full h-full object-cover rounded-xl border-2 border-gray-600" 
                    />
                  )}
                  {revealedOpponentCards[index] && (
                    <div className="w-full h-full bg-gray-800 rounded-xl border-2 border-red-500 flex flex-col items-center p-2">
                      <img 
                        src={card.url} 
                        alt={card.name} 
                        className="w-full h-24 object-cover rounded-md mb-2" 
                      />
                      <span className="font-bold text-sm">{card.label}</span>
                      <span className="text-xs text-yellow-400">Pts: {card.points}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center Info */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold mb-4">Round {Math.min(round + 1, 3)} / 3</div>
            
            {isMyTurn && !revealedMyCards[round] && gameState === 'playing' && (
              <button
                onClick={handleRevealCard}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg animate-pulse"
              >
                Reveal Card
              </button>
            )}

            {!isMyTurn && gameState === 'playing' && (
              <div className="text-yellow-400 animate-pulse">
                Waiting for opponent...
              </div>
            )}

            {showSwapNotification && (
              <div className="bg-gray-800 p-6 rounded-xl border border-blue-500 shadow-2xl flex flex-col items-center gap-4 z-50">
                <h3 className="text-lg font-bold">Swap Card?</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={handleKeep} 
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
                  >
                    Keep
                  </button>
                  <button 
                    onClick={handleSwap} 
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold"
                  >
                    Exchange
                  </button>
                </div>
              </div>
            )}

            {battleOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="bg-gray-800 p-10 rounded-2xl border-4 border-yellow-500 text-center animate-scale-in">
                  <h1 className="text-6xl font-black text-yellow-500 mb-4">Battle Over!</h1>
                  <h2 className="text-4xl text-white mb-8">Winner: {winner}</h2>
                  <div className="flex gap-8 justify-center mb-8">
                    <div className="text-left">
                      <p className="text-gray-400">You</p>
                      <p className="text-3xl font-bold">
                        {myCards.reduce((a, b) => a + (typeof b.points === 'number' ? b.points : parseInt(b.points)), 0)} pts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Opponent</p>
                      <p className="text-3xl font-bold">
                        {opponentCards.reduce((a, b) => a + (typeof b.points === 'number' ? b.points : parseInt(b.points)), 0)} pts
                      </p>
                    </div>
                  </div>
                  {winner !== 'You' && (
                    <button 
                      onClick={onExit} 
                      className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      Back to Arena
                    </button>
                  )}
                  {winner === 'You' && (
                    <p className="text-yellow-400 animate-pulse">Preparing your loot...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Area */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              {myCards.map((card, index) => (
                <div key={index} className="relative w-32 h-44 transition-all duration-500">
                  {!revealedMyCards[index] && (
                    <img 
                      src={dosCard.url} 
                      alt="Card Back" 
                      className="w-full h-full object-cover rounded-xl border-2 border-gray-600" 
                    />
                  )}
                  {revealedMyCards[index] && (
                    <div className="w-full h-full bg-gray-800 rounded-xl border-2 border-blue-500 flex flex-col items-center p-2">
                      <img 
                        src={card.url} 
                        alt={card.name} 
                        className="w-full h-24 object-cover rounded-md mb-2" 
                      />
                      <span className="font-bold text-sm">{card.label}</span>
                      <span className="text-xs text-yellow-400">Pts: {card.points}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold mt-4 text-blue-400">
              You {gameState === 'finished' && mySwapped && "(Swapped!)"}
            </h2>
          </div>

        </div>
      )}
    </div>
  );
};

export default PvPGame;
