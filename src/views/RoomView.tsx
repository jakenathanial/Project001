import React, { useState, useEffect, useRef } from 'react';
import { HuntRoom, ChatMessage, UserProfile, RoomPlayer } from '../types';
import { ArrowLeft, Send, Ship, Users, MessageSquare } from 'lucide-react';

interface RoomViewProps {
  room: HuntRoom;
  messages: ChatMessage[];
  currentUser: UserProfile | null;
  onLeaveRoom: () => void;
  onSendMessage: (text: string) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  messages,
  currentUser,
  onLeaveRoom,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTimer = () => {
      const rem = Math.max(0, room.expiresAt - Date.now());
      const m = Math.floor(rem / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setTimeLeft(`⏱ ${m}:${s < 10 ? '0' : ''}${s}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [room.expiresAt]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const players = room.players ? (Object.values(room.players) as RoomPlayer[]) : [];
  const hasBeast = players.some((p) => p.hasBeastBoat);

  return (
    <main className="main room-layout">
      <div>
        <div style={{ marginBottom: '14px' }}>
          <button className="btn-back" onClick={onLeaveRoom}>
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Leave Room
          </button>
        </div>

        <div className="room-title-row">
          <h2 className="room-h2">📍 {room.destination}</h2>
          <span className="room-timer-pill" id="rTimerPill">
            {timeLeft}
          </span>
        </div>

        <div className={`beast-banner ${hasBeast ? 'yes' : 'no'}`}>
          <Ship className="w-4 h-4 inline mr-1" />
          {hasBeast ? '🚢 BEAST HUNTER IS HERE!' : '❌ No Beast Hunter yet!'}
        </div>

        <div className="player-grid">
          {players.map((p) => {
            const isMe = p.uid === currentUser?.uid;
            return (
              <div key={p.uid} className={`p-chip ${isMe ? 'me' : ''}`}>
                <span className="p-name">{isMe ? '⭐ You' : p.name}</span>
                <span className={`p-boat ${p.hasBeastBoat ? 'yes' : 'no'}`}>
                  {p.hasBeastBoat ? '🚢' : '🚫'}
                </span>
              </div>
            );
          })}
          {Array(Math.max(0, 7 - players.length))
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-chip empty">
                Waiting...
              </div>
            ))}
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-head">
          <MessageSquare className="w-4 h-4 inline mr-1" /> Room Chat
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((m) => {
            const isMe = m.uid === currentUser?.uid;
            return (
              <div key={m.id || m.ts} className={`msg ${isMe ? 'me' : 'other'}`}>
                <span className="msg-who">{isMe ? 'You' : m.name}</span>
                <span className="msg-txt">{m.text}</span>
              </div>
            );
          })}
        </div>
        <div className="chat-foot">
          <input
            className="chat-input"
            placeholder="Say something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button className="btn-send" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
};
