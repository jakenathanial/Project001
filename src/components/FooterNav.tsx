import React from 'react';

interface FooterNavProps {
  onNavigate: (view: string) => void;
}

export const FooterNav: React.FC<FooterNavProps> = ({ onNavigate }) => {
  return (
    <div className="footer-nav">
      <span onClick={() => onNavigate('home')}>🏠 Home</span>
      <span className="sep">·</span>
      <span onClick={() => onNavigate('trade')}>🔄 Trade</span>
      <span className="sep">·</span>
      <span onClick={() => onNavigate('about')}>ℹ️ About</span>
      <span className="sep">·</span>
      <span onClick={() => onNavigate('contact')}>✉️ Contact</span>
      <span className="sep">·</span>
      <span onClick={() => onNavigate('privacy')}>🔒 Privacy</span>
      <span className="sep">·</span>
      <span onClick={() => onNavigate('terms')}>📜 Terms</span>
      <span className="sep">·</span>
      <span style={{ color: 'var(--muted)', cursor: 'default' }}>© 2026 RentAFruit</span>
    </div>
  );
};
