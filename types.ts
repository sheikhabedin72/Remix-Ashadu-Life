
export type AdminRole = 'servant' | 'admin' | 'developer';

export type LandmarkCategory = 'Mosque' | 'Madrasa' | 'Shop' | 'Service';

export type AppSeason = 'NORMAL' | 'RAMADAN' | 'EID';

export type SubscriptionTier = 'ABID' | 'MUMIN' | 'MUHSIN';

export type ReportTimeframe = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type DonationPillar = 'DIRECT' | 'PENNY_PER_ZIKR' | 'PER_USER' | 'ZIKR_ONLY' | 'ZIKR_AND_DONATE' | 'PROXY_ZIKR';

export type ShieldType = 'BRONZE_CRESCENT' | 'SILVER_STAR' | 'GOLDEN_SHIELD' | 'DIAMOND_FANOUS' | null;

export type TransactionStatus = 'Processing' | 'Verified' | 'Distributed';
export type TransactionType = 'Zakat' | 'Zikr' | 'Sponsorship' | 'Sadaqah';

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'SUCCESS' | 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
}

export interface SystemHealth {
  dbLatency: string;
  activeGuests: number;
  lastPurge: string;
  apiStatus: 'OPTIMAL' | 'DEGRADED' | 'OFFLINE';
}

export interface LedgerTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}

export interface DBMetadata {
  version: string;
  lastBackup: string;
  encryptionStatus: 'ACTIVE' | 'PENDING';
  tier: 'LOCAL' | 'CLOUD';
}

export interface DonationEvent {
  id: string;
  name: string;
  amount: number;
  optionType: string;
  timestamp: string;
}

export interface NotificationRecord {
  id: string;
  message: string;
  timestamp: string;
  type: 'MANUAL' | 'MILESTONE' | 'SCHEDULED' | 'INACTIVITY';
}

export interface SyncStatus {
  lastSyncedAt: string;
  pendingCounts: number;
  isOnline: boolean;
  dbTier: 'LOCAL_ONLY' | 'HYBRID_SYNCED';
}

export interface ZikrSessionRecord {
  id: string;
  groupName: string;
  date: string;
  count: number;
  impact: number;
  target: number;
  status: 'COMPLETED' | 'ACTIVE' | 'ARCHIVED';
  isAdmin: boolean;
}

export interface Invitation {
  id: string;
  adminName: string;
  groupName: string;
  description: string;
  customZikr: string;
  target: number;
  endDate: string;
  fundraisingOption: DonationPillar;
}

export interface BarakahReportData {
  timeframe: ReportTimeframe;
  zikrVelocity: number;
  streakDays: number;
  waterLitersFunded: number;
  communityTotal: string;
  mosquesVisited: number;
  businessesSupported: number;
  tajweedImprovement: number;
  legacyImpact: string;
  globalRank: string;
}

export interface ZakatRecord {
  id: string;
  date: string;
  customName: string;
  category: string;
  assetValue: number;
  zakatDue: number;
  amountPaid: number;
  status: 'SETTLED' | 'PENDING';
}

export interface ZakatFitrRecord {
  id: string;
  name: string;
  amount: number;
  status: 'PAID' | 'UNPAID';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  creditReward: number;
  category: string;
  isLocked?: boolean;
}

export interface SalahStep {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  postureEmoji: string;
  keywords: string[];
}

export interface LegacyProject {
  id: string;
  name: string;
  description: string;
  category: 'Water' | 'Nature' | 'Education' | 'Masjid' | 'Food Pack' | 'Winter Pack' | 'Orphanage' | 'Disaster Appeal' | 'Sponsorship' | 'Medical' | 'Build a Shelter' | 'Sadaqa';
  icon: string;
  target: number;
  raised: number;
  isUrgent?: boolean;
  lastUpdated?: string;
}

export interface LocationLandmark {
  id: string;
  name: string;
  category: LandmarkCategory;
  lat: number;
  lng: number;
  address: string;
  description: string;
  isVerified: boolean;
  isFeatured?: boolean; 
  jamaatTimes?: string[];
  enrollmentStatus?: 'Open' | 'Closed' | 'Waitlist';
  hasWuduFacility?: boolean;
  hasSistersSection?: boolean;
  hasWheelchairAccess?: boolean;
  amanahScore: number;
  vouchCount: number;
  flagCount: number;
}

export interface ZikrCircle {
  id: string;
  name: string;
  creatorName: string;
  target: number;
  currentCount: number;
  members: string[];
  isOfficial?: boolean;
  color: string;
}

