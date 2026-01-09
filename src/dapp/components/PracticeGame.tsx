import React, { useEffect, useState } from 'react';
import { cards } from '../../cards_data_file';
import { Card } from '../../types/Card';
import VictoryLoot from './VictoryLoot';
import { NimbusService } from '../services/NimbusService';

interface PracticeGameProps {
  onNavigate: (page: string) => void;
  difficulty: string;
  style: string;
  onExit: () => void;
  playerDeck: any[];
}

type GameState = 'waiting' | 'playing' | 'finished' | 'loot';
type Turn = 'user' | 'ai';

const PracticeGame: React.FC<PracticeGameProps> = ({ onNavigate, difficulty, style, onExit, playerDeck }) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [round, setRound] = useState(0);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [aiCards, setAiCards] = useState<Card[]>([]);
  const [revealedUserCards, setRevealedUserCards] = useState<boolean[]>([false, false, false]);
  const [revealedAiCards, setRevealedAiCards] = useState<boolean[]>([false, false, false]);
  const [turn, setTurn] = useState<Turn>('user');
  const [startingPlayer, setStartingPlayer] = useState<Turn>('user');
  const [userSwapped, setUserSwapped] = useState(false);
  const [aiSwapped, setAiSwapped] = useState(false);
  const [showSwapNotification, setShowSwapNotification] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [battleOver, setBattleOver] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [lastAiExplanation, setLastAiExplanation] = useState<string>('');

  // Helper to get random cards from AI deck (excluding dos card back)
  const getRandomCards = (count: number) => {
    const playableCards = cards.filter(c => !c.excludeFromBoosters);
    const shuffled = [...playableCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomCard = () => {
    const playableCards = cards.filter(c => !c.excludeFromBoosters);
    const randomIndex = Math.floor(Math.random() * playableCards.length);
    return playableCards[randomIndex];
  };

  // Convert player deck to Card format
  const convertPlayerDeck = (deck: any[]): Card[] => {
    return deck.slice(0, 3).map((cardData: any) => {
      const fields = cardData.data?.content?.fields;
      return {
        name: fields?.name || 'unknown',
        label: fields?.name || 'Unknown Card',
        url: fields?.image_url || '',
        points: fields?.points || '0',
        type: fields?.type || 'common'
      };
    });
  };

  // Initial Setup
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('playing');
      setUserCards(convertPlayerDeck(playerDeck));
      setAiCards(getRandomCards(3));
      const firstPlayer = Math.random() > 0.5 ? 'user' : 'ai';
      setStartingPlayer(firstPlayer);
      setTurn(firstPlayer);
      setRound(1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [playerDeck]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (round > 3) {
      endGame();
      return;
    }

    const currentCardIndex = round - 1;

    if (turn === 'ai') {
      // AI Turn
      const timer = setTimeout(async () => {
        // Reveal AI card
        setRevealedAiCards(prev => {
          const newRevealed = [...prev];
          newRevealed[currentCardIndex] = true;
          return newRevealed;
        });

        // AI decision via Nimbus
        if (!aiSwapped) {
          setAiThinking(true);
          try {
            const gameStateForAI = {
              turn: round,
              player_hp: 0,
              ai_hp: 0,
              player_hand: userCards,
              ai_hand: aiCards,
              player_board: [],
              ai_board: [],
              mana_player: 0,
              mana_ai: 0,
              history: []
            };
            
            const aiAction = await NimbusService.getAgentAction(gameStateForAI, difficulty, style);
            setLastAiExplanation(aiAction.explanation || '');
            
            // AI decides to swap based on confidence or action type
            if (aiAction.action_type === 'play_card' || (aiAction.confidence && aiAction.confidence < 0.5)) {
              setTimeout(() => {
                setAiCards(prev => {
                  const newCards = [...prev];
                  newCards[currentCardIndex] = getRandomCard();
                  return newCards;
                });
                setAiSwapped(true);
              }, 1500);
            }
          } catch (error) {
            console.error('AI decision error:', error);
          } finally {
            setAiThinking(false);
          }
        }

        // Pass turn to user
        setTimeout(() => {
          setTurn('user');
        }, aiSwapped ? 3000 : 2000);

      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // User Turn
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
            // If already swapped, proceed to next round
            setTimeout(() => {
              nextRound();
            }, 2000);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, round, turn, aiSwapped, userSwapped]);

  const nextRound = () => {
    setShowSwapNotification(false);
    setRound(prev => prev + 1);
    setTurn(startingPlayer);
  };

  const handleUserKeep = () => {
    setShowSwapNotification(false);
    setUserSwapped(true);
    setTimeout(() => {
      nextRound();
    }, 1000);
  };

  const handleUserExchange = () => {
    const currentCardIndex = round - 1;
    setUserCards(prev => {
      const newCards = [...prev];
      newCards[currentCardIndex] = getRandomCard();
      return newCards;
    });
    setUserSwapped(true);
    setShowSwapNotification(false);
    setTimeout(() => {
      nextRound();
    }, 1500);
  };

  const endGame = () => {
    const userTotal = userCards.reduce((sum, card) => sum + card.points, 0);
    const aiTotal = aiCards.reduce((sum, card) => sum + card.points, 0);
    
    if (userTotal > aiTotal) {
      setWinner('You');
    } else if (aiTotal > userTotal) {
      setWinner('Nimbus AI');
    } else {
      setWinner('Draw');
    }
    
    setGameState('finished');
    setBattleOver(true);

    // If user wins, transition to loot
    if (userTotal > aiTotal) {
      setTimeout(() => {
        setGameState('loot');
      }, 4000);
    }
  };

  const dosCard = cards.find(c => c.name === 'dos') || cards[0];

  if (gameState === 'loot') {
    return <VictoryLoot opponentCards={aiCards} onNavigate={onNavigate} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 overflow-hidden relative"
         style={{
            background: 'radial-gradient(ellipse at center, #2d2d2d 0%, #1a1a1a 35%, #000000 70%, #000000 100%)',
         }}>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => onNavigate('player')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
          ← Back
        </button>
      </div>

      {gameState === 'waiting' && (
          <div className="flex items-center justify-center h-full">
              <h1 className="text-3xl font-bold animate-pulse">Preparing Training Match...</h1>
          </div>
      )}

      {(gameState === 'playing' || gameState === 'finished') && (
          <div className="flex flex-col h-full justify-between py-10">
              
              {/* AI Area */}
              <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-4 text-red-400">
                    Nimbus AI ({difficulty}) {gameState === 'finished' && aiSwapped && "(Swapped!)"}
                  </h2>
                  <div className="flex gap-4">
                      {aiCards.map((card, index) => (
                          <div key={index} className="relative w-32 h-44 transition-all duration-500">
                              <div className="absolute inset-0 w-full h-full transition-transform duration-500 transform" style={{ transformStyle: 'preserve-3d' }}>
                                  {/* Card Back */}
                                  {!revealedAiCards[index] && (
                                      <img src={dosCard.url} alt="Card Back" className="w-full h-full object-cover rounded-xl border-2 border-gray-600" />
                                  )}
                                  {/* Card Front */}
                                  {revealedAiCards[index] && (
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
                  {aiThinking && (
                    <div className="mt-4 text-sm text-yellow-400 animate-pulse">
                      AI is thinking...
                    </div>
                  )}
                  {lastAiExplanation && !aiThinking && (
                    <div className="mt-4 text-sm text-gray-400 italic max-w-md text-center">
                      "{lastAiExplanation}"
                    </div>
                  )}
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
                                      <p className="text-gray-400">Nimbus AI</p>
                                      <p className="text-3xl font-bold">{aiCards.reduce((a, b) => a + b.points, 0)} pts</p>
                                  </div>
                              </div>
                              {winner !== 'You' && (
                                <button onClick={() => onNavigate('player')} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                                    Back to Menu
                                </button>
                              )}
                              {winner === 'You' && (
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
                               {/* Card Back */}
                               {!revealedUserCards[index] && (
                                  <img src={dosCard.url} alt="Card Back" className="w-full h-full object-cover rounded-xl border-2 border-gray-600" />
                               )}
                               {/* Card Front */}
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

export default PracticeGame;
