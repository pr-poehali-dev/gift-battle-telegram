import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Gift {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'exotic' | 'divine';
  value: number;
  icon: string;
}

interface Case {
  id: string;
  name: string;
  price: number;
  category: 'normal' | 'seasonal';
  icon: string;
  description: string;
  giftPool: { gift: Gift; chance: number }[];
}

interface RecentDrop {
  id: string;
  playerName: string;
  gift: Gift;
  timestamp: Date;
}

const RARITY_COLORS = {
  common: 'text-rarity-common',
  uncommon: 'text-rarity-uncommon',
  rare: 'text-rarity-rare',
  epic: 'text-rarity-epic',
  legendary: 'text-rarity-legendary',
  mythic: 'text-rarity-mythic',
  exotic: 'text-rarity-exotic',
  divine: 'text-rarity-divine'
};

const RARITY_BG = {
  common: 'bg-rarity-common/20 border-rarity-common',
  uncommon: 'bg-rarity-uncommon/20 border-rarity-uncommon',
  rare: 'bg-rarity-rare/20 border-rarity-rare',
  epic: 'bg-rarity-epic/20 border-rarity-epic',
  legendary: 'bg-rarity-legendary/20 border-rarity-legendary',
  mythic: 'bg-rarity-mythic/20 border-rarity-mythic',
  exotic: 'bg-rarity-exotic/20 border-rarity-exotic',
  divine: 'bg-rarity-divine/20 border-rarity-divine'
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'exotic', 'divine'];

const ALL_GIFTS: Gift[] = [
  { id: '1', name: 'Простой подарок', rarity: 'common', value: 5, icon: '🎁' },
  { id: '2', name: 'Коробка конфет', rarity: 'common', value: 8, icon: '🍬' },
  { id: '3', name: 'Открытка', rarity: 'common', value: 10, icon: '💌' },
  { id: '4', name: 'Цветок', rarity: 'uncommon', value: 25, icon: '🌹' },
  { id: '5', name: 'Букет', rarity: 'uncommon', value: 30, icon: '💐' },
  { id: '6', name: 'Свеча', rarity: 'uncommon', value: 35, icon: '🕯️' },
  { id: '7', name: 'Шоколад', rarity: 'rare', value: 50, icon: '🍫' },
  { id: '8', name: 'Торт', rarity: 'rare', value: 60, icon: '🎂' },
  { id: '9', name: 'Духи', rarity: 'rare', value: 70, icon: '🌸' },
  { id: '10', name: 'Плюшевый мишка', rarity: 'epic', value: 150, icon: '🧸' },
  { id: '11', name: 'Золотое кольцо', rarity: 'epic', value: 180, icon: '💍' },
  { id: '12', name: 'Часы', rarity: 'epic', value: 200, icon: '⌚' },
  { id: '13', name: 'Золотая звезда', rarity: 'legendary', value: 500, icon: '⭐' },
  { id: '14', name: 'Золотая медаль', rarity: 'legendary', value: 550, icon: '🥇' },
  { id: '15', name: 'Трофей', rarity: 'legendary', value: 600, icon: '🏆' },
  { id: '16', name: 'Бриллиант', rarity: 'mythic', value: 1500, icon: '💎' },
  { id: '17', name: 'Сапфир', rarity: 'mythic', value: 1600, icon: '💠' },
  { id: '18', name: 'Изумруд', rarity: 'mythic', value: 1700, icon: '🔷' },
  { id: '19', name: 'Феникс', rarity: 'exotic', value: 5000, icon: '🔥' },
  { id: '20', name: 'Единорог', rarity: 'exotic', value: 5500, icon: '🦄' },
  { id: '21', name: 'Дракон', rarity: 'exotic', value: 6000, icon: '🐉' },
  { id: '22', name: 'Корона богов', rarity: 'divine', value: 15000, icon: '👑' },
  { id: '23', name: 'Святой грааль', rarity: 'divine', value: 18000, icon: '🏺' },
  { id: '24', name: 'Божественный свет', rarity: 'divine', value: 20000, icon: '✨' }
];

