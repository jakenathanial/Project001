import React from 'react';
import { HuntRoom, RoomPlayer } from '../types';
import { Plus, ArrowLeft, Users, Ship, Clock } from 'lucide-react';

interface DestinationViewProps {
  destination: 'Tiki Outpost' | 'Hydra Island';
  rooms: HuntRoom[];
  onBack: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  creating: boolean;
}

export const DestinationView: React.FC<DestinationViewProps> = ({
  destination,
  rooms,
  onBack,
  onCreateRoom,
  onJoinRoom,
  creating,
}) => {
  const formatTimer = (expiresAt: number) => {
    const rem = Math.max(0, expiresAt - Date.now());
    const m = Math.floor(rem / 60000);
    const s = Math.floor((rem % 60000) / 1000);
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <main className="main">
      <div className="pg-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
        </button>
        <h2 className="pg-title">📍 {destination}</h2>
        <button className="btn-create" onClick={onCreateRoom} disabled={creating}>
          <Plus className="w-4 h-4 inline mr-1" /> {creating ? 'Creating...' : '✨ Create Room'}
        </button>
      </div>

      <div id="roomList" className="room-list">
        {rooms.length === 0 ? (
          <div className="empty-msg">
            😴 No active hunt rooms right now! Hit ✨ Create Room to start the hunt!
          </div>
        ) : (
          rooms.map((r) => {
            const players = r.players ? (Object.values(r.players) as RoomPlayer[]) : [];
            const hasBeast = players.some((p) => p.hasBeastBoat);
            const isFull = players.length >= 7;

            return (
              <div
                key={r.id}
                className="room-card"
                onClick={() => onJoinRoom(r.id)}
              >
                <div className="room-head">
                  <span className="room-host">👑 {r.host}</span>
                  <span className="timer-pill">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatTimer(r.expiresAt)}
                  </span>
                </div>

                <div className="room-stats">
                  <span className={`room-count ${isFull ? 'full' : ''}`}>
                    <Users className="w-3.5 h-3.5 inline mr-1" /> {players.length}/7 Players
                  </span>
                  <span className={`room-beast ${hasBeast ? 'yes' : 'no'}`}>
                    <Ship className="w-3.5 h-3.5 inline mr-1" />
                    {hasBeast ? '🚢 Beast Hunter Available!' : '❌ No Beast Hunter'}
                  </span>
                </div>

                <button
                  className={`btn-join ${isFull ? 'full' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isFull) onJoinRoom(r.id);
                  }}
                >
                  {isFull ? 'Room Full 😔' : 'Join Room →'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};
