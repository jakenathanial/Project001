import React, { useState } from 'react';
import { TradeListing, CounterOffer, UserProfile, FruitItem } from '../types';
import { ago, rc, sanitizeImageUrl, fallbackImg, checkIsAdmin } from '../lib/utils';

interface TradeDetailModalProps {
  trade: TradeListing | null;
  offers: CounterOffer[];
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSendOffer: (type: 'accept' | 'counter', offering: any[], note: string) => Promise<void>;
  onAcceptOffer: (offerId: string) => Promise<void>;
  onCancelTrade: (tradeId: string) => Promise<void>;
  onOpenPicker: () => void;
  counterOffering: FruitItem[];
  onRemoveCounterSlot: (index: number) => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  offers,
  currentUser,
  isOpen,
  onClose,
  onSendOffer,
  onAcceptOffer,
  onCancelTrade,
  onOpenPicker,
  counterOffering,
  onRemoveCounterSlot,
}) => {
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterNote, setCounterNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !trade) return null;

  const isOwner = currentUser && trade.ownerId === currentUser.uid;
  const isAdmin = checkIsAdmin(currentUser?.email);
  const isOpenStatus = trade.status === 'open';
  const canCancel = currentUser && (isOwner || isAdmin) && isOpenStatus;

  const handleDirectAccept = async () => {
    setSubmitting(true);
    try {
      await onSendOffer('accept', trade.wanting?.fruits || [], '');
    } catch (e: any) {
      setErrorMsg(e.message || 'Error sending offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendCounter = async () => {
    const sel = counterOffering.filter(Boolean);
    if (!sel.length && !counterNote.trim()) {
      setErrorMsg('Add at least one fruit or a note.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await onSendOffer('counter', sel, counterNote.trim());
      setShowCounterForm(false);
      setCounterNote('');
    } catch (e: any) {
      setErrorMsg(e.message || 'Error sending counter offer');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFruitList = (list: any[]) => {
    if (!list || list.length === 0) {
      return (
        <div style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 600 }}>
          Anything / Negotiable
        </div>
      );
    }

    return list.map((f, i) => (
      <div key={i} className="td-fruit">
        <img
          src={sanitizeImageUrl(f.photo)}
          alt={f.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg();
          }}
        />
        <div>
          <div className="td-fn">{f.name}</div>
          <div className="td-fv">
            <span className={`rp rp-${rc(f.rarity)}`}>{f.rarity || '?'}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="overlay-modal show" style={{ zIndex: 940 }}>
      <div
        className="modal-box"
        style={{
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
        }}
      >
        <div
          className="modal-head"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            background: 'var(--card)',
            zIndex: 1,
          }}
        >
          <h3 style={{ color: 'var(--purple)' }}>🤝 Trade Details</h3>
          <button className="btn-x" onClick={onClose}>✕</button>
        </div>

        <div className="td-body">
          <div className="td-poster">
            <div className="td-av">👤</div>
            <div>
              <div className="td-name">
                {trade.username}{' '}
                <span className={`tc-status ${isOpenStatus ? 'open' : 'closed'}`}>
                  {isOpenStatus ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="td-time">Posted {ago(trade.createdAt)}</div>
            </div>
          </div>

          <div className="td-sides">
            <div className="td-side">
              <h4 className="offer">🟢 OFFERING</h4>
              <div className="td-fruits">{renderFruitList(trade.offering || [])}</div>
            </div>
            <div className="td-side">
              <h4 className="want">🔵 WANTS</h4>
              <div className="td-fruits">{renderFruitList(trade.wanting?.fruits || [])}</div>
            </div>
          </div>

          {trade.wanting?.note && (
            <div className="td-note">"{trade.wanting.note}"</div>
          )}

          <div className="td-actions">
            {isOpenStatus ? (
              !isOwner && currentUser && !currentUser.isGuest ? (
                <>
                  <button
                    className="btn-msg"
                    onClick={handleDirectAccept}
                    disabled={submitting}
                  >
                    ✅ Send exactly what they want
                  </button>

                  <button
                    className="btn-counter"
                    onClick={() => setShowCounterForm(!showCounterForm)}
                  >
                    🔄 {showCounterForm ? 'Hide counter form' : 'Propose a different offer'}
                  </button>

                  {showCounterForm && (
                    <div className="counter-form">
                      <div className="ts-label offer">What you're offering instead</div>
                      <div className="slots-grid">
                        {[0, 1, 2, 3].map((idx) => {
                          const f = counterOffering[idx];
                          if (f) {
                            return (
                              <div key={idx} className={`slot filled r-${rc(f.rarity)}`}>
                                <img
                                  src={sanitizeImageUrl(f.photo)}
                                  alt={f.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = fallbackImg();
                                  }}
                                />
                                <span className="s-name">{f.name}</span>
                                <span
                                  className="s-rm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveCounterSlot(idx);
                                  }}
                                >
                                  ✕
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="slot" onClick={onOpenPicker}>
                              <span className="s-plus">+</span>
                            </div>
                          );
                        })}
                      </div>

                      <textarea
                        className="tfw-textarea"
                        placeholder="Optional note..."
                        maxLength={140}
                        style={{ marginTop: '10px' }}
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                      />

                      {errorMsg && <div className="tfw-err">{errorMsg}</div>}

                      <button
                        className="btn-counter"
                        style={{ marginTop: '10px' }}
                        onClick={handleSendCounter}
                        disabled={submitting}
                      >
                        Send Counter Offer
                      </button>
                    </div>
                  )}
                </>
              ) : !currentUser || currentUser.isGuest ? (
                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  🔒 Sign in to make an offer
                </p>
              ) : null
            ) : (
              <div className="td-closed-banner">
                This trade is closed and no longer accepting offers.
              </div>
            )}
          </div>

          {canCancel && (
            <button
              className="btn-del-full"
              onClick={() => onCancelTrade(trade.id)}
            >
              🗑 Cancel This Listing
            </button>
          )}

          <div className="offers-thread">
            <div className="ot-title">💬 Offers & Counter Offers ({offers.length})</div>
            {offers.length === 0 ? (
              <div className="empty-msg" style={{ padding: '24px' }}>
                No offers yet — be the first to propose a trade!
              </div>
            ) : (
              offers.map((o) => {
                const accepted = trade.closedWith === o.id;
                return (
                  <div key={o.id} className={`offer-item ${accepted ? 'accepted' : ''}`}>
                    <div className="offer-head">
                      <span className="offer-name">👤 {o.username}</span>
                      <span className={`offer-badge ${o.type}`}>
                        {o.type === 'accept'
                          ? accepted ? '✅ Accepted' : 'Sent what you asked'
                          : accepted ? '✅ Accepted' : 'Counter offer'}
                      </span>
                    </div>

                    <div className="offer-fruit-row">
                      {(o.offering || []).map((f, i) => (
                        <div key={i} className="offer-fruit-chip">
                          <img
                            src={sanitizeImageUrl(f.photo)}
                            alt={f.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackImg();
                            }}
                          />
                          {f.name}
                        </div>
                      ))}
                    </div>

                    {o.note && <div className="offer-note">"{o.note}"</div>}
                    <div className="offer-time">{ago(o.createdAt)}</div>

                    {isOwner && isOpenStatus && !accepted && (
                      <button
                        className="btn-accept-offer"
                        onClick={() => onAcceptOffer(o.id)}
                      >
                        Accept this offer
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
