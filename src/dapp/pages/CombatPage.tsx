import React, { useEffect, useState } from 'react';
import { cards } from '~~/cards_data_file';
import { Card } from '~~/types/Card';
import VictoryLoot from '~~/dapp/components/VictoryLoot';

interface BattlePageProps {
  onNavigate: (page: string) => void;
}

type GameState = 'waiting' | 'playing' | 'finished' | 'loot';
type Turn = 'user' | 'opponent';

const BattlePage: React.FC<BattlePageProps> = ({ onNavigate }) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [round, setRound] = useState(0); // 0: not started, 1, 2, 3
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [revealedUserCards, setRevealedUserCards] = useState<boolean[]>([false, false, false]);
  const [revealedOpponentCards, setRevealedOpponentCards] = useState<boolean[]>([false, false, false]);
  const [turn, setTurn] = useState<Turn>('user'); // Randomly decided initially
  const [userSwapped, setUserSwapped] = useState(false);
  const [opponentSwapped, setOpponentSwapped] = useState(false);
  const [showSwapNotification, setShowSwapNotification] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [battleOver, setBattleOver] = useState(false);

  // Helper to get random cards
  const getRandomCards = (count: number) => {
    const playableCards = cards.filter(c => !c.excludeFromBoosters);
    const shuffled = [...playableCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Helper to get random card
  const getRandomCard = () => {
    const playableCards = cards.filter(c => !c.excludeFromBoosters);
    const randomIndex = Math.floor(Math.random() * playableCards.length);
    return playableCards[randomIndex];
  };

  // Initial Setup
  useEffect(() => {
    // Simulate finding player
    const timer = setTimeout(() => {
      setGameState('playing');
      setUserCards(getRandomCards(3));
      setOpponentCards(getRandomCards(3));
      setTurn(Math.random() > 0.5 ? 'user' : 'opponent');
      setRound(1);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Game Loop / Round Logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (round > 3) {
      endGame();
      return;
    }

    const currentCardIndex = round - 1;

    if (turn === 'opponent') {
      // Opponent Turn
      const timer = setTimeout(() => {
        // Reveal opponent card
        setRevealedOpponentCards(prev => {
          const newRevealed = [...prev];
          newRevealed[currentCardIndex] = true;
          return newRevealed;
        });

        // Opponent logic: 20% chance to swap if not already swapped
        if (!opponentSwapped && Math.random() < 0.2) {
            setTimeout(() => {
                setOpponentCards(prev => {
                    const newCards = [...prev];
                    newCards[currentCardIndex] = getRandomCard();
                    return newCards;
                });
                setOpponentSwapped(true);
            }, 1000);
        }

        // Pass turn to user
        setTimeout(() => {
            setTurn('user');
        }, 2000);

      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // User Turn
      // Automatically reveal user card
      if (!revealedUserCards[currentCardIndex]) {
          const timer = setTimeout(() => {
            setRevealedUserCards(prev => {
                const newRevealed = [...prev];
                newRevealed[currentCardIndex] = true;
                return newRevealed;
            });
            
            // Show swap notification if not swapped yet
            if (!userSwapped) {
                setShowSwapNotification(true);
            } else {
                // If already swapped, just wait and proceed to next round
                setTimeout(() => {
                    nextRound();
                }, 2000);
            }
          }, 1000);
          return () => clearTimeout(timer);
      }
    }
  }, [gameState, round, turn]);

  const nextRound = () => {
      setRound(prev => prev + 1);
      // Turn order stays same: Randomly chosen first player always goes first in round
      // But wait, "The second player will always go next. The order stays the same for all three rounds."
      // So if User started Round 1, User starts Round 2? Or does it alternate?
      // "Randomly choose one of the players to go first. The second player will always go next. The order stays the same for all three rounds."
      // This implies: Round 1: P1 -> P2. Round 2: P1 -> P2. Round 3: P1 -> P2.
      // So we need to remember who was the first player.
      // Let's store `firstPlayer` in state? Or just reset `turn` to the initial first player.
      // Actually, my logic above toggles turn. 
      // If `turn` was 'opponent', it sets to 'user'. 
      // If `turn` was 'user', it waits for user action then... who goes next?
      // Ah, I need to handle the flow better.
      
      // Let's refine the flow:
      // We need a `startingPlayer` state.
      // At start of each round, set `turn` to `startingPlayer`.
      // If `startingPlayer` finishes, set `turn` to other player.
      // If other player finishes, `nextRound`.
  };
  
  // Refined Logic with `startingPlayer`
  const [startingPlayer, setStartingPlayer] = useState<Turn>('user'); // Will be set in initial useEffect
  const [currentRoundTurn, setCurrentRoundTurn] = useState<0 | 1>(0); // 0: first player, 1: second player

  // Re-implementing the game flow in a cleaner way
  useEffect(() => {
      if (gameState === 'waiting') {
          const timer = setTimeout(() => {
              setGameState('playing');
              setUserCards(getRandomCards(3));
              setOpponentCards(getRandomCards(3));
              const start = Math.random() > 0.5 ? 'user' : 'opponent';
              setStartingPlayer(start);
              setTurn(start);
              setRound(1);
              setCurrentRoundTurn(0);
          }, 2000);
          return () => clearTimeout(timer);
      }
  }, [gameState]);

  useEffect(() => {
      if (gameState !== 'playing' || round > 3) return;

      const cardIndex = round - 1;
      
      const handleTurn = async () => {
          if (turn === 'opponent') {
              // Opponent Logic
              await new Promise(r => setTimeout(r, 1000));
              setRevealedOpponentCards(prev => {
                  const newRev = [...prev];
                  newRev[cardIndex] = true;
                  return newRev;
              });

              // Opponent Swap Logic
              if (!opponentSwapped && Math.random() < 0.3) {
                  await new Promise(r => setTimeout(r, 1000));
                  // Swap
                  setOpponentCards(prev => {
                      const newCards = [...prev];
                      newCards[cardIndex] = getRandomCard();
                      return newCards;
                  });
                  setOpponentSwapped(true);
              }

              await new Promise(r => setTimeout(r, 1000));
              finishTurn();

          } else {
              // User Logic
              await new Promise(r => setTimeout(r, 1000));
              setRevealedUserCards(prev => {
                  const newRev = [...prev];
                  newRev[cardIndex] = true;
                  return newRev;
              });

              if (!userSwapped) {
                  setShowSwapNotification(true);
                  // Wait for user interaction
              } else {
                  await new Promise(r => setTimeout(r, 1500));
                  finishTurn();
              }
          }
      };

      handleTurn();

  }, [round, turn, gameState]); // Dependencies need to be careful to not trigger loop

  const finishTurn = () => {
      if (currentRoundTurn === 0) {
          // First player finished, switch to second
          setCurrentRoundTurn(1);
          setTurn(startingPlayer === 'user' ? 'opponent' : 'user');
      } else {
          // Second player finished, next round
          if (round < 3) {
              setRound(r => r + 1);
              setCurrentRoundTurn(0);
              setTurn(startingPlayer);
          } else {
              endGame();
          }
      }
  };

  const handleUserKeep = () => {
      setShowSwapNotification(false);
      finishTurn();
  };

  const handleUserExchange = () => {
      const cardIndex = round - 1;
      setUserCards(prev => {
          const newCards = [...prev];
          newCards[cardIndex] = getRandomCard();
          return newCards;
      });
      setUserSwapped(true);
      setShowSwapNotification(false);
      finishTurn();
  };

  const endGame = () => {
      setGameState('finished');
      
      // Reveal swaps
      // "Reveal for each player whether their opponent swapped any card."
      // We can show a message or icon.
      
      setTimeout(() => {
          const userTotal = userCards.reduce((sum, card) => sum + card.points, 0);
          const opponentTotal = opponentCards.reduce((sum, card) => sum + card.points, 0);
          
          if (userTotal > opponentTotal) {
              setWinner('User');
              // Transition to Loot phase after a delay
              setTimeout(() => {
                  setGameState('loot');
              }, 3000);
          }
          else if (opponentTotal > userTotal) setWinner('Opponent');
          else setWinner('Draw');
          
          setBattleOver(true);
      }, 4000);
  };

  const dosCard = cards.find(c => c.name === 'dos') || cards[0];

  if (gameState === 'loot') {
      return <VictoryLoot opponentCards={opponentCards} onNavigate={onNavigate} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 overflow-hidden relative"
         style={{
            background: 'radial-gradient(ellipse at center, #2d2d2d 0%, #1a1a1a 35%, #000000 70%, #000000 100%)',
         }}>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20 flex gap-4">
        <button onClick={() => onNavigate('player')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
          ← Back
        </button>
        <button 
            onClick={() => {
                setGameState('finished');
                setWinner('User');
                setBattleOver(true);
                setTimeout(() => {
                    setGameState('loot');
                }, 3000);
            }}
            className="bg-red-900/20 hover:bg-red-900/50 text-white/20 hover:text-white px-2 py-1 rounded text-xs transition-all"
            title="Instant Win"
        >
            ee
        </button>
      </div>

      {gameState === 'waiting' && (
          <div className="flex items-center justify-center h-full">
              <h1 className="text-3xl font-bold animate-pulse">Finding Opponent...</h1>
          </div>
      )}

      {(gameState === 'playing' || gameState === 'finished') && (
          <div className="flex flex-col h-full justify-between py-10">
              
              {/* Opponent Area */}
              <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-4 text-red-400">Opponent {gameState === 'finished' && opponentSwapped && "(Swapped!)"}</h2>
                  <div className="flex gap-4">
                      {opponentCards.map((card, index) => (
                          <div key={index} className="relative w-32 h-44 transition-all duration-500">
                              <div className={`absolute inset-0 w-full h-full transition-transform duration-500 transform style={{ transformStyle: 'preserve-3d' }}`}>
                                  {/* Card Back (Visible if not revealed) */}
                                  {!revealedOpponentCards[index] && (
                                      <img src={dosCard.url} alt="Card Back" className="w-full h-full object-cover rounded-xl border-2 border-gray-600" />
                                  )}
                                  {/* Card Front (Visible if revealed) */}
                                  {revealedOpponentCards[index] && (
                                      <div className="w-full h-full bg-gray-800 rounded-xl border-2 border-red-500 flex flex-col items-center p-2">
                                          <img src={card.url} alt={card.name} className="w-full h-24 object-cover rounded-md mb-2" />
                                          <span className="font-bold text-sm">{card.label}</span>
                                          <span className="text-xs text-yellow-400">Pts: {card.points}</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Center Info */}
              <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold mb-2">Round {round > 3 ? 3 : round} / 3</div>
                  {showSwapNotification && (
                      <div className="bg-gray-800 p-6 rounded-xl border border-blue-500 shadow-2xl flex flex-col items-center gap-4 animate-bounce-in z-50">
                          <h3 className="text-lg font-bold">Swap Card?</h3>
                          <div className="flex gap-4">
                              <button onClick={handleUserKeep} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold">Keep</button>
                              <button onClick={handleUserExchange} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold">Exchange</button>
                          </div>
                      </div>
                  )}
                  {battleOver && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                          <div className="bg-gray-800 p-10 rounded-2xl border-4 border-yellow-500 text-center animate-scale-in">
                              <h1 className="text-6xl font-black text-yellow-500 mb-4">Battle Over!</h1>
                              <h2 className="text-4xl text-white">Winner: {winner}</h2>
                              <div className="mt-8 flex gap-8 justify-center">
                                  <div className="text-left">
                                      <p className="text-gray-400">You</p>
                                      <p className="text-3xl font-bold">{userCards.reduce((a, b) => a + b.points, 0)} pts</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-gray-400">Opponent</p>
                                      <p className="text-3xl font-bold">{opponentCards.reduce((a, b) => a + b.points, 0)} pts</p>
                                  </div>
                              </div>
                              {winner !== 'User' && (
                                <button onClick={() => onNavigate('player')} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                                    Back to Menu
                                </button>
                              )}
                              {winner === 'User' && (
                                  <p className="mt-8 text-yellow-400 animate-pulse">Preparing your loot...</p>
                              )}
                          </div>
                      </div>
                  )}
              </div>

              {/* User Area */}
              <div className="flex flex-col items-center">
                  <div className="flex gap-4">
                      {userCards.map((card, index) => (
                          <div key={index} className="relative w-32 h-44 transition-all duration-500">
                               {/* Card Back (Visible if not revealed) */}
                               {!revealedUserCards[index] && (
                                  <img src={dosCard.url} alt="Card Back" className="w-full h-full object-cover rounded-xl border-2 border-gray-600" />
                               )}
                               {/* Card Front (Visible if revealed) */}
                               {revealedUserCards[index] && (
                                  <div className="w-full h-full bg-gray-800 rounded-xl border-2 border-blue-500 flex flex-col items-center p-2">
                                      <img src={card.url} alt={card.name} className="w-full h-24 object-cover rounded-md mb-2" />
                                      <span className="font-bold text-sm">{card.label}</span>
                                      <span className="text-xs text-yellow-400">Pts: {card.points}</span>
                                  </div>
                               )}
                          </div>
                      ))}
                  </div>
                  <h2 className="text-xl font-bold mt-4 text-blue-400">You {gameState === 'finished' && userSwapped && "(Swapped!)"}</h2>
              </div>

          </div>
      )}
    </div>
  );
};

export default BattlePage;
