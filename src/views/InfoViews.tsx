import React, { useState } from 'react';
import { Mail, Send, Info, Shield, ScrollText } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <main className="main">
      <div className="cp">
        <h1>About RentAFruit</h1>
        <p className="cp-sub">COMMUNITY TOOL FOR BLOX FRUITS PLAYERS</p>

        <div className="cs">
          <h2>🍊 What is RentAFruit?</h2>
          <p>
            RentAFruit is a free, fast community matchmaking platform for Blox Fruits players. Find hunt partners, coordinate Leviathan raids, and trade Devil Fruits & Gamepasses in real time.
          </p>
        </div>

        <div className="cs">
          <h2>🐉 Leviathan Hunt System</h2>
          <p>
            The Leviathan requires team coordination with up to 7 players and a Beast Hunter Boat. Create or join rooms at Tiki Outpost or Hydra Island with live 1-hour timers.
          </p>
        </div>

        <div className="cs">
          <h2>🔄 Trading System</h2>
          <p>
            Post what you're offering and what you want back. Other players can accept directly or propose counter offers on the live trade board thread.
          </p>
        </div>

        <div className="cs">
          <h2>👥 Community Built</h2>
          <p>
            Fan-made tool, not affiliated with Roblox Corporation or the Blox Fruits team.
          </p>
          <div className="info-chips">
            <span className="ic">🆓 Free</span>
            <span className="ic">⚡ Real-Time</span>
            <span className="ic">📱 Mobile Friendly</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill all fields!');
      return;
    }
    setSent(true);
  };

  return (
    <main className="main">
      <div className="cp">
        <h1>Contact Us</h1>
        <p className="cp-sub">WE'D LOVE TO HEAR FROM YOU</p>

        <div className="cs">
          <h2>✉️ Direct Email</h2>
          <p>Have a question, feedback, or suggestion? Reach us at:</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '8px' }}>
            <li style={{ marginBottom: '6px' }}>
              📧 <strong style={{ color: 'var(--purple)' }}>jakelordclash@gmail.com</strong>
            </li>
            <li>
              📧 <strong style={{ color: 'var(--purple)' }}>calvinthomasvinosh@gmail.com</strong>
            </li>
          </ul>
        </div>

        <div className="cs">
          <h2>📬 Send a Message</h2>
          {sent ? (
            <div style={{ color: 'var(--green)', fontWeight: 700, padding: '12px 0' }}>
              ✅ Thank you {name}! Your message has been sent. We'll reply to {email} soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                rows={5}
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="btn-cf">
                <Send className="w-4 h-4 inline mr-1" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export const PrivacyView: React.FC = () => {
  return (
    <main className="main">
      <div className="cp">
        <h1>Privacy Policy</h1>
        <p className="cp-sub">LAST UPDATED: AUGUST 2026</p>

        <div className="cs">
          <h2>📋 Overview</h2>
          <p>RentAFruit is committed to protecting user privacy.</p>
        </div>

        <div className="cs">
          <h2>🔐 Data We Collect</h2>
          <p>
            Google display name, profile photo URL, user ID, and Beast Hunter Boat preferences. Guest users only provide a chosen display name.
          </p>
        </div>

        <div className="cs">
          <h2>🔧 How We Use It</h2>
          <p>
            Solely to operate room matchmaking, chat, and live trade board features. We do not sell your data.
          </p>
        </div>

        <div className="cs">
          <h2>🗑 Data Deletion</h2>
          <p>
            Hunt rooms expire automatically after 1 hour. Trade listings can be cancelled anytime. Email jakelordclash@gmail.com to request account removal.
          </p>
        </div>
      </div>
    </main>
  );
};

export const TermsView: React.FC = () => {
  return (
    <main className="main">
      <div className="cp">
        <h1>Terms & Conditions</h1>
        <p className="cp-sub">PLEASE READ CAREFULLY</p>

        <div className="cs">
          <h2>📜 Acceptance</h2>
          <p>By using RentAFruit you agree to these Terms.</p>
        </div>

        <div className="cs">
          <h2>🎮 Platform Purpose</h2>
          <p>
            Fan-made Blox Fruits tool. Not affiliated with Roblox Corporation or the Blox Fruits team.
          </p>
        </div>

        <div className="cs">
          <h2>✅ Acceptable Use</h2>
          <p>
            No spam, harassment, hacking, impersonation, or real-money transactions.
          </p>
        </div>

        <div className="cs">
          <h2>⚖️ Disclaimer</h2>
          <p>
            RentAFruit is provided "as is". Not liable for any loss resulting from use of this platform.
          </p>
        </div>
      </div>
    </main>
  );
};
