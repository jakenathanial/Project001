import React, { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  dbFS,
  dbRT,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  User,
} from './lib/firebase';
import {
  UserProfile,
  FruitItem,
  TradeListing,
  CounterOffer,
  HuntRoom,
  ChatMessage,
} from './types';
import { INITIAL_FRUITS } from './data/defaultFruits';
import { HeaderNav } from './components/HeaderNav';
import { FooterNav } from './components/FooterNav';
import { GuestModal } from './components/GuestModal';
import { FruitPickerModal } from './components/FruitPickerModal';
import { TradeDetailModal } from './components/TradeDetailModal';
import { HomeView } from './views/HomeView';
import { DestinationView } from './views/DestinationView';
import { RoomView } from './views/RoomView';
import { TradeView } from './views/TradeView';
import { AdminView } from './views/AdminView';
import { AboutView, ContactView, PrivacyView, TermsView } from './views/InfoViews';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);

  // App Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [tradeSubView, setTradeSubView] = useState<'feed' | 'post'>('feed');
  const [currentDest, setCurrentDest] = useState<'Tiki Outpost' | 'Hydra Island'>('Tiki Outpost');

  // Beast Hunter boat preference
  const [myBoat, setMyBoat] = useState<boolean>(false);

  // Fruit catalog
  const [fruits, setFruits] = useState<FruitItem[]>(INITIAL_FRUITS);

  // Hunt Rooms (Realtime Database)
  const [rooms, setRooms] = useState<HuntRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<HuntRoom | null>(null);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [creatingRoom, setCreatingRoom] = useState<boolean>(false);

  // Trades & Offers (Firestore)
  const [trades, setTrades] = useState<TradeListing[]>([]);
  const [tradeDetailId, setTradeDetailId] = useState<string | null>(null);
  const [tradeDetail, setTradeDetail] = useState<TradeListing | null>(null);
  const [tradeOffers, setTradeOffers] = useState<CounterOffer[]>([]);
  const [showTradeDetailModal, setShowTradeDetailModal] = useState<boolean>(false);

  // Trade posting form state
  const [offeringSlots, setOfferingSlots] = useState<FruitItem[]>([]);
  const [wantingSlots, setWantingSlots] = useState<FruitItem[]>([]);
  const [counterOffering, setCounterOffering] = useState<FruitItem[]>([]);
  const [postingTrade, setPostingTrade] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>('');

  // Fruit Picker modal state
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerTarget, setPickerTarget] = useState<{
    mode: 'trade' | 'counter';
    side?: 'offer' | 'want';
    slotIdx: number;
  } | null>(null);

  // 1. Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: User | null) => {
      if (fbUser) {
        setAuthChecking(false);
        const userRef = doc(dbFS, 'users', fbUser.uid);
        try {
          const snap = await getDoc(userRef);
          let boatPref = false;
          if (snap.exists()) {
            boatPref = snap.data().hasBeastBoat === true;
          } else {
            await setDoc(userRef, {
              uid: fbUser.uid,
              name: fbUser.displayName || 'Player',
              photo: fbUser.photoURL || '',
              hasBeastBoat: false,
              email: fbUser.email || '',
            });
          }
          setMyBoat(boatPref);
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Player',
            photoURL: fbUser.photoURL || '',
            hasBeastBoat: boatPref,
            email: fbUser.email,
            isGuest: false,
          });
        } catch (e) {
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Player',
            photoURL: fbUser.photoURL || '',
            hasBeastBoat: false,
            email: fbUser.email,
            isGuest: false,
          });
        }
      } else {
        setAuthChecking(false);
      }
    });

    return () => unsub();
  }, []);

  // 2. Real-time Fruits Listener & Initial Seed
  useEffect(() => {
    const q = collection(dbFS, 'fruits');
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const items: FruitItem[] = [];
          snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
          setFruits(items);
        } else {
          // If Firestore is empty, attempt to seed default fruits so catalog is ready
          INITIAL_FRUITS.forEach(async (f) => {
            try {
              await setDoc(doc(dbFS, 'fruits', f.id), {
                name: f.name,
                value: f.value,
                photo: f.photo,
                rarity: f.rarity,
                type: f.type,
              });
            } catch (e) {}
          });
        }
      },
      (err) => {
        console.error('[FRUITS_LISTENER]', err);
      }
    );

    return () => unsub();
  }, []);

  // 3. Optimized Trades Listener (no composite index errors!)
  useEffect(() => {
    // Query trades ordered by createdAt descending. Simple single-field order does NOT require composite indexes!
    const q = query(collection(dbFS, 'trades'), orderBy('createdAt', 'desc'), limit(100));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: TradeListing[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
        setTrades(list);
      },
      (err) => {
        console.error('[TRADES_LISTENER]', err);
      }
    );

    return () => unsub();
  }, []);

  // 4. Real-time Rooms Listener for Current Destination
  useEffect(() => {
    if (currentView !== 'destination' && currentView !== 'room') return;

    const roomsRef = ref(dbRT, 'rooms');
    const callback = onValue(roomsRef, (snap) => {
      if (snap.exists()) {
        const now = Date.now();
        const list: HuntRoom[] = [];
        snap.forEach((child) => {
          const rm = { id: child.key!, ...child.val() } as HuntRoom;
          if (rm.expiresAt && rm.expiresAt < now) {
            remove(ref(dbRT, `rooms/${child.key}`));
          } else if (rm.destination === currentDest) {
            list.push(rm);
          }
        });
        setRooms(list);
      } else {
        setRooms([]);
      }
    });

    return () => {
      off(roomsRef, 'value', callback);
    };
  }, [currentDest, currentView]);

  // 5. Active Room Listener & Chat Listener
  useEffect(() => {
    if (!currentRoomId) return;

    const roomRef = ref(dbRT, `rooms/${currentRoomId}`);
    const roomCb = onValue(roomRef, (snap) => {
      if (!snap.exists()) {
        setCurrentRoomId(null);
        setCurrentRoom(null);
        if (currentView === 'room') setCurrentView('destination');
        return;
      }
      const rm = { id: currentRoomId, ...snap.val() } as HuntRoom;
      if (rm.expiresAt && rm.expiresAt < Date.now()) {
        remove(roomRef);
        setCurrentRoomId(null);
        setCurrentRoom(null);
        if (currentView === 'room') setCurrentView('destination');
        return;
      }
      setCurrentRoom(rm);
    });

    const chatRef = ref(dbRT, `chat/${currentRoomId}`);
    const chatCb = onValue(chatRef, (snap) => {
      if (snap.exists()) {
        const msgs: ChatMessage[] = [];
        snap.forEach((child) => {
          msgs.push({ id: child.key!, ...child.val() });
        });
        setRoomMessages(msgs);
      } else {
        setRoomMessages([]);
      }
    });

    return () => {
      off(roomRef, 'value', roomCb);
      off(chatRef, 'value', chatCb);
    };
  }, [currentRoomId, currentView]);

  // 6. Active Trade Detail & Offers Listener
  useEffect(() => {
    if (!tradeDetailId || !showTradeDetailModal) return;

    const tradeDocRef = doc(dbFS, 'trades', tradeDetailId);
    const unsubDoc = onSnapshot(tradeDocRef, (snap) => {
      if (snap.exists()) {
        setTradeDetail({ id: snap.id, ...(snap.data() as any) });
      } else {
        setTradeDetail(null);
      }
    });

    const offersQuery = query(
      collection(dbFS, 'offers'),
      where('tradeId', '==', tradeDetailId),
      orderBy('createdAt', 'asc')
    );

    const unsubOffers = onSnapshot(
      offersQuery,
      (snap) => {
        const list: CounterOffer[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
        setTradeOffers(list);
      },
      (err) => {
        console.error('[OFFERS_LISTENER]', err);
      }
    );

    return () => {
      unsubDoc();
      unsubOffers();
    };
  }, [tradeDetailId, showTradeDetailModal]);

  // Auth Handlers
  const handleGoogleLogin = async () => {
    setLoginError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      if (e.code === 'auth/popup-blocked') {
        setLoginError('⚠️ Popup was blocked. Please allow popups for this site.');
      } else if (e.code === 'auth/popup-closed-by-user') {
        setLoginError('Sign-in cancelled. Try again!');
      } else {
        setLoginError('Sign-in error: ' + (e.message || e.code));
      }
    }
  };

  const handleGuestConfirm = (guestName: string) => {
    setShowGuestModal(false);
    setUser({
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: guestName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(guestName)}`,
      hasBeastBoat: false,
      isGuest: true,
    });
    setMyBoat(false);
  };

  const handleLogout = async () => {
    if (user?.isGuest) {
      setUser(null);
    } else {
      await signOut(auth);
      setUser(null);
    }
  };

  // Toggle Beast Hunter Boat
  const handleToggleBoat = async () => {
    const nextVal = !myBoat;
    setMyBoat(nextVal);
    if (user) {
      setUser({ ...user, hasBeastBoat: nextVal });
      if (!user.isGuest) {
        try {
          await updateDoc(doc(dbFS, 'users', user.uid), { hasBeastBoat: nextVal });
        } catch (e) {}
      }
    }
  };

  // Hunt Room Actions
  const handleSelectDestination = (dest: 'Tiki Outpost' | 'Hydra Island') => {
    setCurrentDest(dest);
    setCurrentView('destination');
  };

  const handleCreateRoom = async () => {
    if (!user) return;
    setCreatingRoom(true);
    const now = Date.now();
    const newRoomRef = push(ref(dbRT, 'rooms'));
    const rid = newRoomRef.key!;

    try {
      await set(newRoomRef, {
        destination: currentDest,
        host: user.displayName,
        hostUid: user.uid,
        createdAt: now,
        expiresAt: now + 3600000, // 1 hour expiration
        players: {
          [user.uid]: {
            uid: user.uid,
            name: user.displayName,
            hasBeastBoat: myBoat,
          },
        },
      });
      setCurrentRoomId(rid);
      setCurrentView('room');
    } catch (e: any) {
      alert("Couldn't create room: " + e.message);
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleJoinRoom = async (rid: string) => {
    if (!user) return;
    try {
      const snap = await get(ref(dbRT, `rooms/${rid}`));
      if (!snap.exists()) {
        alert("Room doesn't exist!");
        return;
      }
      const r = snap.val();
      const players = r.players ? Object.values(r.players) : [];
      if (players.length >= 7 && (!r.players || !r.players[user.uid])) {
        alert('Room is full (7/7)!');
        return;
      }

      await update(ref(dbRT, `rooms/${rid}/players`), {
        [user.uid]: {
          uid: user.uid,
          name: user.displayName,
          hasBeastBoat: myBoat,
        },
      });
      setCurrentRoomId(rid);
      setCurrentView('room');
    } catch (e: any) {
      alert("Couldn't join room: " + e.message);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoomId || !user) return;
    try {
      await remove(ref(dbRT, `rooms/${currentRoomId}/players/${user.uid}`));
      const snap = await get(ref(dbRT, `rooms/${currentRoomId}/players`));
      if (!snap.exists() || !Object.keys(snap.val() || {}).length) {
        await remove(ref(dbRT, `rooms/${currentRoomId}`));
      }
    } catch (e) {}
    setCurrentRoomId(null);
    setCurrentRoom(null);
    setCurrentView('destination');
  };

  const handleSendRoomMsg = async (text: string) => {
    if (!currentRoomId || !user) return;
    try {
      const newMsgRef = push(ref(dbRT, `chat/${currentRoomId}`));
      await set(newMsgRef, {
        uid: user.uid,
        name: user.displayName,
        text,
        ts: Date.now(),
      });
    } catch (e) {}
  };

  // Trade Actions
  const handleOpenPickerModal = (mode: 'trade' | 'counter', side?: 'offer' | 'want', slotIdx: number = 0) => {
    setPickerTarget({ mode, side, slotIdx });
    setShowPicker(true);
  };

  const handleSelectFruitFromPicker = (fruit: FruitItem) => {
    if (!pickerTarget) return;
    const { mode, side, slotIdx } = pickerTarget;

    if (mode === 'trade') {
      if (side === 'offer') {
        const next = [...offeringSlots];
        next[slotIdx] = fruit;
        setOfferingSlots(next);
      } else {
        const next = [...wantingSlots];
        next[slotIdx] = fruit;
        setWantingSlots(next);
      }
    } else if (mode === 'counter') {
      const next = [...counterOffering];
      next[slotIdx] = fruit;
      setCounterOffering(next);
    }
  };

  const handleRemoveSlot = (side: 'offer' | 'want', idx: number) => {
    if (side === 'offer') {
      const next = [...offeringSlots];
      next.splice(idx, 1);
      setOfferingSlots(next);
    } else {
      const next = [...wantingSlots];
      next.splice(idx, 1);
      setWantingSlots(next);
    }
  };

  const handlePostTrade = async (offering: FruitItem[], wanting: FruitItem[], note: string) => {
    if (!user || user.isGuest) {
      alert('Sign in to post a trade!');
      return;
    }
    if (!offering.length) {
      setPostError("Pick at least one fruit you're offering.");
      return;
    }
    if (!wanting.length && !note) {
      setPostError('Specify what you want in return or write a note.');
      return;
    }

    setPostingTrade(true);
    setPostError('');

    try {
      // Check active trades using getDocs (fast and deadlock free)
      const qCheck = query(
        collection(dbFS, 'trades'),
        where('ownerId', '==', user.uid),
        where('status', '==', 'open')
      );
      const existSnap = await getDocs(qCheck);
      if (!existSnap.empty) {
        setPostError('⚠️ You already have an active trade! Cancel it before posting a new one.');
        setPostingTrade(false);
        return;
      }

      const docRef = await addDoc(collection(dbFS, 'trades'), {
        ownerId: user.uid,
        username: user.displayName,
        offering: offering.map((f) => ({
          name: f.name,
          rarity: f.rarity,
          photo: f.photo || '',
          value: f.value || 0,
        })),
        wanting: {
          fruits: wanting.map((f) => ({
            name: f.name,
            rarity: f.rarity,
            photo: f.photo || '',
            value: f.value || 0,
          })),
          note,
        },
        status: 'open',
        createdAt: serverTimestamp(),
      });

      setOfferingSlots([]);
      setWantingSlots([]);
      setTradeSubView('feed');
      setTradeDetailId(docRef.id);
      setShowTradeDetailModal(true);
    } catch (e: any) {
      setPostError('Failed to post trade: ' + (e.message || e));
    } finally {
      setPostingTrade(false);
    }
  };

  const handleCancelTrade = async (tradeId: string) => {
    if (!confirm('Cancel this trade listing?')) return;
    try {
      await updateDoc(doc(dbFS, 'trades', tradeId), {
        status: 'closed',
        closedWith: null,
      });
      if (tradeDetailId === tradeId) {
        setShowTradeDetailModal(false);
      }
    } catch (e: any) {
      alert("Couldn't cancel trade: " + e.message);
    }
  };

  const handleSendOffer = async (type: 'accept' | 'counter', offering: any[], note: string) => {
    if (!user || user.isGuest || !tradeDetailId) return;

    await addDoc(collection(dbFS, 'offers'), {
      ownerId: user.uid,
      tradeId: tradeDetailId,
      username: user.displayName,
      type,
      offering: offering.map((f) => ({
        name: f.name,
        rarity: f.rarity,
        photo: f.photo || '',
        value: f.value || 0,
      })),
      note,
      createdAt: serverTimestamp(),
    });
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!tradeDetailId) return;
    try {
      await updateDoc(doc(dbFS, 'trades', tradeDetailId), {
        status: 'closed',
        closedWith: offerId,
      });
    } catch (e: any) {
      alert("Couldn't accept offer: " + e.message);
    }
  };

  // Admin Actions
  const handleAddFruit = async (newFruit: Omit<FruitItem, 'id'>) => {
    const docRef = await addDoc(collection(dbFS, 'fruits'), {
      ...newFruit,
      addedAt: serverTimestamp(),
    });

    // Instant optimistic update
    setFruits((prev) => [...prev, { id: docRef.id, ...newFruit }]);
  };

  const handleDeleteFruit = async (id: string) => {
    await deleteDoc(doc(dbFS, 'fruits', id));
    setFruits((prev) => prev.filter((f) => f.id !== id));
  };

  // Unauthenticated Screen
  if (!user) {
    return (
      <div id="app">
        <div className="login-wrap">
          <div className="login-glow"></div>
          <div className="login-box">
            <span className="login-fruit">🍊</span>
            <div className="login-title">RentAFruit</div>
            <div className="login-sub">LEVIATHAN HUNT & TRADING</div>
            <p className="login-desc">
              Team up, trade fruits, and take down the Leviathan! 🐉
            </p>

            <button
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={authChecking}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.3 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.4l7.8 6C12.3 13.2 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.6c0-1.5-.1-3-.4-4.4H24v8.3h12.4c-.5 2.7-2.1 5-4.4 6.5l6.9 5.4c4-3.7 6.2-9.2 6.2-15.8z" />
                <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.6l7.8-6z" />
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-6.9-5.4c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.7-3.7-13.5-9.1l-7.8 6C6.7 42.6 14.7 48 24 48z" />
              </svg>
              Sign in with Google
            </button>

            <div className="divider"><span>OR</span></div>

            <button
              className="btn-guest"
              onClick={() => setShowGuestModal(true)}
            >
              👤 Continue as Guest
            </button>

            {loginError && (
              <div className="login-err" style={{ display: 'block' }}>
                {loginError}
              </div>
            )}
          </div>
        </div>

        <GuestModal
          isOpen={showGuestModal}
          onClose={() => setShowGuestModal(false)}
          onConfirm={handleGuestConfirm}
        />
      </div>
    );
  }

  return (
    <div id="app">
      <HeaderNav
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      {currentView === 'home' && (
        <HomeView
          user={user}
          myBoat={myBoat}
          onToggleBoat={handleToggleBoat}
          onSelectDestination={handleSelectDestination}
        />
      )}

      {currentView === 'destination' && (
        <DestinationView
          destination={currentDest}
          rooms={rooms}
          onBack={() => setCurrentView('home')}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          creating={creatingRoom}
        />
      )}

      {currentView === 'room' && currentRoom && (
        <RoomView
          room={currentRoom}
          messages={roomMessages}
          currentUser={user}
          onLeaveRoom={handleLeaveRoom}
          onSendMessage={handleSendRoomMsg}
        />
      )}

      {currentView === 'trade' && (
        <TradeView
          subView={tradeSubView}
          trades={trades}
          currentUser={user}
          onNavigateSubView={setTradeSubView}
          onOpenTradeDetail={(id) => {
            setTradeDetailId(id);
            setShowTradeDetailModal(true);
          }}
          onCancelTrade={handleCancelTrade}
          onPostTrade={handlePostTrade}
          onOpenPicker={(side, idx) => handleOpenPickerModal('trade', side, idx)}
          offeringSlots={offeringSlots}
          wantingSlots={wantingSlots}
          onRemoveSlot={handleRemoveSlot}
          posting={postingTrade}
          postError={postError}
        />
      )}

      {currentView === 'admin' && (
        <AdminView
          user={user}
          fruits={fruits}
          onAddFruit={handleAddFruit}
          onDeleteFruit={handleDeleteFruit}
        />
      )}

      {currentView === 'about' && <AboutView />}
      {currentView === 'contact' && <ContactView />}
      {currentView === 'privacy' && <PrivacyView />}
      {currentView === 'terms' && <TermsView />}

      <FooterNav onNavigate={setCurrentView} />

      {/* Modals */}
      <FruitPickerModal
        isOpen={showPicker}
        fruits={fruits}
        onClose={() => setShowPicker(false)}
        onSelectFruit={handleSelectFruitFromPicker}
      />

      <TradeDetailModal
        trade={tradeDetail}
        offers={tradeOffers}
        currentUser={user}
        isOpen={showTradeDetailModal}
        onClose={() => setShowTradeDetailModal(false)}
        onSendOffer={handleSendOffer}
        onAcceptOffer={handleAcceptOffer}
        onCancelTrade={handleCancelTrade}
        onOpenPicker={() => handleOpenPickerModal('counter', undefined, counterOffering.length)}
        counterOffering={counterOffering}
        onRemoveCounterSlot={(idx) => {
          const next = [...counterOffering];
          next.splice(idx, 1);
          setCounterOffering(next);
        }}
      />
    </div>
  );
}
