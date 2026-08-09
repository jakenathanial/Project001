import React from 'react';
import { UserProfile } from '../types';
import { sanitizeImageUrl } from '../lib/utils';
import { Ship, Sparkles, MapPin } from 'lucide-react';

interface HomeViewProps {
  user: UserProfile | null;
  myBoat: boolean;
  onToggleBoat: () => void;
  onSelectDestination: (dest: 'Tiki Outpost' | 'Hydra Island') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  myBoat,
  onToggleBoat,
  onSelectDestination,
}) => {
  const avatar = sanitizeImageUrl(user?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=guest');
  const name = user?.displayName || 'Guest';

  return (
    <main className="main">
      <div className="profile-panel">
        <div className="profile-inner">
          <img
            src={avatar}
            className="pr-avatar"
            alt="Profile"
            onError={(e) => {
              (e.target as HTMLImageElement).src = avatar;
            }}
          />
          <div style={{ flex: 1 }}>
            <div className="pr-name">{name}</div>
            <div className="pr-badge">
              {user?.isGuest ? '👤 Guest Account' : '✅ Signed in with Google'}
            </div>
            <div className="boat-row">
              <span className="boat-label">
                <Ship className="w-4 h-4 inline mr-1 text-purple-400" /> Beast Hunter Boat:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={myBoat}
                    onChange={onToggleBoat}
                  />
                  <span className="slider"></span>
                </label>
                <div className={`boat-ind ${myBoat ? 'on' : 'off'}`}>
                  <span className={`dot ${myBoat ? 'on' : 'off'}`}></span>
                  {myBoat ? '🚢 Active!' : 'Not Active'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="hero-eye">PICK WHERE TO HUNT</div>
        <h1 className="hero-h1">
          Find your <span className="grad">Leviathan Heart</span> 🐉
        </h1>
        <p className="hero-tip">
          Click a location to join an active hunt room or create your own!
        </p>
      </div>

      <div className="dest-grid">
        <div className="dest-card" onClick={() => onSelectDestination('Tiki Outpost')}>
          <div className="dest-glow"></div>
          <span className="dest-icon">🏝️</span>
          <div className="dest-name">Tiki Outpost</div>
          <div className="dest-desc">Sunny island, big waves, bigger loot!</div>
          <div className="dest-cta">
            <MapPin className="w-4 h-4 inline mr-1" /> Hunt here →
          </div>
        </div>

        <div className="dest-card" onClick={() => onSelectDestination('Hydra Island')}>
          <div className="dest-glow b"></div>
          <span className="dest-icon">🐉</span>
          <div className="dest-name">Hydra Island</div>
          <div className="dest-desc">Dangerous waters — for the brave only!</div>
          <div className="dest-cta">
            <MapPin className="w-4 h-4 inline mr-1" /> Hunt here →
          </div>
        </div>
      </div>
    </main>
  );
};
