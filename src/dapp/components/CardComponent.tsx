import { SuiObjectResponse } from '@mysten/sui/client'
import { getResponseDisplayField } from '~~/helpers/network'

interface CardComponentProps {
    card: SuiObjectResponse
}

const CardComponent: React.FC<CardComponentProps> = ({ card }) => {
    const name = getResponseDisplayField(card, 'name') || 'Unknown Card name'
    const label = getResponseDisplayField(card, 'label') || 'Unknown Card label'
    const img = getResponseDisplayField(card, 'image_url')
    const description = getResponseDisplayField(card, 'description')
    const points = getResponseDisplayField(card, 'points')?.replace(/pts/i, '').trim()

    return (
        <div 
            className="min-w-[200px] h-[300px] rounded-xl overflow-hidden flex flex-col relative group transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
        >
            {/* Glow Effect on Hover */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                style={{
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.75rem'
                }}
            />

            {/* Image Section */}
            <div className="h-[180px] w-full relative z-10 overflow-hidden">
                {points && (
                    <div 
                        className="absolute top-2 left-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 backdrop-blur-sm"
                        style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        {points}
                    </div>
                )}
                {img ? (
                    <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-800">
                        No Image
                    </div>
                )}
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-grow justify-between relative z-10 bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a]">
                <div>
                    <h3 
                        className="font-black text-white text-lg truncate tracking-wide mb-1" 
                        title={name}
                        style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            fontFamily: '"Permanent Marker", cursive',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {label}
                    </h3>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-2 opacity-30" />
                    <p 
                        className="text-xs text-gray-300 line-clamp-3 leading-relaxed font-light" 
                        title={description || ''}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardComponent
