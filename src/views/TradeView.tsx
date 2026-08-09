import React, { useState } from 'react';
import { TradeListing, FruitItem, FruitRarity, UserProfile } from '../types';
import { ago, rc, sanitizeImageUrl, fallbackImg, checkIsAdmin } from '../lib/utils';
import { Plus, ArrowLeft, Search, RefreshCw, Trash2, ArrowRightLeft } from 'lucide-react';

interface TradeViewProps {
  subView: 'feed' | 'post';
  trades: TradeListing[];
  currentUser: UserProfile | null;
  onNavigateSubView: (view: 'feed' | 'post') => void;
  onOpenTradeDetail: (tradeId: string) => void;
  onCancelTrade: (tradeId: string) => void;
  onPostTrade: (offering: FruitItem[], wanting: FruitItem[], note: string) => Promise<void>;
  onOpenPicker: (side: 'offer' | 'want', slotIdx: number) => void;
  offeringSlots: FruitItem[];
  wantingSlots: FruitItem[];
  onRemoveSlot: (side: 'offer' | 'want', slotIdx: number) => void;
  posting: boolean;
  postError: string;
}

const RARITIES: (FruitRarity | 'All')[] = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical'];

export const TradeView: React.FC<TradeViewProps> = ({
  subView,
  trades,
  currentUser,
  onNavigateSubView,
  onOpenTradeDetail,
  onCancelTrade,
  onPostTrade,
  onOpenPicker,
  offeringSlots,
  wantingSlots,
  onRemoveSlot,
  posting,
  postError,
}) => {
  const [feedRarity, setFeedRarity] = useState<FruitRarity | 'All'>('All');
  const [feedSearch, setFeedSearch] = useState('');
  const [tradeNote, setTradeNote] = useState('');

  const isAdmin = checkIsAdmin(currentUser?.email);

  if (subView === 'post') {
    const totalOfferValue = offeringSlots.reduce((s, f) => s + (f ? Number(f.value || 0) : 0), 0);
    const totalWantValue = wantingSlots.reduce((s, f) => s + (f ? Number(f.value || 0) : 0), 0);

    const handleSubmit = async () => {
      const offering = offeringSlots.filter(Boolean);
      const wanting = wantingSlots.filter(Boolean);
      await onPostTrade(offering, wanting, tradeNote.trim());
    };

    return (
      <main className="main">
        <div className="pg-header">
          <button className="btn-back" onClick={() => onNavigateSubView('feed')}>
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to board
          </button>
          <h2 className="pg-title">📬 Post a Trade</h2>
          <span></span>
        </div>

        <div className="trade-form-wrap">
          <div className="tfw-field">
            <label className="tfw-label">🟢 You're Offering (up to 4)</label>
            <div className="slots-grid">
              {[0, 1, 2, 3].map((idx) => {
                const f = offeringSlots[idx];
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
                          onRemoveSlot('offer', idx);
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="slot" onClick={() => onOpenPicker('offer', idx)}>
                    <span className="s-plus">+</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tfw-field">
            <label className="tfw-label">🔵 You Want (up to 4, optional)</label>
            <div className="slots-grid">
              {[0, 1, 2, 3].map((idx) => {
                const f = wantingSlots[idx];
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
                          onRemoveSlot('want', idx);
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="slot" onClick={() => onOpenPicker('want', idx)}>
                    <span className="s-plus">+</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tv-bar">
            <div className="tv-side">
              Offering Value
              <b>💰 {totalOfferValue.toLocaleString()}</b>
            </div>
            <div className="tv-side">
              Wanting Value
              <b>💰 {totalWantValue.toLocaleString()}</b>
            </div>
          </div>

          <div className="tfw-field" style={{ marginTop: '18px' }}>
            <label className="tfw-label">Extra Note (optional)</label>
            <textarea
              className="tfw-textarea"
              maxLength={140}
              placeholder="e.g. or best offer, will add Beli"
              value={tradeNote}
              onChange={(e) => setTradeNote(e.target.value)}
            />
          </div>

          {postError && <div className="tfw-err">{postError}</div>}

          <button
            className="btn-post-trade"
            onClick={handleSubmit}
            disabled={posting}
          >
            {posting ? 'Posting Trade...' : '🤝 Post Trade'}
          </button>
        </div>
      </main>
    );
  }

  // Feed View
  const filteredTrades = trades.filter((t) => {
    if (t.status !== 'open') return false;

    if (feedRarity !== 'All') {
      const hasOffering = (t.offering || []).some((f) => f.rarity === feedRarity);
      const hasWanting = (t.wanting?.fruits || []).some((f) => f.rarity === feedRarity);
      if (!hasOffering && !hasWanting) return false;
    }

    if (feedSearch.trim()) {
      const query = feedSearch.toLowerCase();
      const haystack = [
        t.username,
        ...(t.offering || []).map((f) => f.name),
        ...((t.wanting?.fruits) || []).map((f) => f.name),
        t.wanting?.note,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  const renderFruitTiles = (fruits: any[]) => {
    return [0, 1, 2, 3].map((i) => {
      const f = fruits[i];
      if (!f) return <div key={i} className="tc-fruit-tile empty-tile" />;

      const imgUrl = sanitizeImageUrl(f.photo);
      return (
        <div key={i} className={`tc-fruit-tile has-fruit r-${rc(f.rarity)}`}>
          <img
            src={imgUrl}
            alt={f.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg();
            }}
          />
          <span className="tc-fruit-name">{f.name}</span>
        </div>
      );
    });
  };

  return (
    <main className="main">
      <div className="pg-header">
        <div>
          <div className="sec-title" style={{ marginBottom: '2px' }}>
            <RefreshCw className="w-4 h-4 inline mr-1 text-purple-400" /> Live Trade Board
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>
            {filteredTrades.length} open {filteredTrades.length === 1 ? 'listing' : 'listings'}
          </div>
        </div>

        {currentUser && !currentUser.isGuest && (
          <button className="btn-create" onClick={() => onNavigateSubView('post')}>
            <Plus className="w-4 h-4 inline mr-1" /> Post a Trade
          </button>
        )}
      </div>

      <div className="tfilters">
        <div className="relative flex-1 min-w-[180px]">
          <input
            className="tsearch w-full"
            placeholder="Search a fruit or username..."
            value={feedSearch}
            onChange={(e) => setFeedSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {RARITIES.map((r) => (
            <button
              key={r}
              className={`tchip ${feedRarity === r ? 'active' : ''}`}
              onClick={() => setFeedRarity(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div id="tradeList" className="trade-list">
        {filteredTrades.length === 0 ? (
          <div className="empty-msg" style={{ gridColumn: '1/-1' }}>
            🤝 No open trades match your filter yet.<br />
            Be the first to post one above!
          </div>
        ) : (
          filteredTrades.map((t) => {
            const isOwn = currentUser && t.ownerId === currentUser.uid;
            const canDel = currentUser && (isOwn || isAdmin);

            return (
              <div
                key={t.id}
                className="trade-card"
                onClick={() => onOpenTradeDetail(t.id)}
              >
                <div className="tc-top">
                  <span className="tc-poster">
                    👤 {t.username} {isOwn && <span style={{ opacity: 0.45, fontSize: '0.62rem' }}>(you)</span>}
                  </span>
                  <span className="tc-age">{ago(t.createdAt)}</span>
                </div>

                <div className="tc-body">
                  <div>
                    <div className="tc-side-tag offer">Offers</div>
                    <div className="tc-fruit-grid">{renderFruitTiles(t.offering || [])}</div>
                  </div>

                  <div className="tc-arrow">⇄</div>

                  <div>
                    <div className="tc-side-tag want">Wants</div>
                    <div className="tc-fruit-grid">{renderFruitTiles(t.wanting?.fruits || [])}</div>
                  </div>
                </div>

                {t.wanting?.note && (
                  <div className="tc-note">"{t.wanting.note}"</div>
                )}

                <div className="tc-footer">
                  {canDel ? (
                    <button
                      className="btn-tc-del"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelTrade(t.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 inline mr-1" /> Cancel
                    </button>
                  ) : (
                    <span className="tc-tap-hint">tap to view →</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {(!currentUser || currentUser.isGuest) && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginTop: '16px',
          }}
        >
          🔒 Sign in with Google to post a trade or make offers
        </p>
      )}
    </main>
  );
};