const generateCasePool = (casePrice: number): { gift: Gift; chance: number }[] => {
  const pool: { gift: Gift; chance: number }[] = [];
  const priceRatio = casePrice / 10000;
  
  ALL_GIFTS.forEach(gift => {
    const valueRatio = gift.value / casePrice;
    let chance = 0;
    
    if (valueRatio < 1) {
      chance = 50;
    } else if (valueRatio < 2) {
      chance = 25;
    } else if (valueRatio < 5) {
      chance = 10;
    } else if (valueRatio < 10) {
      chance = 3;
    } else if (valueRatio < 50) {
      chance = 0.5;
    } else if (valueRatio < 100) {
      chance = 0.1;
    } else {
      chance = 0.02;
    }
    
    if (chance > 0) {
      pool.push({ gift, chance });
    }
  });
  
  const totalChance = pool.reduce((sum, item) => sum + item.chance, 0);
  return pool.map(item => ({ ...item, chance: (item.chance / totalChance) * 100 }));
};

const CASES: Case[] = [
  { id: '1', name: 'Бедолага', price: 10, category: 'normal', icon: '😢', description: 'Простой кейс для начинающих', giftPool: generateCasePool(10) },
  { id: '2', name: 'Бомж', price: 50, category: 'normal', icon: '🎒', description: 'Может повезти!', giftPool: generateCasePool(50) },
  { id: '3', name: 'Студент', price: 100, category: 'normal', icon: '📚', description: 'Средние шансы', giftPool: generateCasePool(100) },
  { id: '4', name: 'Работяга', price: 200, category: 'normal', icon: '⚒️', description: 'Стабильный выбор', giftPool: generateCasePool(200) },
  { id: '5', name: 'Уборщик', price: 228, category: 'normal', icon: '🧹', description: 'Чистая удача', giftPool: generateCasePool(228) },
  { id: '6', name: 'Менеджер', price: 300, category: 'normal', icon: '💼', description: 'Деловой подход', giftPool: generateCasePool(300) },
  { id: '7', name: 'Директор', price: 450, category: 'normal', icon: '👔', description: 'Повышенные шансы', giftPool: generateCasePool(450) },
  { id: '8', name: 'Предприниматель', price: 525, category: 'normal', icon: '📈', description: 'Рискованно но выгодно', giftPool: generateCasePool(525) },
  { id: '9', name: 'Миллионер', price: 666, category: 'normal', icon: '💰', description: 'Дьявольски хорош', giftPool: generateCasePool(666) },
  { id: '10', name: 'Олигарх', price: 800, category: 'normal', icon: '🏰', description: 'Элитный выбор', giftPool: generateCasePool(800) },
  { id: '11', name: 'Мажор', price: 1000, category: 'normal', icon: '🎩', description: 'Только лучшее', giftPool: generateCasePool(1000) },
  { id: '12', name: 'Президент', price: 1500, category: 'normal', icon: '👑', description: 'Власть и богатство', giftPool: generateCasePool(1500) },
  { id: '13', name: 'Ранняя осень', price: 350, category: 'seasonal', icon: '🍂', description: 'Осенняя коллекция', giftPool: generateCasePool(350) },
  { id: '14', name: 'Дождливая осень', price: 420, category: 'seasonal', icon: '🌧️', description: 'Редкие предметы', giftPool: generateCasePool(420) },
  { id: '15', name: 'Золотая осень', price: 777, category: 'seasonal', icon: '🍁', description: 'Золотой сезон', giftPool: generateCasePool(777) },
  { id: '16', name: 'Поздняя осень', price: 555, category: 'seasonal', icon: '🌰', description: 'Последний шанс', giftPool: generateCasePool(555) },
  { id: '17', name: 'Зимняя сказка', price: 888, category: 'seasonal', icon: '❄️', description: 'Морозные сюрпризы', giftPool: generateCasePool(888) },
  { id: '18', name: 'Новогодний', price: 999, category: 'seasonal', icon: '🎄', description: 'Праздничный кейс', giftPool: generateCasePool(999) },
  { id: '19', name: 'Весенний', price: 444, category: 'seasonal', icon: '🌸', description: 'Цветущие возможности', giftPool: generateCasePool(444) },
  { id: '20', name: 'Летний', price: 600, category: 'seasonal', icon: '☀️', description: 'Жаркие призы', giftPool: generateCasePool(600) },
  { id: '21', name: 'Космический', price: 1200, category: 'normal', icon: '🚀', description: 'В бесконечность!', giftPool: generateCasePool(1200) },
  { id: '22', name: 'Магический', price: 1337, category: 'normal', icon: '🔮', description: 'Волшебство реально', giftPool: generateCasePool(1337) },
  { id: '23', name: 'Драконий', price: 1666, category: 'normal', icon: '🐉', description: 'Легендарная сила', giftPool: generateCasePool(1666) },
  { id: '24', name: 'Царский', price: 2000, category: 'normal', icon: '💎', description: 'Царские сокровища', giftPool: generateCasePool(2000) },
  { id: '25', name: 'Божественный', price: 2500, category: 'normal', icon: '✨', description: 'Дар богов', giftPool: generateCasePool(2500) },
  { id: '26', name: 'Адский', price: 3000, category: 'normal', icon: '🔥', description: 'Адская удача', giftPool: generateCasePool(3000) },
  { id: '27', name: 'Небесный', price: 3500, category: 'normal', icon: '☁️', description: 'Облачные высоты', giftPool: generateCasePool(3500) },
  { id: '28', name: 'Титановый', price: 4000, category: 'normal', icon: '🛡️', description: 'Несгибаемый', giftPool: generateCasePool(4000) },
  { id: '29', name: 'Платиновый', price: 5000, category: 'normal', icon: '🏆', description: 'Для победителей', giftPool: generateCasePool(5000) },
  { id: '30', name: 'Безлимитный', price: 7500, category: 'normal', icon: '♾️', description: 'Без границ', giftPool: generateCasePool(7500) },
  { id: '31', name: 'Ультра', price: 10000, category: 'normal', icon: '⚡', description: 'Максимальная мощь', giftPool: generateCasePool(10000) }
];

