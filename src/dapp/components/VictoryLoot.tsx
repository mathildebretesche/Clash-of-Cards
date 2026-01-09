import React, { useState } from 'react';
import { Card } from '~~/types/Card';
import useGameActions from '../hooks/useGameActions';
import { cards } from '../../cards_data_file';

interface VictoryLootProps {
  opponentCards: Card[];
  onNavigate: (page: string) => void;
}

const VictoryLoot: React.FC<VictoryLootProps> = ({ opponentCards, onNavigate }) => {
  const { mintSpecificCard } = useGameActions();
  const [revealed, setRevealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const dosCard = cards.find(c => c.name === 'dos') || cards[0];

  const handleCardClick = (card: Card) => {
    if (revealed) return;

    setRevealed(true);
    setSelectedCard(card);

    // Trigger minting
    mintSpecificCard(
      card.name,
      card.url,
      card.label,
      card.points,
      () => {
        setShowNotification(true);
      }
    );
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen w-full relative overflow-hidden"
      style={{
        background: '#000000',
        border: '4px solid',
        borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        boxShadow: `
          inset 0 0 60px rgba(0,0,0,0.9),
          0 0 30px rgba(255,255,255,0.15)
        `
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(50,50,50,0.4)_0%,_rgba(0,0,0,0.8)_100%)]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
               }} 
          />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
          <h1 
            className="text-7xl font-black tracking-wider mb-2 text-center animate-in slide-in-from-top-10 duration-700"
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
            VICTORY
          </h1>
          
          <p 
            className="text-xl text-gray-400 mb-16 font-light tracking-[0.2em] uppercase animate-in fade-in duration-1000 delay-300"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            Select your reward
          </p>

          <div className="flex gap-16 perspective-1000">
            {opponentCards.map((card, index) => (
              <div 
                key={index} 
                className={`relative w-64 h-96 cursor-pointer transition-all duration-500 transform group ${!revealed ? 'hover:scale-110 hover:-translate-y-6 hover:rotate-1' : ''}`}
                onClick={() => handleCardClick(card)}
                style={{ perspective: '1000px' }}
              >
                <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out" style={{ transformStyle: 'preserve-3d', transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  {/* Card Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl relative">
                        <img 
                          src={dosCard.url} 
                          alt="Card Back" 
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-300" 
                        />
                        {/* Metallic Sheen Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Glow Border */}
                        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 w-full h-full bg-gradient-to-b from-gray-800 to-black rounded-2xl border-2 flex flex-col items-center p-1 shadow-2xl backface-hidden ${selectedCard === card ? 'border-yellow-400 ring-2 ring-yellow-400/50 shadow-[0_0_50px_rgba(255,215,0,0.2)]' : 'border-gray-700'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {/* Inner Frame */}
                    <div className="w-full h-full rounded-xl border border-white/5 bg-black/20 flex flex-col p-3 relative overflow-hidden">
                        {/* Background Gradient for Rarity */}
                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${card.type === 'legendary' ? 'from-yellow-600 to-purple-900' : 'from-blue-900 to-gray-900'}`} />
                        
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <img src={card.url} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <h3 
                            className="font-black text-white text-2xl truncate tracking-wide mb-1 w-full text-center relative z-10"
                            style={{ 
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                fontFamily: '"Permanent Marker", cursive',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {card.label}
                        </h3>
                        
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-3 opacity-30" />
                        
                        <div className="mt-auto flex justify-between items-end w-full px-2 relative z-10">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{card.type}</span>
                            <span className="text-yellow-400 font-black text-3xl drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>{card.points}</span>
                        </div>
                    </div>

                    {selectedCard === card && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="bg-yellow-500 text-black font-black text-xl px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-bounce border-2 border-white whitespace-nowrap">
                                CLAIMED!
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Notification Modal */}
      {showNotification && selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
          <div 
            className="relative p-1 rounded-3xl max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
            style={{
                background: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090)',
            }}
          >
            <div className="bg-black rounded-[22px] p-8 text-center relative overflow-hidden">
                {/* Close Button */}
                <button 
                  onClick={() => onNavigate('player')}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors hover:rotate-90 duration-300 z-20"
                >
                  <span className="font-bold text-2xl">×</span>
                </button>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <h3 
                        className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2 tracking-wide"
                        style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                        LOOT ACQUIRED
                    </h3>
                    
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-8" />
                    
                    <div className="relative w-32 h-32 mb-6 rounded-xl overflow-hidden border-2 border-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <img src={selectedCard.url} alt={selectedCard.name} className="w-full h-full object-cover" />
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                      You have added <span className="text-white font-bold">{selectedCard.label}</span> to your collection.
                    </p>
                    
                    <button 
                        onClick={() => onNavigate('player')}
                        className="relative px-12 py-4 rounded-full font-black text-lg text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
                        style={{
                          background: 'linear-gradient(145deg, #ffffff 0%, #c0c0c0 100%)',
                          boxShadow: '0 0 20px rgba(255,255,255,0.2)'
                        }}
                    >
                        <span className="relative z-10">CONTINUE</span>
                        <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VictoryLoot;
