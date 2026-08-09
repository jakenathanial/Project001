import React, { useState } from 'react';
import { FruitItem, FruitRarity } from '../types';
import { rc, sanitizeImageUrl, fallbackImg } from '../lib/utils';

interface FruitPickerModalProps {
  isOpen: boolean;
  fruits: FruitItem[];
  onClose: () => void;
  onSelectFruit: (fruit: FruitItem) => void;
}

const RARITIES: (FruitRarity | 'All')[] = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical'];

export const FruitPickerModal: React.FC<FruitPickerModalProps> = ({
  isOpen,
  fruits,
  onClose,
  onSelectFruit,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<FruitRarity | 'All'>('All');

  if (!isOpen) return null;

  const filtered = fruits
    .filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesRarity = selectedRarity === 'All' || f.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      const rank: Record<string, number> = {
        Mythical: 0,
        Legendary: 1,
        Rare: 2,
        Uncommon: 3,
        Common: 4,
      };
      return (rank[a.rarity] ?? 5) - (rank[b.rarity] ?? 5);
    });

  return (
    <div className="overlay-modal show" style={{ zIndex: 950 }}>
      <div
        className="modal-box"
        style={{
          maxWidth: '560px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="modal-head">
          <h3>🍊 Choose a Fruit</h3>
          <button className="btn-x" onClick={onClose}>✕</button>
        </div>

        <div className="fpicker-toolbar">
          <input
            className="tsearch"
            placeholder="Search fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {RARITIES.map((r) => (
              <button
                key={r}
                className={`tchip ${selectedRarity === r ? 'active' : ''}`}
                onClick={() => setSelectedRarity(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="fpicker-grid mt-2" id="fpGrid">
          {filtered.length === 0 ? (
            <div className="no-fruits">
              No fruits found matching search criteria.
            </div>
          ) : (
            filtered.map((f) => {
              const photoUrl = sanitizeImageUrl(f.photo);
              return (
                <div
                  key={f.id}
                  className={`fpicker-item r-${rc(f.rarity)}`}
                  onClick={() => {
                    onSelectFruit(f);
                    onClose();
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={f.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg();
                    }}
                  />
                  <div className="fi-name">{f.name}</div>
                  <span className={`rp rp-${rc(f.rarity)}`}>{f.rarity}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
