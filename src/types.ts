export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  hasBeastBoat: boolean;
  email?: string | null;
  isGuest?: boolean;
}

export type FruitRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythical';
export type ItemType = 'Devil Fruit' | 'Game Pass';

export interface FruitItem {
  id: string;
  name: string;
  value: number;
  photo: string;
  rarity: FruitRarity;
  type: ItemType;
  addedAt?: any;
}

export interface TradeSideFruit {
  name: string;
  rarity: FruitRarity;
  photo: string;
  value: number;
}

export interface TradeListing {
  id: string;
  ownerId: string;
  username: string;
  offering: TradeSideFruit[];
  wanting: {
    fruits: TradeSideFruit[];
    note?: string;
  };
  status: 'open' | 'closed';
  closedWith?: string | null;
  createdAt?: any;
}

export interface CounterOffer {
  id: string;
  ownerId: string;
  tradeId: string;
  username: string;
  type: 'accept' | 'counter';
  offering: TradeSideFruit[];
  note?: string;
  createdAt?: any;
}

export interface RoomPlayer {
  uid: string;
  name: string;
  hasBeastBoat: boolean;
}

export interface HuntRoom {
  id: string;
  destination: 'Tiki Outpost' | 'Hydra Island';
  host: string;
  hostUid: string;
  createdAt: number;
  expiresAt: number;
  players: Record<string, RoomPlayer>;
}

export interface ChatMessage {
  id: string;
  uid: string;
  name: string;
  text: string;
  ts: number;
}