export interface Phrase {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface ZikrLog {
  date: string;
  count: number;
}

export interface Sponsorship {
  id: string;
  counterName: string;
  ratePerZikr: number;
  currentTotal: number;
  maxCap: number;
  active: boolean;
}

export interface GroupConfig {
  name: string;
  description: string;
  target: number;
  startDate: string;
  deadline: string;
  zikrType: string;
  allowPeerInvites: boolean;
  isCustomZikr: boolean;
  customZikrName: string;
  sadaqahPerPrayer: number;
  selectedPillar: DonationPillar;
  enableMilestones: boolean;
  enableInactivityAlerts: boolean;
  enableFajrReminders: boolean;
  enableDeadlineReminders: boolean;
  notificationHistory: NotificationRecord[];
  lastMasterSync?: string;
}

export interface ParticipantAssignment {
  id: string;
  name: string;
  target: number;
  completed: number;
  sponsorName?: string;
  sponsoredAmount?: number;
  isProxy?: boolean;
  proxyUser?: string;
  status?: 'INVITED' | 'ACCEPTED' | 'REJECTED';
}

export interface UserStats {
  totalCount: number;
  dailyLogs: ZikrLog[];
  streak: number;
  shield: ShieldType;
  missedFastsCount: number;
  missedPrayersCount: number;
  kaffarahOwed: number; 
  impactPoints: number;
  sabrPoints: number;
  recitationSuccessCount: number;
  educationCredits: number;
  completedLessonIds: string[];
  totalProjectDonations: number;
  gardenPlants: GardenPlant[];
  isRestricted?: boolean;
  isShadowbanned?: boolean;
  violationCount?: number;
  offlineQueue?: { type: 'zikr' | 'tajweed' | 'lesson'; amount: number; timestamp: number }[];
  welcomeShown?: boolean;
  fastingLog?: Record<string, 'completed' | 'missed-excused' | 'missed-intentional'>;
  dailyPrayers?: Record<string, Record<string, 'completed' | 'missed' | 'none'>>;
  quranJuzProgress?: number;
  dailySunnah?: Record<string, Record<string, boolean>>;
  silenceGroupAlerts?: boolean;
  syncStatus?: SyncStatus;
  zikrHistory?: ZikrSessionRecord[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  full_name?: string;
  bio?: string;
  website_url?: string;
  username?: string;
  age?: number;
  aboutMe?: string;
  profilePicture?: string;
  gems?: number;
  visits?: number;
  likes?: number;
  email: string;
  phone: string;
  city: string;
  zipcode: string;
  isRegistered: boolean;
  avatarColor: string;
  milestoneReached?: boolean;
  isAnonymous: boolean;
  isPremium?: boolean; 
  tier?: SubscriptionTier;
  accessLevel?: number;
  lastRecovery?: string;
  role: AdminRole;
  isGuest?: boolean;
  businessName?: string;
  businessBio?: string;
  isVerifiedMerchant?: boolean;
  isEmailVerified?: boolean;
  isEmailPending?: boolean;
  isFrozen?: boolean;
  commissionRate?: number;
  hasTrustBadge?: boolean;
  kycDocumentUrl?: string;
}

export interface SystemSettings {
  primaryColor: string;
  accentColor: string;
  atmosphereColor: string;
  circuitGlowColor: string;
  globalFont: string;
  maintenanceMode: boolean;
  maxCps: number;
  masterOverride: boolean;
  features: FeatureFlags;
  pricing: GlobalPricing;
  revenue: {
    marketplaceCommission: number;
    premiumMonthlyPrice: number;
    patronMonthlyPrice: number;
    featuredPinMonthlyFee: number;
    barakahSplit: number;
    vaultBalance: number;
  };
  zakat: {
    goldPriceGram: number;
    silverPriceGram: number;
    nisabThresholdType: 'GOLD' | 'SILVER';
    fitrRatePerPerson: number;
  };
  metrics: {
    teaserImpressions: number;
    churnRate: number;
    barakahOverflow: number;
  };
  reports: {
    infographicTheme: 'Cyan' | 'Gold' | 'RoseGold';
    impactMetric: 'Water' | 'Trees' | 'Meals' | 'Books';
    showQrCode: boolean;
    founderMessage: string;
  };
  broadcastMessage?: string;
  themeEngine: 'celestial' | 'ramadan' | 'minimal';
  activeSeason: AppSeason;
  showSpaceMode: boolean;
  planetVelocity: number;
  moonPhase: 'full' | 'crescent' | 'new';
  starDensity: number;
  effectIntensity: number;
  injectedCss?: string;
  tajweedConfidenceThreshold: number;
  mapSearchRadius: number;
  proximityAlertRadius: number;
  silenceHoursStart: number;
  silenceHoursEnd: number;
  notificationPriority: 'Low' | 'Medium' | 'High';
  alertCategoryTriggers: LandmarkCategory[];
}

export interface FeatureFlags {
  enableMarketplace: boolean;
  enableTajweed: boolean;
  enableEducation: boolean;
  enableLegacy: boolean;
  enableDiscovery: boolean;
  enableNoorMap: boolean;
  enableProximityAlerts: boolean;
  enableCircles: boolean;
  enableHeatmap: boolean;
}

export interface GlobalPricing {
  fastMissedExcused: number;
  fastMissedIntentional: number;
  prayerMissed: number;
}

export interface GardenPlant {
  id: string;
  type: 'seedling' | 'flower' | 'tree' | 'monument';
  name: string;
  dateUnlocked: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  sadaqahPercent: number;
  isSme?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CommunityUser extends UserProfile {
  id: string;
  distance?: string;
  isLive?: boolean;
  impactPoints?: number;
  sabrPoints?: number;
  sponsoredCount?: number;
}

export interface ActivityEvent {
  id: string;
  user: string;
  type: 'milestone' | 'sponsor' | 'count' | 'fast' | 'prayer' | 'recitation' | 'education' | 'legacy';
  value: string;
  icon: string;
  color: string;
}

export interface ADriveItem {
  id: string;
  userId: string;
  itemType: 'lesson' | 'zikr_preset' | 'legacy_save' | 'bookmark';
  title: string;
  contentJson: any;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type View = 'splash' | 'identity' | 'dashboard' | 'counter' | 'library' | 'ledger' | 'insight' | 'profile' | 'admin' | 'ramadan' | 'leaderboard' | 'tajweed' | 'education' | 'salah-guide' | 'legacy-hub' | 'marketplace' | 'privacy' | 'admin-full' | 'merchant-portal' | 'noor-map' | 'circles' | 'barakah-report' | 'zakat-calculator' | 'amanah' | 'admin-command-center' | 'a-drive' | 'settings' | 'ummah-wall' | 'ummah-connect' | 'ummah-gatherings';
