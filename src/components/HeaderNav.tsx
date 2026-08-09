import React from 'react';
import { UserProfile } from '../types';
import { checkIsAdmin, sanitizeImageUrl } from '../lib/utils';
import { Anchor, RefreshCw, Home, Info, Mail, Shield, ScrollText, Star, LogOut } from 'lucide-react';

interface HeaderNavProps {
  user: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
}) => {
  const isAdmin = checkIsAdmin(user?.email);
  const avatar = sanitizeImageUrl(user?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=guest');
  const name = user?.displayName || 'Guest';

  return (
    <>
      <header className="topbar">
        <span className="topbar-logo" onClick={() => onNavigate('home')}>
          🍊 RentAFruit
        </span>
        <div className="topbar-right">
          <img src={avatar} className="t-avatar" alt="Avatar" onError={(e) => { (e.target as HTMLImageElement).src = avatar; }} />
          <span className="uname">{name}</span>
          <button className="btn-sm" onClick={onLogout} title="Logout">
            <LogOut className="w-3.5 h-3.5 inline mr-1" /> Logout
          </button>
        </div>
      </header>

      <nav className="navbar">
        <button
          className={`nav-btn ${['home', 'destination', 'room'].includes(currentView) ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <Home className="w-3.5 h-3.5 inline mr-1" /> Home
        </button>
        <button
          className={`nav-btn ${currentView === 'trade' ? 'active' : ''}`}
          onClick={() => onNavigate('trade')}
        >
          <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Trade
        </button>
        <button
          className={`nav-btn ${currentView === 'about' ? 'active' : ''}`}
          onClick={() => onNavigate('about')}
        >
          <Info className="w-3.5 h-3.5 inline mr-1" /> About
        </button>
        <button
          className={`nav-btn ${currentView === 'contact' ? 'active' : ''}`}
          onClick={() => onNavigate('contact')}
        >
          <Mail className="w-3.5 h-3.5 inline mr-1" /> Contact
        </button>
        <button
          className={`nav-btn ${currentView === 'privacy' ? 'active' : ''}`}
          onClick={() => onNavigate('privacy')}
        >
          <Shield className="w-3.5 h-3.5 inline mr-1" /> Privacy
        </button>
        <button
          className={`nav-btn ${currentView === 'terms' ? 'active' : ''}`}
          onClick={() => onNavigate('terms')}
        >
          <ScrollText className="w-3.5 h-3.5 inline mr-1" /> Terms
        </button>

        {isAdmin && (
          <button
            className={`nav-btn is-admin ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            <Star className="w-3.5 h-3.5 inline mr-1 fill-amber-400" /> Admin
          </button>
        )}
      </nav>
    </>
  );
};
