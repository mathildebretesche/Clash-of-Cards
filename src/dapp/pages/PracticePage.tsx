import React, { useState } from 'react';
import PracticeGame from '../components/PracticeGame';
import useOwnCards from '../hooks/useOwnCards';

interface PracticePageProps {
  onNavigate: (page: string) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ onNavigate }) => {
  const { data: cards, isPending } = useOwnCards();
  const [difficulty, setDifficulty] = useState('Novice');
  const [style, setStyle] = useState('Balanced');
  const [gameStarted, setGameStarted] = useState(false);

  // Filter to get only game cards (excluding "dos" card back)
  const gameCards = React.useMemo(() => {
    if (!cards?.data) return [];
    return cards.data.filter((card: any) => {
      const gameField = card.data?.content?.fields?.game;
      const cardName = card.data?.content?.fields?.name;
      // Exclude dos card and only include game cards
      return gameField === "Game Card" && cardName !== "dos";
    });
  }, [cards]);

  if (gameStarted) {
    return (
      <PracticeGame 
        onNavigate={onNavigate} 
        difficulty={difficulty} 
        style={style} 
        onExit={() => setGameStarted(false)}
        playerDeck={gameCards}
      />
    );
  }

  const difficulties = ['Novice', 'Challenger', 'Pro', 'Legend'];
  const styles = ['Aggressive', 'Defensive', 'Balanced', 'Random'];

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-2xl">Loading your deck...</div>
      </div>
    );
  }

  if (gameCards.length === 0) {
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
          No Cards Found
        </h1>
        <p className="text-xl text-gray-400 mb-8">You need cards in your deck to practice!</p>
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
          PRACTICE ARENA
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
              inset 3px 0 8px rgba(255,255,255,0.5),
              inset -3px 0 8px rgba(0,0,0,0.3),
              0 0 20px rgba(255,255,255,0.3)
            `,
            textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.3)',
            transform: 'perspective(1000px) rotateX(2deg)'
          }}
        >
          <span className="relative z-10">Back to Menu</span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #d0d0d0 20%, #ffffff 40%, #b0b0b0 60%, #ffffff 80%, #c8c8c8 100%)',
            }}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-bold mb-4"
                  style={{
                    background: 'linear-gradient(to right, #00b4db, #0083b0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Train with Nimbus AI
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-2">
                    Affronte une IA et perfectionne ton style de jeu. Teste des combos, apprends sans risque, deviens un maître.
                </p>
                <p className="text-sm text-gray-500">
                    Your deck: {gameCards.length} cards
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                {/* Difficulty Selector */}
                <div className="space-y-4">
                    <label className="block text-blue-300 font-bold text-xl uppercase tracking-wider text-center">Difficulty</label>
                    <div className="grid grid-cols-2 gap-4">
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`p-4 rounded-xl border transition-all duration-300 font-bold ${
                                    difficulty === diff 
                                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105' 
                                    : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/30'
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Style Selector */}
                <div className="space-y-4">
                    <label className="block text-purple-300 font-bold text-xl uppercase tracking-wider text-center">AI Style</label>
                    <div className="grid grid-cols-2 gap-4">
                        {styles.map(s => (
                            <button
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`p-4 rounded-xl border transition-all duration-300 font-bold ${
                                    style === s 
                                    ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.5)] scale-105' 
                                    : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/30'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={() => setGameStarted(true)}
                    className="group relative px-12 py-5 rounded-full font-black text-2xl tracking-wider shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, #ffffff 0%, #b8b8b8 15%, #e8e8e8 30%, #a0a0a0 45%, #f0f0f0 60%, #909090 75%, #e0e0e0 90%, #c0c0c0 100%)',
                      color: '#000',
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
                    <span className="relative z-10">START MATCH</span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
