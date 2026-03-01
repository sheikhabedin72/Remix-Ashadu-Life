import UmmahWallView from './components/UmmahWallView';
import UmmahConnectView from './components/UmmahConnectView';
import UmmahGatheringsView from './components/UmmahGatheringsView';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import UmmahNav from "./components/UmmahNav";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, Trophy, Map as MapIcon, BarChart3, Menu, Bell, X, ChevronLeft, Fingerprint, Home, LogIn, UserPlus, ShieldCheck, Zap, Crown, Loader2, Sparkles, Database, CloudOff, Terminal, ShoppingBag, Users, Scale, Lock
} from 'lucide-react';
import { Phrase, View, UserStats, UserProfile, ShieldType, Invitation, SystemSettings, AdminRole, Lesson, LegacyProject, Product } from './types';
import { INITIAL_PHRASES, INITIAL_PROJECTS, STORAGE_KEYS } from './constants';
import Counter from './components/Counter';
import Library from './components/Library';
import InsightView from './components/InsightView';
import ProfileView from './components/ProfileView';
import AmanahView from './components/AmanahView';
import RamadanTracker from './components/RamadanTracker';
import LeaderboardView from './components/LeaderboardView';
import NoorMap from './components/NoorMap';
import CirclesView from './components/CirclesView';
import ZakatCalculatorView from './components/ZakatCalculatorView';
import MainMenuView from './components/MainMenuView';
import SplashScreen from './components/SplashScreen';
import IdentityPortal from './components/IdentityPortal';
import EducationView from './components/EducationView';
import LedgerView from './components/LedgerView';
import LiveStreamTicker from './components/LiveStreamTicker';
import SyncBridge from './components/SyncBridge';
import BarakahReportView from './components/BarakahReportView';
import SalahGuideView from './components/SalahGuideView';
import TajweedView from './components/TajweedView';
import LegacyProjectsView from './components/LegacyProjectsView';
import MarketplaceView from './components/MarketplaceView';
import DashboardView from './components/DashboardView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import SettingsView from './components/SettingsView';
import AdminPanel from './components/AdminPanel';
import InvitationPortal from './components/InvitationPortal';
import { fetchCurrentLocation, reverseGeocode } from './services/locationService';
import { db } from './services/databaseService';
import { supabase, signOut, checkSystemStatus } from './services/supabaseService';

const INITIAL_SETTINGS: SystemSettings = {
  primaryColor: '#022c22',
  accentColor: '#C5A059',
  atmosphereColor: '#064e3b',
  circuitGlowColor: '#F59E0B',
  globalFont: 'Inter',
  maintenanceMode: false,
  maxCps: 10,
  masterOverride: false,
  features: {
    enableMarketplace: true,
    enableTajweed: true,
    enableEducation: true,
    enableLegacy: true,
    enableDiscovery: true,
    enableNoorMap: true,
    enableProximityAlerts: true,
    enableCircles: true,
    enableHeatmap: true
  },
  pricing: {
    fastMissedExcused: 10,
    fastMissedIntentional: 60,
    prayerMissed: 5
  },
  revenue: {
    marketplaceCommission: 15,
    premiumMonthlyPrice: 4.99,
    patronMonthlyPrice: 9.99,
    featuredPinMonthlyFee: 20,
    barakahSplit: 10,
    vaultBalance: 0
  },
  zakat: {
    goldPriceGram: 58.42,
    silverPriceGram: 0.72,
    nisabThresholdType: 'SILVER',
    fitrRatePerPerson: 5.00
  },
  metrics: {
    teaserImpressions: 0,
    churnRate: 0,
    barakahOverflow: 0
  },
  reports: {
    infographicTheme: 'Gold',
    impactMetric: 'Water',
    showQrCode: true,
    founderMessage: 'Consistency is the key to spiritual growth.'
  },
  themeEngine: 'celestial',
  activeSeason: 'NORMAL',
  showSpaceMode: true,
  planetVelocity: 1.0,
  moonPhase: 'crescent',
  starDensity: 50,
  effectIntensity: 1.0,
  tajweedConfidenceThreshold: 0.85,
  mapSearchRadius: 10,
  proximityAlertRadius: 2,
  silenceHoursStart: 23,
  silenceHoursEnd: 4,
  notificationPriority: 'High',
  alertCategoryTriggers: ['Mosque']
};

