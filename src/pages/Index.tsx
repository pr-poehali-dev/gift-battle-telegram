import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const CASES: Case[] = [
  { id: '1', name: 'Бедолага', price: 10, category: 'normal', icon: '😢', description: 'Простой кейс для начинающих' },
  { id: '2', name: 'Бомж', price: 50, category: 'normal', icon: '🎒', description: 'Может повезти!' },
  { id: '3', name: 'Студент', price: 100, category: 'normal', icon: '📚', description: 'Средние шансы' },
  { id: '4', name: 'Работяга', price: 200, category: 'normal', icon: '⚒️', description: 'Стабильный выбор' },
  { id: '5', name: 'Уборщик', price: 228, category: 'normal', icon: '🧹', description: 'Чистая удача' },
  { id: '6', name: 'Менеджер', price: 300, category: 'normal', icon: '💼', description: 'Деловой подход' },
  { id: '7', name: 'Директор', price: 450, category: 'normal', icon: '👔', description: 'Повышенные шансы' },
  { id: '8', name: 'Предприниматель', price: 525, category: 'normal', icon: '📈', description: 'Рискованно но выгодно' },
  { id: '9', name: 'Миллионер', price: 666, category: 'normal', icon: '💰', description: 'Дьявольски хорош' },
  { id: '10', name: 'Олигарх', price: 800, category: 'normal', icon: '🏰', description: 'Элитный выбор' },
  { id: '11', name: 'Мажор', price: 1000, category: 'normal', icon: '🎩', description: 'Только лучшее' },
  { id: '12', name: 'Президент', price: 1500, category: 'normal', icon: '👑', description: 'Власть и богатство' },
  { id: '13', name: 'Ранняя осень', price: 350, category: 'seasonal', icon: '🍂', description: 'Осенняя коллекция' },
  { id: '14', name: 'Дождливая осень', price: 420, category: 'seasonal', icon: '🌧️', description: 'Редкие предметы' },
  { id: '15', name: 'Золотая осень', price: 777, category: 'seasonal', icon: '🍁', description: 'Золотой сезон' },
  { id: '16', name: 'Поздняя осень', price: 555, category: 'seasonal', icon: '🌰', description: 'Последний шанс' },
  { id: '17', name: 'Зимняя сказка', price: 888, category: 'seasonal', icon: '❄️', description: 'Морозные сюрпризы' },
  { id: '18', name: 'Новогодний', price: 999, category: 'seasonal', icon: '🎄', description: 'Праздничный кейс' },
  { id: '19', name: 'Весенний', price: 444, category: 'seasonal', icon: '🌸', description: 'Цветущие возможности' },
  { id: '20', name: 'Летний', price: 600, category: 'seasonal', icon: '☀️', description: 'Жаркие призы' },
  { id: '21', name: 'Космический', price: 1200, category: 'normal', icon: '🚀', description: 'В бесконечность!' },
  { id: '22', name: 'Магический', price: 1337, category: 'normal', icon: '🔮', description: 'Волшебство реально' },
  { id: '23', name: 'Драконий', price: 1666, category: 'normal', icon: '🐉', description: 'Легендарная сила' },
  { id: '24', name: 'Царский', price: 2000, category: 'normal', icon: '💎', description: 'Царские сокровища' },
  { id: '25', name: 'Божественный', price: 2500, category: 'normal', icon: '✨', description: 'Дар богов' },
  { id: '26', name: 'Адский', price: 3000, category: 'normal', icon: '🔥', description: 'Адская удача' },
  { id: '27', name: 'Небесный', price: 3500, category: 'normal', icon: '☁️', description: 'Облачные высоты' },
  { id: '28', name: 'Титановый', price: 4000, category: 'normal', icon: '🛡️', description: 'Несгибаемый' },
  { id: '29', name: 'Платиновый', price: 5000, category: 'normal', icon: '🏆', description: 'Для победителей' },
  { id: '30', name: 'Безлимитный', price: 7500, category: 'normal', icon: '♾️', description: 'Без границ' },
  { id: '31', name: 'Ультра', price: 10000, category: 'normal', icon: '⚡', description: 'Максимальная мощь' }
];

