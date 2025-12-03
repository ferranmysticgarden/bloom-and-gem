import { memo } from 'react';
import { X, ShoppingBag, Heart, Gem } from 'lucide-react';

interface ShopProps {
  lives: number;
  gems: number;
  totalScore: number;
  onClose: () => void;
  onPurchase: (item: string) => void;
}

const shopItems = [
  { id: 'gems-100', name: '100 Gemas', description: '💎 100 Gemas', price: '0,99 €', icon: '💎' },
  { id: 'gems-550', name: '550 Gemas', description: '💎 550 Gemas', price: '4,99 €', icon: '💎' },
  { id: 'gems-1200', name: '1200 Gemas', description: '💎 1200 Gemas', price: '9,99 €', icon: '💎' },
  { id: 'lives-1h', name: 'Vidas Ilimitadas (1h)', description: '❤️ Ilimitadas (1h)', price: '1,99 €', icon: '❤️' },
  { 
    id: 'starter-pack', 
    name: 'Paquete de Inicio (60% OFF)', 
    description: '💎 200 Gemas\n❤️ +5 Vidas\n🔨 +3 Power-ups', 
    price: '2,99 €', 
    icon: '🎁',
    isBundle: true
  },
  { id: 'monthly-pass', name: 'Pase de Jardín Mensual', description: '💎 50 Gemas/día', price: '9,99 €', icon: '🌟' },
];

export const Shop = memo(({ lives, gems, totalScore, onClose, onPurchase }: ShopProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Stats Bar - Top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <div className="flex items-center gap-2 bg-red-900/80 px-4 py-2 rounded-full border border-red-500/50">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span className="font-bold text-white">{lives}</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-900/80 px-4 py-2 rounded-full border border-purple-400/50">
          <span className="text-lg">💎</span>
          <span className="font-bold text-white">{gems}</span>
        </div>
        <div className="flex items-center gap-2 bg-green-900/80 px-4 py-2 rounded-full border border-green-500/50">
          <span className="text-lg">🌿</span>
          <span className="font-bold text-white">{totalScore}</span>
        </div>
      </div>

      <div 
        className="relative w-full max-w-2xl max-h-[80vh] overflow-auto rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(60, 20, 80, 0.98) 0%, rgba(40, 15, 60, 0.98) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 0 40px rgba(150, 50, 200, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
              }}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h2 
              className="font-cinzel text-2xl font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tienda
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 className="text-white font-bold mb-2">{item.name}</h3>
              <div className="text-white/60 text-sm mb-4 whitespace-pre-line">
                {item.description}
              </div>
              <button
                onClick={() => onPurchase(item.id)}
                className="w-full py-2 rounded-full font-semibold transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  color: '#1a1a2e',
                }}
              >
                Comprar - {item.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Shop.displayName = 'Shop';