const App: React.FC = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [isPurifying, setIsPurifying] = useState(false);
  const [identityMode, setIdentityMode] = useState<'CHOICE' | 'LOGIN' | 'SIGNUP'>('CHOICE');
  const [view, setView] = useState<View>('dashboard'); 
  const [navigationStack, setNavigationStack] = useState<View[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>(() => {
    const saved = localStorage.getItem('ashadu_custom_phrases');
    return saved ? JSON.parse(saved) : INITIAL_PHRASES;
  });
  const [projects, setProjects] = useState<LegacyProject[]>(() => {
    const saved = localStorage.getItem('ashadu_legacy_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activePhrase, setActivePhrase] = useState<Phrase>(phrases[0] || INITIAL_PHRASES[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [showIdentityGate, setShowIdentityGate] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'Operational' | 'Offline'>('Operational');

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkSystemStatus();
      setSystemStatus(status);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [currentCity, setCurrentCity] = useState<string>('Detecting...');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cart, setCart] = useState<any[]>([]);
  
  // Pending invitations simulation
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch (e) { return INITIAL_SETTINGS; }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const defaultStats: UserStats = { 
      totalCount: 0, dailyLogs: [], streak: 0, shield: null, missedFastsCount: 5, missedPrayersCount: 12, kaffarahOwed: 50.00,
      impactPoints: 0, sabrPoints: 0, recitationSuccessCount: 0, educationCredits: 0, completedLessonIds: [], totalProjectDonations: 0,
      gardenPlants: [], fastingLog: {}, silenceGroupAlerts: false, zikrHistory: []
    };
    return defaultStats;
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ashadu_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const currentRole: AdminRole = userProfile?.email?.endsWith('ashadu.com') ? 'developer' : userProfile?.role || 'servant';

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch profile from user_data using user_id
        const { data: profile } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          localStorage.setItem('ashadu_user_profile', JSON.stringify(profile));
          setShowIdentityGate(false);
        } else {
          // If no profile exists yet, keep the gate open for signup completion
          setShowIdentityGate(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        localStorage.removeItem('ashadu_user_profile');
        setShowIdentityGate(true);
        setIdentityMode('LOGIN');
      }
    });

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setShowIdentityGate(true);
          setIdentityMode('LOGIN');
        }
      } catch (e) {
        console.warn("Auth session check failed. Defaulting to guest mode.");
        setShowIdentityGate(true);
        setIdentityMode('CHOICE');
      }
    };
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // MISSION INCREMENT LISTENER: Handle counts from mission-specific counters
  useEffect(() => {
    const handleMissionIncrement = () => {
      setStats(s => ({ ...s, totalCount: s.totalCount + 1 }));
    };
    window.addEventListener('ashadu_mission_increment', handleMissionIncrement);
    return () => window.removeEventListener('ashadu_mission_increment', handleMissionIncrement);
  }, []);

  // Handle incoming invitations via custom event
  useEffect(() => {
    const handleIncomingInvite = (e: any) => {
      const { invitation } = e.detail;
      if (invitation) {
        setPendingInvites(prev => [...prev, invitation]);
      }
    };
    window.addEventListener('ashadu_invite_received', handleIncomingInvite);
    return () => window.removeEventListener('ashadu_invite_received', handleIncomingInvite);
  }, []);

  useEffect(() => {
    const handleOpenIdentity = () => setShowIdentityGate(true);
    window.addEventListener('openIdentityPortal', handleOpenIdentity);
    return () => window.removeEventListener('openIdentityPortal', handleOpenIdentity);
  }, []);

  useEffect(() => {
    const initDB = async () => {
      const local = await db.getLocalStats();
      if (local) {
        setStats(local);
        setCount(local.totalCount % target);
      }
    };
    initDB();
  }, [userProfile, target]);

  useEffect(() => {
    const syncLocation = async () => {
      try {
        const pos = await fetchCurrentLocation();
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        const { city } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setCurrentCity(city || "Unknown Location");
        setGpsActive(true);
      } catch (e) {
        setCurrentCity(userProfile?.city || "London");
        setGpsActive(false);
      }
    };
    syncLocation();
  }, [userProfile]);

  useEffect(() => {
    if (isSplashComplete && !isPurifying) {
      db.localAutosave(stats);
      if (stats.totalCount % 33 === 0 && stats.totalCount > 0) {
        db.addZikrToLedger(activePhrase.transliteration, 33);
      }
    }
  }, [stats, isSplashComplete, isPurifying, activePhrase]);

  useEffect(() => {
    localStorage.setItem('ashadu_custom_phrases', JSON.stringify(phrases));
  }, [phrases]);

  useEffect(() => {
    localStorage.setItem('ashadu_legacy_projects', JSON.stringify(projects));
  }, [projects]);

  const location = useLocation();
  const navigate = useNavigate();

  // Sync view state with URL for legacy components that depend on it
  useEffect(() => {
    const path = location.pathname;
    let nextView: View = view;
    if (path === '/ummah/wall') nextView = 'ummah-wall';
    else if (path === '/ummah/connect') nextView = 'ummah-connect';
    else if (path === '/ummah/map') nextView = 'ummah-gatherings';
    else if (path === '/profile') nextView = 'profile';
    else if (path === '/ummah/dashboard') nextView = 'dashboard';
    else if (path === '/ummah/zakat') nextView = 'zakat-calculator';
    else if (path === '/ummah/legacy') nextView = 'legacy-hub';
    else if (path === '/ummah/sadaqa') nextView = 'marketplace';
    else if (path === '/ummah/ledger') nextView = 'ledger';
    else if (path === '/ummah/privacy') nextView = 'privacy';
    else if (path === '/ummah/salah') nextView = 'salah-guide';
    else if (path === '/ummah/ramadan') nextView = 'ramadan';
    else if (path === '/ummah/counter') nextView = 'counter';
    else if (path === '/ummah/library') nextView = 'library';
    else if (path === '/ummah/circles') nextView = 'circles';
    else if (path === '/settings') nextView = 'settings';
    else if (path === '/admin') nextView = 'admin-full';
    
    if (nextView !== view) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView(nextView);
    }
  }, [location.pathname, view]);

  const navigateTo = useCallback((nextView: View) => {
    setShowMenu(false);
    if (nextView === view) return;
    
    const primaryTabs: View[] = ['dashboard', 'ramadan', 'noor-map', 'circles', 'ledger', 'marketplace', 'zakat-calculator'];
    if (primaryTabs.includes(nextView)) setNavigationStack([]);
    else setNavigationStack(prev => [...prev, view]);
    
    setView(nextView);
    window.scrollTo(0, 0);

    // Sync URL
    if (nextView === 'ummah-wall') navigate('/ummah/wall');
    else if (nextView === 'ummah-connect') navigate('/ummah/connect');
    else if (nextView === 'ummah-gatherings' || nextView === 'noor-map') navigate('/ummah/map');
    else if (nextView === 'profile') navigate('/profile');
    else if (nextView === 'dashboard') navigate('/ummah/dashboard');
    else if (nextView === 'zakat-calculator') navigate('/ummah/zakat');
    else if (nextView === 'legacy-hub') navigate('/ummah/legacy');
    else if (nextView === 'marketplace') navigate('/ummah/sadaqa');
    else if (nextView === 'ledger') navigate('/ummah/ledger');
    else if (nextView === 'privacy') navigate('/ummah/privacy');
    else if (nextView === 'salah-guide') navigate('/ummah/salah');
    else if (nextView === 'ramadan') navigate('/ummah/ramadan');
    else if (nextView === 'counter') navigate('/ummah/counter');
    else if (nextView === 'library') navigate('/ummah/library');
    else if (nextView === 'circles') navigate('/ummah/circles');
    else if (nextView === 'settings') navigate('/settings');
    else if (nextView === 'admin-full') navigate('/admin');
  }, [view, navigate]);

  const goBack = useCallback(() => {
    if (navigationStack.length === 0) return;
    const prevView = navigationStack[navigationStack.length - 1];
    setNavigationStack(prev => prev.slice(0, -1));
    setView(prevView);
  }, [navigationStack]);

  const handleIncrement = useCallback(() => {
    setCount(prev => (prev + 1) % (target + 1));
    setStats(s => ({ ...s, totalCount: s.totalCount + 1 }));
    return true;
  }, [target]);

  const handleSignupSuccess = async (profile: UserProfile) => {
    setIsPurifying(true);
    setShowIdentityGate(false);
    await new Promise(resolve => setTimeout(resolve, 3500));
    const permanentStats = await db.migrateGuestToPermanent(stats, profile);
    db.refreshAuth();
    
    // Reset states to fresh values
    setPhrases(INITIAL_PHRASES);
    setProjects(INITIAL_PROJECTS);
    setStats(permanentStats);
    setUserProfile(profile);
    setCount(0);
    
    setIsPurifying(false);
    setView('dashboard');
  };

  const handleAcceptInvite = (id: string) => {
    const invite = pendingInvites.find(i => i.id === id);
    if (invite) {
      alert(`Mabrouk! You have joined the ${invite.groupName}. Your soul is now synchronized with the circle.`);
      // Logic would add to 'Joined Missions' in real app
      setPendingInvites(pendingInvites.filter(i => i.id !== id));
      navigateTo('circles');
    }
  };

  const handleRejectInvite = (id: string) => {
    setPendingInvites(pendingInvites.filter(i => i.id !== id));
  };

  const handleLogout = async () => {
    if (!userProfile) {
      alert("You are not logged in.");
      return;
    }
    if (window.confirm("Are you sure you want to log out? Your local progress will be preserved.")) {
      try {
        await signOut();
        localStorage.removeItem('ashadu_user_profile');
        setUserProfile(null);
        setView('dashboard');
        setNavigationStack([]);
      } catch (error: any) {
        alert(`Logout Error: ${error.message}`);
      }
    }
  };

  const handleUpdatePhrases = (newPhrases: Phrase[]) => {
    setPhrases(newPhrases);
    if (newPhrases.length > 0 && !newPhrases.find(p => p.id === activePhrase.id)) {
      setActivePhrase(newPhrases[0]);
    }
  };

  const handleCompleteLesson = (lesson: Lesson) => {
    setStats(prev => ({
      ...prev,
      educationCredits: prev.educationCredits + lesson.creditReward,
      completedLessonIds: [...prev.completedLessonIds, lesson.id]
    }));
    alert(`Mabrouk! You earned £${lesson.creditReward.toFixed(2)} in Sabr Credits.`);
  };

  const handleGrantCredits = (amount: number) => {
    setStats(prev => ({
      ...prev,
      educationCredits: (prev.educationCredits || 0) + amount
    }));
    alert(`Divine Grant Accepted: £${amount.toFixed(2)} added to Sabr Balance.`);
  };

  const handleAllocateCredits = (project: LegacyProject) => {
    if (stats.educationCredits <= 0) {
      alert("Insufficient Sabr Credits. Use the Divine Grant or master more lessons.");
      return;
    }
    const amount = stats.educationCredits;
    setStats(prev => ({
      ...prev,
      educationCredits: 0,
      totalProjectDonations: prev.totalProjectDonations + amount
    }));
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, raised: p.raised + amount } : p));
    alert(`Success! £${amount.toFixed(2)} allocated to ${project.name}. Ledger updated.`);
  };

  if (!isSplashComplete) return <SplashScreen onComplete={() => setIsSplashComplete(true)} />;
  
  if (isPurifying) {
    return (
      <div className="fixed inset-0 z-[2000] bg-[#022c22] flex flex-col items-center justify-center font-inter p-10 text-center animate-in fade-in duration-500">
        <div className="absolute inset-0 celestial-grid opacity-20 pointer-events-none" />
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#C5A059]/10 blur-[80px] rounded-full animate-ping opacity-30" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Anchoring Your Legacy...</h2>
        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 max-w-xs mx-auto leading-relaxed">
          Dropping Sandbox Tables • Anchoring Permanent Identity • Cloud Encryption Active
        </p>
        <div className="flex items-center gap-3 bg-emerald-950 px-6 py-3 rounded-full border border-[#C5A059]/20">
          <Loader2 size={14} className="text-[#C5A059] animate-spin" />
          <span className="text-[8px] font-black uppercase text-[#C5A059] tracking-widest">Handshaking Permanent Ledger</span>
        </div>
      </div>
    );
  }

  if (showIdentityGate) return <IdentityPortal onComplete={handleSignupSuccess} mandatory initialMode={identityMode} />;

  if (userProfile?.isFrozen) {
    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-10 text-center font-inter">
        <div className="w-24 h-24 bg-red-950/20 rounded-full flex items-center justify-center border border-red-500/30 mb-8 animate-pulse">
           <Lock size={48} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Account Frozen</h2>
        <p className="text-stone-500 text-xs uppercase tracking-[0.3em] max-w-xs leading-relaxed mb-10">
          Your access to the Ashadu ecosystem has been suspended by the Celestial Authority.
        </p>
        <button 
          onClick={handleLogout}
          className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl active:scale-95 transition-all"
        >
          LOG OUT
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative bg-[#022c22] text-white transition-all duration-700 font-inter">
      <div className="absolute inset-0 celestial-grid opacity-20 pointer-events-none" />

      {userProfile && (
        <SyncBridge 
          userId={userProfile.email} groupId="inv-001" stats={stats} groupConfig={{} as any} 
          onUpdateStats={setStats} onAdminCommand={(c, p) => c === 'RESET' ? setCount(0) : setTarget(p)}
        />
      )}

      {/* Incoming Invitations Modal Stack */}
      {pendingInvites.length > 0 && (
        <InvitationPortal 
          invitationData={pendingInvites[0]} 
          onAccept={handleAcceptInvite} 
          onReject={handleRejectInvite} 
        />
      )}

      <header className={`pt-8 pb-4 px-6 flex flex-col items-center gap-4 z-[200] backdrop-blur-md border-b border-[#C5A059]/30 transition-all duration-500 relative ${view === 'admin-full' ? 'bg-[#010e0b]/95' : 'bg-[#022c22]/90'}`}>
        <div className="w-full flex justify-between items-center max-w-lg relative">
          <div className="w-12 flex items-center">
             {!isOnline ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse" title="Logo Lock">
                </div>
             ) : (
                navigationStack.length > 0 && (
                   <button onClick={goBack} className="p-3 rounded-xl active:scale-90 border border-[#C5A059]/20 bg-emerald-900/50 text-[#C5A059] transition-all">BACK</button>
                )
             )}
          </div>

          <div className="flex-1 flex flex-col items-center">
              {!userProfile ? (
                <div className="flex items-center bg-[#064e3b] rounded-full p-1.5 border border-[#C5A059]/40 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                   <button onClick={() => { setIdentityMode('LOGIN'); setShowIdentityGate(true); }} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:bg-white/5 transition-all">LOGIN</button>
                   <button onClick={() => { setIdentityMode('SIGNUP'); setShowIdentityGate(true); }} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">SIGN UP</button>
                </div>
              ) : (
                <div className="flex items-center bg-[#064e3b] rounded-full p-1.5 border border-[#C5A059]/40 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                   <button onClick={handleLogout} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-white/5 transition-all">LOGOUT</button>
                </div>
              )}
              {userProfile && (
                 <div className="flex flex-col items-center gap-3 group cursor-pointer mt-4" onClick={() => navigateTo('profile')}>
                    <div className="text-center">
                       <p className="text-white font-black text-sm uppercase tracking-tight leading-none group-hover:text-[#C5A059] transition-colors">{userProfile.firstName}</p>
                       {currentRole !== 'servant' && (
                         <span className="text-[7px] font-black uppercase text-[#C5A059] tracking-widest mt-1.5 flex items-center justify-center gap-1.5">
                            {currentRole.toUpperCase()} AUTH
                         </span>
                       )}
                    </div>
                 </div>
              )}
          </div>

          <div className="w-12 flex justify-end">
             <button onClick={() => setShowMenu(true)} className="p-3 rounded-xl border border-[#C5A059]/30 bg-emerald-900/50 text-[#C5A059] active:scale-90 transition-all hover:bg-[#C5A059] hover:text-emerald-950">MENU</button>
          </div>
        </div>
      </header>

      <LiveStreamTicker totalUsers={142} totalRaised={stats.totalCount * 0.01 + 2450} outstanding={1000000 - stats.totalCount} />

      {showMenu && <MainMenuView onNavigate={navigateTo} onClose={() => setShowMenu(false)} />}

      {/* Guest Mode Floating Footer */}
      {userProfile?.isGuest && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-emerald-900/40 backdrop-blur-xl border border-[#C5A059]/30 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-[#C5A059]">
                <Sparkles size={16} />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-tight leading-tight">
                ✨ You're in Preview Mode! <br/>
                <span className="text-emerald-400">Sign up to save your progress forever.</span>
              </p>
            </div>
            <button 
              onClick={() => setShowIdentityGate(true)}
              className="px-4 py-2 bg-[#C5A059] text-emerald-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Join Ummah
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 relative overflow-hidden z-10 min-h-0 flex flex-col">
        <Routes>
          <Route path="/" element={<Navigate to="/ummah/dashboard" replace />} />
          <Route path="/ummah/dashboard" element={<DashboardView stats={stats} user={userProfile} settings={settings} onNavigate={navigateTo} location={{ city: currentCity, gpsActive, coords }} />} />
          <Route path="/ummah/wall" element={<UmmahWallView user={userProfile} />} />
          <Route path="/ummah/connect" element={<UmmahConnectView user={userProfile} />} />
          <Route path="/ummah/map" element={<UmmahGatheringsView user={userProfile} />} />
          <Route path="/ummah/zakat" element={<ZakatCalculatorView settings={settings} onNavigateToLegacy={() => navigateTo('legacy-hub')} />} />
          <Route path="/ummah/legacy" element={<LegacyProjectsView stats={stats} projects={projects} onUpdateProjects={setProjects} onAllocateCredits={handleAllocateCredits} onGrantCredits={handleGrantCredits} />} />
          <Route path="/ummah/sadaqa" element={<MarketplaceView stats={stats} cart={cart} systemSettings={settings} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onUpdateCartQuantity={(id, d) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onCheckout={() => {setCart([]); setView('ledger'); alert('Order placed! Your contributions are being routed.');}} />} />
          <Route path="/ummah/ledger" element={<LedgerView stats={stats} donationRate={0.01} onClearDebt={() => {}} onApplyEducationCredits={() => {}} pricing={settings.pricing} />} />
          <Route path="/ummah/privacy" element={<PrivacyPolicyView onBack={() => navigateTo('dashboard')} />} />
          <Route path="/ummah/salah" element={<SalahGuideView onComplete={(c) => setStats(prev => ({...prev, educationCredits: prev.educationCredits + c}))} coords={coords} />} />
          <Route path="/ummah/ramadan" element={<RamadanTracker stats={stats} user={userProfile} onUpdateStats={setStats} pricing={settings.pricing} />} />
          <Route path="/ummah/counter" element={<Counter count={count} target={target} phrase={activePhrase} onIncrement={handleIncrement} onReset={() => setCount(0)} onInsight={() => navigateTo('insight')} onSelectZikr={() => navigateTo('library')} onSetTarget={setTarget} streak={stats.streak} onJoinGroup={() => navigateTo('circles')} onSponsor={() => navigateTo('profile')} />} />
          <Route path="/ummah/library" element={<Library phrases={phrases} activeId={activePhrase.id} onSelect={(p) => { setActivePhrase(p); setView('counter'); }} onUpdatePhrases={handleUpdatePhrases} />} />
          <Route path="/ummah/circles" element={<CirclesView onNavigateToMission={() => navigateTo('amanah')} />} />
          <Route path="/profile" element={<ProfileView userProfile={userProfile} onUpdateProfile={setUserProfile} gardenPlants={stats.gardenPlants} settings={settings} stats={stats} onUpdateStats={setStats} />} />
          <Route path="/settings" element={<SettingsView user={userProfile} onNavigate={navigateTo} onLogout={handleLogout} />} />
          <Route path="/admin" element={<AdminPanel settings={settings} onUpdateSettings={setSettings} stats={stats} currentRole={currentRole} />} />
          
          {/* State-based views handled via a catch-all route that renders based on the 'view' state */}
          <Route path="*" element={
            <div className="flex-1 flex flex-col overflow-hidden">
              {view === 'counter' && <Counter count={count} target={target} phrase={activePhrase} onIncrement={handleIncrement} onReset={() => setCount(0)} onInsight={() => navigateTo('insight')} onSelectZikr={() => navigateTo('library')} onSetTarget={setTarget} streak={stats.streak} onJoinGroup={() => navigateTo('circles')} onSponsor={() => navigateTo('profile')} />}
              {view === 'library' && <Library phrases={phrases} activeId={activePhrase.id} onSelect={(p) => { setActivePhrase(p); setView('counter'); }} onUpdatePhrases={handleUpdatePhrases} />}
              {view === 'ramadan' && <RamadanTracker stats={stats} user={userProfile} onUpdateStats={setStats} pricing={settings.pricing} />}
              {view === 'noor-map' && <NoorMap settings={settings} />}
              {view === 'circles' && <CirclesView onNavigateToMission={() => navigateTo('amanah')} />}
              {view === 'ledger' && <LedgerView stats={stats} donationRate={0.01} onClearDebt={() => {}} onApplyEducationCredits={() => {}} pricing={settings.pricing} />}
              {view === 'insight' && <InsightView phrase={activePhrase} />}
              {view === 'settings' && <SettingsView user={userProfile} onNavigate={navigateTo} onLogout={handleLogout} />}
              {view === 'zakat-calculator' && <ZakatCalculatorView settings={settings} onNavigateToLegacy={() => navigateTo('legacy-hub')} />}
              {view === 'admin-full' && <AdminPanel settings={settings} onUpdateSettings={setSettings} stats={stats} currentRole={currentRole} />}
              {view === 'salah-guide' && <SalahGuideView onComplete={(c) => setStats(prev => ({...prev, educationCredits: prev.educationCredits + c}))} coords={coords} />}
              {view === 'tajweed' && <TajweedView onSuccess={(b) => setStats(prev => ({...prev, educationCredits: prev.educationCredits + b}))} />}
              {view === 'education' && <EducationView stats={stats} onCompleteLesson={handleCompleteLesson} />}
              {view === 'legacy-hub' && <LegacyProjectsView stats={stats} projects={projects} onUpdateProjects={setProjects} onAllocateCredits={handleAllocateCredits} onGrantCredits={handleGrantCredits} />}
              {view === 'marketplace' && <MarketplaceView stats={stats} cart={cart} systemSettings={settings} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onUpdateCartQuantity={(id, d) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onCheckout={() => {setCart([]); setView('ledger'); alert('Order placed! Your contributions are being routed.');}} />}
              {view === 'amanah' && <AmanahView totalCount={stats.totalCount} groupTarget={1000000} setGroupTarget={() => {}} donationRate={0.01} onUpdateGlobalZikr={() => {}} isModerator={userProfile?.role === 'admin'} user={userProfile} />}
              {view === 'privacy' && <PrivacyPolicyView onBack={() => navigateTo('dashboard')} />}
            </div>
          } />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className={`px-6 py-4 flex flex-col items-center gap-2 z-[150] border-t transition-colors duration-500 relative ${view === 'admin-full' ? 'bg-[#010e0b] border-white/5' : 'bg-[#022c22] border-[#C5A059]/10'}`}>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigateTo('privacy')}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 hover:text-[#C5A059] transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-emerald-900 text-[8px]">•</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-900">
            © 2026 Ashadu
          </span>
        </div>

        {/* System Status Indicator */}
        <div className="absolute right-6 bottom-4 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'Operational' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]'}`} />
          <span className={`text-[7px] font-black uppercase tracking-widest ${systemStatus === 'Operational' ? 'text-emerald-500' : 'text-rose-500'}`}>
            Systems: {systemStatus}
          </span>
        </div>
      </footer>

      {/* Global Navigation Bar */}
      <UmmahNav />
    </div>
  );
};

const NavButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${
    active ? 'text-[#C5A059]' : 'text-emerald-700 hover:text-white'
  }`}>
    <span className="text-[8px] font-black uppercase tracking-widest text-center">{label}</span>
  </button>
);

export default App;