const SAMPLE_GIFTS: Gift[] = [
  { id: '1', name: 'Простой подарок', rarity: 'common', value: 5, icon: '🎁' },
  { id: '2', name: 'Цветок', rarity: 'uncommon', value: 25, icon: '🌹' },
  { id: '3', name: 'Шоколад', rarity: 'rare', value: 50, icon: '🍫' },
  { id: '4', name: 'Плюшевый мишка', rarity: 'epic', value: 150, icon: '🧸' },
  { id: '5', name: 'Золотая звезда', rarity: 'legendary', value: 500, icon: '⭐' },
  { id: '6', name: 'Бриллиант', rarity: 'mythic', value: 1500, icon: '💎' },
  { id: '7', name: 'Феникс', rarity: 'exotic', value: 5000, icon: '🔥' },
  { id: '8', name: 'Корона богов', rarity: 'divine', value: 15000, icon: '👑' }
];

export default function Index() {
  const [stars, setStars] = useState(3000);
  const [inventory, setInventory] = useState<Gift[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedGift, setOpenedGift] = useState<Gift | null>(null);
  const [recentDrops] = useState<RecentDrop[]>([
    { id: '1', playerName: 'Player123', gift: SAMPLE_GIFTS[7], timestamp: new Date(Date.now() - 30000) },
    { id: '2', playerName: 'LuckyOne', gift: SAMPLE_GIFTS[5], timestamp: new Date(Date.now() - 60000) },
    { id: '3', playerName: 'GiftHunter', gift: SAMPLE_GIFTS[4], timestamp: new Date(Date.now() - 120000) }
  ]);
  const [activeTab, setActiveTab] = useState('cases');

  const openCase = (caseItem: Case) => {
    if (stars < caseItem.price) return;
    
    setIsOpening(true);
    setStars(stars - caseItem.price);
    
    setTimeout(() => {
      const randomGift = SAMPLE_GIFTS[Math.floor(Math.random() * SAMPLE_GIFTS.length)];
      setOpenedGift(randomGift);
      setInventory([...inventory, randomGift]);
      setIsOpening(false);
      setSelectedCase(null);
    }, 2000);
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
                        onClick={() => setSelectedCase(caseItem)}
                      >
                        <div className="p-6">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        onClick={() => setSelectedCase(caseItem)}
                      >
                        <div className="p-6">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upgrade">
                <Card className="p-8 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Апгрейд подарков</h2>
                    <p className="text-muted-foreground">Улучши свои подарки с шансом получить более редкие</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 items-center mb-8">
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-center">Выбери подарок</p>
                      <Card className="p-6 border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                        <div className="text-center">
                          <Icon name="Plus" size={48} className="mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Выбрать из инвентаря</p>
                        </div>
                      </Card>
                    </div>

                    <div className="flex flex-col items-center">
                      <Icon name="ArrowRight" size={32} className="text-primary mb-2" />
                      <p className="text-sm font-semibold mb-2">Шанс успеха</p>
                      <Progress value={30} className="w-full mb-2" />
                      <p className="text-xl font-bold text-primary">30%</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-center">Возможный результат</p>
                      <Card className="p-6 bg-gradient-to-br from-legendary/20 to-card border-legendary">
                        <div className="text-center">
                          <span className="text-5xl">❓</span>
                          <p className="text-sm text-legendary mt-2">Редкий подарок</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent shadow-glow-gold" disabled>
                    <Icon name="Zap" size={20} className="mr-2" />
                    Начать апгрейд
                  </Button>
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
                            key={`${gift.id}-${index}`}
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

      <Dialog open={selectedCase !== null} onOpenChange={(open) => !open && setSelectedCase(null)}>
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
                      {isOpening ? (
                        <>
                          <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                          Открываем...
                        </>
                      ) : (
                        <>
                          <Icon name="Gift" size={20} className="mr-2" />
                          Открыть кейс
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
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
