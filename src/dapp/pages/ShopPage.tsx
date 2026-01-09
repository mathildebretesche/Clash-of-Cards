import React, { useState } from 'react';
import useGameActions from '../hooks/useGameActions';
import { cards } from '../../cards_data_file';
import { Card } from '../../types/Card';
import { X } from 'lucide-react';

/**
 * ShopPage Component
 * 
 * This page displays the shop interface where players can purchase items.
 */
const ShopPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  console.log('ShopPage rendering');
  const { mintSpecificCard } = useGameActions();
  console.log('useGameActions loaded');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  if (!cards || cards.length === 0) {
    console.error('Cards data is missing or empty');
    return <div>Error: Cards data not loaded</div>;
  }

  const handleBuyBooster = () => {
    // Randomly select a card
    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards[randomIndex];

    // Trigger minting transaction
    mintSpecificCard(
      card.name,
      card.url,
      card.label,
      card.points,
      () => {
        // On success, show card and notification
        setSelectedCard(card);
        setShowNotification(true);
      }
    );
  };
  return (
    <div 
      className="flex flex-col h-screen text-white p-4"
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
      {/* Top Left Corner Image */}
      <div className="absolute -top-12 left-16 z-10 w-64">
        <img 
          src="https://media.discordapp.net/attachments/1220436814448427079/1442073432937463810/Untitled_Artwork.png?ex=69241b0a&is=6922c98a&hm=05a696baa50038efdbff9d6827ed8c3b0eb190778ab213841c2e6dfcc9d99665&=&format=webp&quality=lossless&width=420&height=504"
          alt="Corner decoration"
          className="w-full h-auto block"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(192, 192, 192, 0.6))'
          }}
        />
      </div>
      
      {/* Header */}
      <div className="flex justify-center items-center mb-8 mt-8 relative">
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
          market
        </h1>
        
        <button
          onClick={() => onNavigate('player')}
          className="absolute right-8 top-4 px-6 py-2 rounded-3xl font-black text-lg text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
          <span className="relative z-10">Back to Deck</span>
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
      </div>

      {/* Shop Content */}
      <div className="flex-grow flex items-start pt-32 justify-center">
        <div className="flex flex-row items-center gap-32 ml-32">
          <div className="relative group">
            <img 
              src="/shop_question_mark.jpg" 
              alt="Shop" 
              className="max-w-sm max-h-[300px] object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Semi-transparent silver overlay */}
            <div 
              className="absolute inset-0 -m-8 rounded-3xl overflow-hidden group transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(184,184,184,0.25) 15%, rgba(232,232,232,0.3) 30%, rgba(160,160,160,0.25) 45%, rgba(240,240,240,0.3) 60%, rgba(144,144,144,0.25) 75%, rgba(224,224,224,0.3) 90%, rgba(192,192,192,0.25) 100%)',
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.6),
                  0 10px 20px rgba(0,0,0,0.4),
                  inset 0 3px 8px rgba(255,255,255,0.5),
                  inset 0 -3px 8px rgba(0,0,0,0.3),
                  inset 3px 0 8px rgba(255,255,255,0.3),
                  inset -3px 0 8px rgba(0,0,0,0.2),
                  0 0 20px rgba(255,255,255,0.2)
                `,
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              {/* Hover reflection effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(208,208,208,0.3) 20%, rgba(255,255,255,0.4) 40%, rgba(176,176,176,0.3) 60%, rgba(255,255,255,0.4) 80%, rgba(200,200,200,0.3) 100%)',
                  boxShadow: `
                    0 25px 50px rgba(0,0,0,0.7),
                    inset 0 4px 12px rgba(255,255,255,0.6),
                    inset 0 -4px 12px rgba(0,0,0,0.4),
                    0 0 30px rgba(255,255,255,0.3)
                  `
                }}
              />
            </div>

            {/* Selected Card Overlay */}
            {selectedCard && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <img 
                  src={selectedCard.url} 
                  alt={selectedCard.name}
                  className="w-full h-full object-contain drop-shadow-2xl rounded-xl"
                />
                <div className="absolute -bottom-16 left-0 right-0 text-center bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-1">{selectedCard.label}</h3>
                  <div className="flex justify-center gap-4 text-sm text-gray-300">
                    <span className="capitalize">{selectedCard.type}</span>
                    <span className="text-yellow-400 font-bold">{selectedCard.points} PTS</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promotional text */}
          <div className="text-white text-center max-w-md">
            <h2 
              className="text-3xl font-black mb-4"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              }}
            >
              Try your luck
            </h2>
            <p className="text-xl text-gray-300 whitespace-nowrap">
              ✧ Crack a booster and uncover the unexpected! ✧
            </p>
            
            <button
              onClick={handleBuyBooster}
              className="mt-8 relative px-8 py-3 rounded-3xl font-black text-xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
              <span className="relative z-10">Buy Booster</span>
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
          </div>
        </div>
      </div>


      {/* Notification */}
      {showNotification && selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/90 border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md text-center pointer-events-auto relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setShowNotification(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-white font-bold">X</span>
            </button>
            <h3 className="text-2xl font-bold text-white mb-4">Congratulations!</h3>
            <p className="text-gray-300 text-lg">
              You have just obtained <span className="text-yellow-400 font-bold">{selectedCard.label}</span>, 
              which is a <span className="text-blue-400 font-bold">{selectedCard.type}</span> card.
              <br/>It is now in your wallet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
