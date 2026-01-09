import React from 'react';
import useOwnCards from '~~/dapp/hooks/useOwnCards';
import CardComponent from '~~/dapp/components/CardComponent';


/**
 * PlayerInterface Component
 * 
 * This page serves as the main interface for the player.
 * It provides options to find other players or practice alone.
 * It also displays the player's deck of objects.
 */
const PlayerInterface: React.FC<{ onNavigate: (page: string, data?: any) => void }> = ({ onNavigate }) => {
  const { data: cards, isPending, error } = useOwnCards();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter cards to only show "Card Game" cards
  const gameCards = React.useMemo(() => {
    if (!cards?.data) return [];
    return cards.data.filter((card: any) => {
      const gameField = card.data?.content?.fields?.game;
      return gameField === "Game Card";
    });
  }, [cards]);

  // Placeholder function for navigation
  const handleNavigation = (destination: string) => {
    console.log(`Navigating to: ${destination}`);
    if (destination === '/find-players') {
      console.log('Going to combat page');
      onNavigate('combat');
    } else if (destination === '/shop') {
      console.log('Going to shop page');
      onNavigate('shop');
    } else if (destination === '/pvp') {
      console.log('Going to PvP challenge page');
      onNavigate('pvp');
    } else {
      console.log('Unknown destination:', destination);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="flex flex-col h-screen text-white p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(-45deg, #050505, #1a1a1a, #2d2d2d, #000000)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        border: '4px solid',
        borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        boxShadow: `
          inset 0 0 60px rgba(0,0,0,0.9),
          0 0 30px rgba(255,255,255,0.15)
        `
      }}
    >
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      {/* Animated Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
           }} 
      />
      <div className="absolute top-6 left-6 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase opacity-80">
        clash of cards
      </div>

      {/* Top Section: Deck of Objects (Carousel) */}
      <div 
        className="w-full pt-4 pb-4 relative flex flex-col items-center justify-center flex-grow"
      >
        <h2 
          className="text-4xl font-black tracking-wider mb-8 text-center"
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
          YOUR DECK
          <span
            className="ml-6 text-3xl px-6 py-1 rounded-2xl inline-flex items-center justify-center backdrop-blur-md align-middle"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              WebkitTextFillColor: '#ffffff',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              fontFamily: 'sans-serif'
            }}
          >
            {gameCards.length}
          </span>
        </h2>

        <div className="relative w-full max-w-6xl flex items-center">
            {/* Left Arrow */}
            <button 
                onClick={scrollLeft}
                className="absolute left-0 z-10 p-3 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all border border-gray-600 text-white hover:scale-110"
            >
                ←
            </button>

            {/* Horizontal Deck Container */}
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-6 px-12 pb-4 justify-start items-center w-full scrollbar-hide"
                style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
            >

            {isPending && (
                <div className="flex items-center justify-center text-gray-400 w-full">
                Loading cards...
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center text-red-400 w-full">
                Error loading cards
                </div>
            )}

            {!isPending && !error && gameCards.length === 0 && (
                <div className="flex items-center justify-center text-gray-500 italic w-full">
                Oh no! You don't have any cards!
                </div>
            )}

            {gameCards.map((card: any) => (
                <div key={card.data?.objectId} className="flex-shrink-0 scroll-snap-align-center transform hover:scale-105 transition-transform duration-300">
                    <CardComponent card={card} />
                </div>
            ))}

            {/* Empty Slot Placeholder */}
            <div className="min-w-[180px] h-[270px] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center opacity-50 flex-shrink-0 scroll-snap-align-center">
                <span className="text-gray-500 text-sm text-center px-2">Empty Slot</span>
            </div>

            </div>

            {/* Right Arrow */}
            <button 
                onClick={scrollRight}
                className="absolute right-0 z-10 p-3 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-100 transition-all border border-gray-600 text-white hover:scale-110"
            >
                →
            </button>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div 
        className="w-full py-8 flex flex-col items-center gap-8"
        style={{
            borderTop: '3px solid',
            borderImage: 'linear-gradient(90deg, #909090, #ffffff, #c0c0c0, #f0f0f0, #a0a0a0, #e8e8e8, #b0b0b0, #909090) 1',
            boxShadow: '0 -2px 15px rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.3)'
        }}
      >
        <div className="flex flex-row flex-wrap items-center justify-center gap-8">
          <button
            onClick={() => handleNavigation('/pvp')}
            className="relative w-80 py-5 px-10 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
            <span className="relative z-10">Find your opponent</span>
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

          <button
            onClick={() => handleNavigation('/find-players')}
            className="relative w-80 py-5 px-10 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
            <span className="relative z-10">Play against a BOT</span>
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

          <button
            onClick={() => handleNavigation('/shop')}
            className="relative w-80 py-5 px-10 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
            <span className="relative z-10">Market</span>
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
  );
};

export default PlayerInterface;
