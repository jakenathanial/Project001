import React, { useState } from 'react';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(trimmed);
  };

  return (
    <div className="overlay-modal show">
      <div className="modal-box">
        <div className="modal-head">
          <h3>👋 Pick a name!</h3>
          <button className="btn-x" onClick={onClose}>✕</button>
        </div>
        <p>Enter a display name to continue as Guest.</p>
        <input
          type="text"
          className="name-input"
          style={{ borderColor: error ? 'var(--red)' : undefined }}
          placeholder="e.g. CoolHunter99"
          value={name}
          maxLength={24}
          onChange={(e) => { setName(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          autoFocus
        />
        <button className="btn-primary" onClick={handleSubmit}>
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
};