const getRandomGiftFromCase = (caseItem: Case): Gift => {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const item of caseItem.giftPool) {
    cumulative += item.chance;
    if (random <= cumulative) {
      return item.gift;
    }
  }
  
  return caseItem.giftPool[0].gift;
};

const CaseOpeningRoulette = ({ onComplete, targetGift, casePool }: { onComplete: () => void; targetGift: Gift; casePool: { gift: Gift; chance: number }[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const weights = casePool.map(item => item.chance);
    const rouletteGifts: Gift[] = [];
    
    for (let i = 0; i < 50; i++) {
      const random = Math.random() * 100;
      let cumulative = 0;
      for (let j = 0; j < casePool.length; j++) {
        cumulative += weights[j];
        if (random <= cumulative) {
          rouletteGifts.push(casePool[j].gift);
          break;
        }
      }
    }
    
    const targetIndex = Math.floor(rouletteGifts.length * 0.8);
    rouletteGifts[targetIndex] = targetGift;
    
    const finalPosition = -(targetIndex * 160 - window.innerWidth / 2 + 80);

    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      setScrollPosition(finalPosition * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    animate();
  }, [targetGift, casePool, onComplete]);

  const rouletteGifts: Gift[] = [];
  const weights = casePool.map(item => item.chance);
  
  for (let i = 0; i < 50; i++) {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let j = 0; j < casePool.length; j++) {
      cumulative += weights[j];
      if (random <= cumulative) {
        rouletteGifts.push(casePool[j].gift);
        break;
      }
    }
  }

  return (
    <div className="relative w-full h-56 bg-card/50 rounded-lg overflow-hidden border-2 border-primary/50">
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent z-10 shadow-glow-gold" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-20">
        <div className="relative animate-pulse">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-2xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/30 rounded-full blur-xl" />
        </div>
      </div>
      
      <div
        ref={scrollRef}
        className="flex items-center h-full gap-4 px-4"
        style={{ transform: `translateX(${scrollPosition}px)`, transition: 'none' }}
      >
        {rouletteGifts.map((gift, index) => (
          <div
            key={`roulette-${index}`}
            className={`flex-shrink-0 w-36 h-36 ${RARITY_BG[gift.rarity]} rounded-lg border-2 flex flex-col items-center justify-center transition-all`}
          >
            <span className="text-6xl mb-2">{gift.icon}</span>
            <p className={`text-xs font-semibold ${RARITY_COLORS[gift.rarity]} text-center px-2`}>
              {gift.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const UpgradeWheel = ({ onResult, successChance }: { onResult: (success: boolean) => void; successChance: number }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const success = Math.random() * 100 < successChance;
    const successZoneStart = 0;
    const successZoneSize = (successChance / 100) * 360;
    
    let targetAngle;
    if (success) {
      targetAngle = successZoneStart + Math.random() * successZoneSize;
    } else {
      targetAngle = successZoneStart + successZoneSize + Math.random() * (360 - successZoneSize);
    }
    
    const spins = 5;
    const finalRotation = spins * 360 + targetAngle;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      onResult(success);
    }, 3000);
  };

  useEffect(() => {
    startSpin();
  }, []);

  const successZoneSize = (successChance / 100) * 360;

  return (
    <div className="relative w-80 h-80 mx-auto">
      <div className="absolute inset-0 rounded-full border-4 border-primary/30 overflow-hidden">
        <svg className="w-full h-full" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' }}>
          <circle cx="160" cy="160" r="160" fill="hsl(var(--destructive))" opacity="0.3" />
          <path
            d={`M 160 160 L 160 0 A 160 160 0 ${successZoneSize > 180 ? 1 : 0} 1 ${160 + 160 * Math.sin((successZoneSize * Math.PI) / 180)} ${160 - 160 * Math.cos((successZoneSize * Math.PI) / 180)} Z`}
            fill="hsl(var(--rarity-legendary))"
            opacity="0.5"
          />
        </svg>
      </div>
      
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-4 z-10">
        <div className="relative">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-primary drop-shadow-2xl animate-pulse" />
          <div className="absolute inset-0 blur-lg bg-primary/50" />
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center bg-card/90 backdrop-blur rounded-full w-32 h-32 flex items-center justify-center border-4 border-primary shadow-glow-gold">
          <div>
            <Icon name="Zap" size={32} className="mx-auto text-primary mb-1" />
            <p className="text-xl font-bold text-primary">{successChance}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [stars, setStars] = useState(3000);
  const [inventory, setInventory] = useState<Gift[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showCaseInfo, setShowCaseInfo] = useState<Case | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [wonGift, setWonGift] = useState<Gift | null>(null);
  const [openedGift, setOpenedGift] = useState<Gift | null>(null);
  const [recentDrops] = useState<RecentDrop[]>([
    { id: '1', playerName: 'Player123', gift: ALL_GIFTS[21], timestamp: new Date(Date.now() - 30000) },
    { id: '2', playerName: 'LuckyOne', gift: ALL_GIFTS[15], timestamp: new Date(Date.now() - 60000) },
    { id: '3', playerName: 'GiftHunter', gift: ALL_GIFTS[12], timestamp: new Date(Date.now() - 120000) }
  ]);
  const [activeTab, setActiveTab] = useState('cases');
  
  const [selectedGiftForUpgrade, setSelectedGiftForUpgrade] = useState<Gift | null>(null);
  const [targetGiftForUpgrade, setTargetGiftForUpgrade] = useState<Gift | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<{ success: boolean; newGift?: Gift } | null>(null);

  const openCase = (caseItem: Case) => {
    if (stars < caseItem.price) return;
    
    setIsOpening(true);
    setShowRoulette(true);
    setStars(stars - caseItem.price);
    
    const randomGift = getRandomGiftFromCase(caseItem);
    setWonGift(randomGift);
  };

  const handleRouletteComplete = () => {
    setShowRoulette(false);
    setIsOpening(false);
    if (wonGift) {
      setOpenedGift(wonGift);
      setInventory([...inventory, wonGift]);
    }
    setSelectedCase(null);
  };

  const calculateUpgradeChance = (fromGift: Gift, toGift: Gift): number => {
    const ratio = toGift.value / fromGift.value;
    
    let baseChance = 75;
    
    if (ratio < 1.5) {
      baseChance = 75;
    } else if (ratio < 2) {
      baseChance = 60;
    } else if (ratio < 3) {
      baseChance = 45;
    } else if (ratio < 5) {
      baseChance = 30;
    } else if (ratio < 10) {
      baseChance = 15;
    } else if (ratio < 50) {
      baseChance = 5;
    } else {
      baseChance = 1;
    }
    
    return Math.min(75, Math.max(1, baseChance));
  };

  const startUpgrade = () => {
    if (!selectedGiftForUpgrade || !targetGiftForUpgrade) return;
    setIsUpgrading(true);
  };

  const handleUpgradeResult = (success: boolean) => {
    if (!selectedGiftForUpgrade || !targetGiftForUpgrade) return;

    setTimeout(() => {
      const giftIndex = inventory.findIndex((g, idx) => 
        g.id === selectedGiftForUpgrade.id && 
        g.rarity === selectedGiftForUpgrade.rarity && 
        idx === inventory.indexOf(selectedGiftForUpgrade)
      );
      const newInventory = [...inventory];
      newInventory.splice(giftIndex, 1);
      
      if (success) {
        newInventory.push(targetGiftForUpgrade);
        setUpgradeResult({ success: true, newGift: targetGiftForUpgrade });
      } else {
        setUpgradeResult({ success: false });
      }
      
      setInventory(newInventory);
      setIsUpgrading(false);
    }, 3200);
  };

  const getAvailableUpgradeTargets = (sourceGift: Gift): Gift[] => {
    return ALL_GIFTS.filter(g => g.value > sourceGift.value);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        <aside className="w-80 border-r border-border bg-card/50 backdrop-blur p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Activity" className="text-accent" size={24} />
              Последние выпадения
            </h2>
            <div className="space-y-3">
              {recentDrops.map((drop) => (
                <div
                  key={drop.id}
                  className={`p-3 rounded-lg border ${RARITY_BG[drop.gift.rarity]} backdrop-blur animate-slide-up`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{drop.gift.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{drop.playerName}</p>
                      <p className={`text-xs ${RARITY_COLORS[drop.gift.rarity]} font-medium`}>
                        {drop.gift.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {drop.gift.value} ⭐
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Битва Подарков
                </h1>
                <p className="text-muted-foreground mt-1">Открывай кейсы и собирай коллекцию</p>
              </div>
              <div className="flex items-center gap-6">
                <Card className="px-6 py-3 bg-gradient-to-r from-primary/20 to-accent/20 border-primary shadow-glow-gold">
                  <div className="flex items-center gap-2">
                    <Icon name="Star" className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-muted-foreground">Звездочки</p>
                      <p className="text-2xl font-bold text-primary">{stars}</p>
                    </div>
                  </div>
                </Card>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setActiveTab('profile')}
                  className="gap-2"
                >
                  <Icon name="User" size={20} />
                  Профиль
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="cases">Кейсы</TabsTrigger>
                <TabsTrigger value="upgrade">Апгрейд</TabsTrigger>
                <TabsTrigger value="profile">Профиль</TabsTrigger>
              </TabsList>

              <TabsContent value="cases" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Package" className="text-primary" size={28} />
                    Обычные кейсы
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {CASES.filter(c => c.category === 'normal').map((caseItem) => (
                      <Card
                        key={caseItem.id}
                        className="group relative overflow-hidden hover:shadow-glow-gold transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-card to-card/50"
                      >
                        <div className="p-6" onClick={() => setSelectedCase(caseItem)}>
                          <div className="text-6xl mb-4 animate-float">{caseItem.icon}</div>
                          <h3 className="font-bold text-lg mb-2">{caseItem.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{caseItem.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-primary-foreground shadow-glow-gold">
                              <Icon name="Star" size={14} className="mr-1" />
                              {caseItem.price}
                            </Badge>
                            <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCaseInfo(caseItem);
                          }}
                        >
                          <Icon name="Info" size={16} />
                        </Button>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Sparkles" className="text-secondary" size={28} />
                    Сезонные кейсы
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {CASES.filter(c => c.category === 'seasonal').map((caseItem) => (
                      <Card
                        key={caseItem.id}
                        className="group relative overflow-hidden hover:shadow-glow-purple transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-secondary/20 to-card/50"
                      >
                        <div className="p-6" onClick={() => setSelectedCase(caseItem)}>
                          <div className="text-6xl mb-4 animate-float">{caseItem.icon}</div>
                          <h3 className="font-bold text-lg mb-2">{caseItem.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{caseItem.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-secondary text-secondary-foreground shadow-glow-purple">
                              <Icon name="Star" size={14} className="mr-1" />
                              {caseItem.price}
                            </Badge>
                            <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-secondary transition-colors" />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCaseInfo(caseItem);
                          }}
                        >
                          <Icon name="Info" size={16} />
                        </Button>
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upgrade">
                <Card className="p-8 max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Апгрейд подарков</h2>
                    <p className="text-muted-foreground">Выбери подарок и цель для апгрейда</p>
                  </div>
                  
                  {!selectedGiftForUpgrade ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-center">Выбери подарок для апгрейда</h3>
                      {inventory.length === 0 ? (
                        <div className="text-center p-12">
                          <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">Сначала открой кейс!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {inventory.map((gift, index) => (
                            <Card
                              key={`inv-${gift.id}-${index}`}
                              className={`p-4 ${RARITY_BG[gift.rarity]} border-2 hover:scale-105 transition-all cursor-pointer hover:shadow-glow-gold`}
                              onClick={() => setSelectedGiftForUpgrade(gift)}
                            >
                              <div className="text-center">
                                <span className="text-4xl mb-2 block">{gift.icon}</span>
                                <p className={`text-xs font-semibold ${RARITY_COLORS[gift.rarity]} mb-1`}>
                                  {gift.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{gift.value} ⭐</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : !targetGiftForUpgrade ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">Выбран подарок</h3>
                        <Card className={`p-6 ${RARITY_BG[selectedGiftForUpgrade.rarity]} border-2 max-w-xs mx-auto`}>
                          <div className="text-center">
                            <span className="text-6xl mb-2 block">{selectedGiftForUpgrade.icon}</span>
                            <p className={`text-sm font-semibold ${RARITY_COLORS[selectedGiftForUpgrade.rarity]}`}>
                              {selectedGiftForUpgrade.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{selectedGiftForUpgrade.value} ⭐</p>
                          </div>
                        </Card>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4 text-center">Выбери цель для апгрейда</h3>
                      <ScrollArea className="h-96">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
                          {getAvailableUpgradeTargets(selectedGiftForUpgrade).map((gift) => {
                            const chance = calculateUpgradeChance(selectedGiftForUpgrade, gift);
                            return (
                              <Card
                                key={`target-${gift.id}`}
                                className={`p-4 ${RARITY_BG[gift.rarity]} border-2 hover:scale-105 transition-all cursor-pointer hover:shadow-glow-gold`}
                                onClick={() => setTargetGiftForUpgrade(gift)}
                              >
                                <div className="text-center">
                                  <span className="text-4xl mb-2 block">{gift.icon}</span>
                                  <p className={`text-xs font-semibold ${RARITY_COLORS[gift.rarity]} mb-1`}>
                                    {gift.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-2">{gift.value} ⭐</p>
                                  <Badge variant="outline" className="text-xs bg-primary/20">
                                    {chance}% шанс
                                  </Badge>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                      
                      <div className="mt-6 flex justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedGiftForUpgrade(null)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : !isUpgrading && !upgradeResult ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-8 items-center">
                        <div className="space-y-4">
                          <p className="text-sm font-semibold text-center">Текущий подарок</p>
                          <Card className={`p-6 ${RARITY_BG[selectedGiftForUpgrade.rarity]} border-2`}>
                            <div className="text-center">
                              <span className="text-6xl mb-2 block">{selectedGiftForUpgrade.icon}</span>
                              <p className={`text-sm font-semibold ${RARITY_COLORS[selectedGiftForUpgrade.rarity]}`}>
                                {selectedGiftForUpgrade.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedGiftForUpgrade.value} ⭐
                              </p>
                            </div>
                          </Card>
                        </div>

                        <div className="flex flex-col items-center">
                          <Icon name="ArrowRight" size={32} className="text-primary mb-2" />
                          <p className="text-sm font-semibold mb-2">Шанс успеха</p>
                          <Progress value={calculateUpgradeChance(selectedGiftForUpgrade, targetGiftForUpgrade)} className="w-full mb-2" />
                          <p className="text-2xl font-bold text-primary">
                            {calculateUpgradeChance(selectedGiftForUpgrade, targetGiftForUpgrade)}%
                          </p>
                        </div>

                        <div className="space-y-4">
                          <p className="text-sm font-semibold text-center">Цель апгрейда</p>
                          <Card className={`p-6 ${RARITY_BG[targetGiftForUpgrade.rarity]} border-2`}>
                            <div className="text-center">
                              <span className="text-6xl mb-2 block">{targetGiftForUpgrade.icon}</span>
                              <p className={`text-sm font-semibold ${RARITY_COLORS[targetGiftForUpgrade.rarity]}`}>
                                {targetGiftForUpgrade.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {targetGiftForUpgrade.value} ⭐
                              </p>
                            </div>
                          </Card>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedGiftForUpgrade(null);
                            setTargetGiftForUpgrade(null);
                          }}
                        >
                          Отмена
                        </Button>
                        <Button 
                          size="lg" 
                          className="flex-1 bg-gradient-to-r from-primary to-accent shadow-glow-gold"
                          onClick={startUpgrade}
                        >
                          <Icon name="Zap" size={20} className="mr-2" />
                          Начать апгрейд
                        </Button>
                      </div>
                    </div>
                  ) : isUpgrading ? (
                    <div className="py-8">
                      <UpgradeWheel 
                        successChance={calculateUpgradeChance(selectedGiftForUpgrade, targetGiftForUpgrade)} 
                        onResult={handleUpgradeResult}
                      />
                      <p className="text-center text-lg text-muted-foreground mt-8">
                        Испытай свою удачу...
                      </p>
                    </div>
                  ) : upgradeResult ? (
                    <div className="text-center py-8 space-y-6">
                      {upgradeResult.success && upgradeResult.newGift ? (
                        <>
                          <div className="animate-glow-pulse">
                            <Icon name="Sparkles" size={64} className="mx-auto text-legendary mb-4" />
                            <span className="text-9xl block mb-4">{upgradeResult.newGift.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold mb-2 text-legendary">Успешно!</h3>
                            <p className={`text-xl font-semibold ${RARITY_COLORS[upgradeResult.newGift.rarity]}`}>
                              {upgradeResult.newGift.name}
                            </p>
                            <p className="text-2xl font-bold text-primary mt-2">
                              {upgradeResult.newGift.value} ⭐
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Icon name="X" size={64} className="mx-auto text-destructive mb-4" />
                          <h3 className="text-3xl font-bold text-destructive">Неудача</h3>
                          <p className="text-muted-foreground">Подарок потерян</p>
                        </>
                      )}
                      <Button 
                        size="lg" 
                        className="w-full max-w-md mx-auto"
                        onClick={() => {
                          setSelectedGiftForUpgrade(null);
                          setTargetGiftForUpgrade(null);
                          setUpgradeResult(null);
                        }}
                      >
                        Продолжить
                      </Button>
                    </div>
                  ) : null}
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <div className="max-w-6xl mx-auto space-y-8">
                  <Card className="p-8 bg-gradient-to-br from-card to-secondary/10">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl shadow-glow-gold">
                        👤
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Игрок #12345</h2>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <p className="text-muted-foreground">Открыто кейсов</p>
                            <p className="text-xl font-bold text-primary">0</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Подарков в инвентаре</p>
                            <p className="text-xl font-bold text-secondary">{inventory.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Звездочки</p>
                            <p className="text-xl font-bold text-accent">{stars}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Инвентарь</h3>
                    {inventory.length === 0 ? (
                      <Card className="p-12 text-center">
                        <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg text-muted-foreground">Инвентарь пуст</p>
                        <p className="text-sm text-muted-foreground mt-2">Открой свой первый кейс!</p>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {inventory.map((gift, index) => (
                          <Card
                            key={`profile-${gift.id}-${index}`}
                            className={`p-4 ${RARITY_BG[gift.rarity]} border-2 hover:scale-105 transition-transform cursor-pointer`}
                          >
                            <div className="text-center">
                              <span className="text-4xl mb-2 block">{gift.icon}</span>
                              <p className={`text-xs font-semibold ${RARITY_COLORS[gift.rarity]} mb-1`}>
                                {gift.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{gift.value} ⭐</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={showCaseInfo !== null} onOpenChange={(open) => !open && setShowCaseInfo(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {showCaseInfo && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <span className="text-4xl">{showCaseInfo.icon}</span>
                  {showCaseInfo.name}
                </DialogTitle>
                <DialogDescription>
                  Шансы выпадения подарков из этого кейса
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-96 pr-4">
                <div className="space-y-2">
                  {showCaseInfo.giftPool
                    .sort((a, b) => b.chance - a.chance)
                    .map((item, index) => (
                      <div
                        key={`pool-${item.gift.id}-${index}`}
                        className={`flex items-center justify-between p-3 rounded-lg ${RARITY_BG[item.gift.rarity]} border`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{item.gift.icon}</span>
                          <div>
                            <p className={`font-semibold ${RARITY_COLORS[item.gift.rarity]}`}>
                              {item.gift.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.gift.value} ⭐</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {item.chance >= 1 ? item.chance.toFixed(2) : item.chance.toFixed(3)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={selectedCase !== null && !showRoulette} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-md">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  {selectedCase.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <span className="text-8xl animate-float">{selectedCase.icon}</span>
                  <p className="text-muted-foreground mt-4">{selectedCase.description}</p>
                </div>

                {stars < selectedCase.price ? (
                  <div className="text-center p-4 bg-destructive/20 rounded-lg border border-destructive">
                    <Icon name="AlertCircle" size={24} className="mx-auto text-destructive mb-2" />
                    <p className="text-sm text-destructive">Недостаточно звездочек</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <span className="text-sm">Стоимость:</span>
                      <span className="font-bold text-lg flex items-center gap-1">
                        <Icon name="Star" size={18} className="text-primary" />
                        {selectedCase.price}
                      </span>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-accent shadow-glow-gold"
                      onClick={() => openCase(selectedCase)}
                      disabled={isOpening}
                    >
                      <Icon name="Gift" size={20} className="mr-2" />
                      Открыть кейс
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRoulette} onOpenChange={() => {}}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4">Открываем кейс...</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            {wonGift && selectedCase && (
              <CaseOpeningRoulette 
                targetGift={wonGift}
                casePool={selectedCase.giftPool}
                onComplete={handleRouletteComplete}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openedGift !== null} onOpenChange={(open) => !open && setOpenedGift(null)}>
        <DialogContent className="max-w-md">
          {openedGift && (
            <div className="text-center py-8 space-y-6">
              <div className="animate-glow-pulse">
                <span className="text-9xl">{openedGift.icon}</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">{openedGift.name}</h3>
                <p className={`text-xl font-semibold ${RARITY_COLORS[openedGift.rarity]}`}>
                  {openedGift.rarity.toUpperCase()}
                </p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {openedGift.value} ⭐
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setOpenedGift(null)}
              >
                Забрать подарок
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
