import React, { useState } from 'react';
import { FruitItem, FruitRarity, ItemType, UserProfile } from '../types';
import { rc, sanitizeImageUrl, fallbackImg } from '../lib/utils';
import { Star, Plus, Trash2 } from 'lucide-react';

interface AdminViewProps {
  user: UserProfile | null;
  fruits: FruitItem[];
  onAddFruit: (fruit: Omit<FruitItem, 'id'>) => Promise<void>;
  onDeleteFruit: (id: string) => Promise<void>;
}

const RARITIES: FruitRarity[] = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical'];
const TYPES: ItemType[] = ['Devil Fruit', 'Game Pass'];

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  fruits,
  onAddFruit,
  onDeleteFruit,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [photo, setPhoto] = useState('');
  const [rarity, setRarity] = useState<FruitRarity>('Mythical');
  const [type, setType] = useState<ItemType>('Devil Fruit');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !value.trim() || !photo.trim()) {
      setErrorMsg('Fill in all fields!');
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      setErrorMsg('Enter a valid non-negative value for Beli.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    try {
      await onAddFruit({
        name: name.trim(),
        value: numValue,
        photo: photo.trim(),
        rarity,
        type,
      });
      setName('');
      setValue('');
      setPhoto('');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to add fruit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="main">
      <div className="admin-badge">
        <Star className="w-4 h-4 inline fill-amber-400" /> Admin Panel — {user?.displayName}
      </div>

      <div className="sec-title">🍊 Manage Items</div>
      <p className="sec-desc">
        Add fruits or gamepasses with a direct image URL (https://...). Instant catalog updates!
      </p>

      <div className="admin-form">
        <h3>➕ Add New Item</h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">NAME</label>
            <input
              className="form-input"
              placeholder="e.g. Kitsune Fruit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">VALUE (Beli)</label>
            <input
              className="form-input"
              type="number"
              placeholder="8000000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">PHOTO URL</label>
            <input
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">RARITY</label>
            <select
              className="form-select"
              value={rarity}
              onChange={(e) => setRarity(e.target.value as FruitRarity)}
            >
              {RARITIES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">TYPE</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value as ItemType)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && <div className="tfw-err" style={{ marginBottom: '12px' }}>{errorMsg}</div>}

        <button
          className="btn-admin-add"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Plus className="w-4 h-4 inline mr-1" />
          {submitting ? 'Adding Item...' : '➕ Add Item'}
        </button>
      </div>

      <div className="sec-title" style={{ marginBottom: '12px' }}>
        📦 All Catalog Items ({fruits.length})
      </div>

      <div className="admin-fruit-list">
        {fruits.map((f) => {
          const imgUrl = sanitizeImageUrl(f.photo);
          return (
            <div key={f.id} className="afc">
              <img
                src={imgUrl}
                alt={f.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImg();
                }}
              />
              <div className="af-name">{f.name}</div>
              <div className="af-val">💰 {Number(f.value || 0).toLocaleString()}</div>
              <span className={`rp rp-${rc(f.rarity)}`}>{f.rarity}</span>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '3px' }}>
                {f.type}
              </div>
              <button
                className="btn-del-af"
                style={{ marginTop: '9px' }}
                onClick={() => {
                  if (confirm(`Delete ${f.name}?`)) onDeleteFruit(f.id);
                }}
              >
                <Trash2 className="w-3 h-3 inline mr-1" /> Delete
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
};
