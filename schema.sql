-- ASHADU AMANAH DATABASE SCHEMA v4.0
-- Optimized for PostgreSQL (Supabase Compatible)

-- 1. PROFILES: Core user account information
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(100),
    zipcode VARCHAR(20),
    role VARCHAR(20) DEFAULT 'servant' CHECK (role IN ('servant', 'admin', 'developer')),
    tier VARCHAR(20) DEFAULT 'ABID',
    is_premium BOOLEAN DEFAULT FALSE,
    avatar_color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. A_DRIVE_ITEMS: Spiritual storage for saved assets, bookmarks, and presets
CREATE TABLE a_drive_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'lesson', 'zikr_preset', 'legacy_save', 'bookmark'
    title VARCHAR(255) NOT NULL,
    content_json JSONB NOT NULL,    -- Flexible data storage
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ZIKR_LEDGER: Detailed logs of spiritual sessions
CREATE TABLE zikr_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    zikr_type VARCHAR(100) NOT NULL,
    count_amount INTEGER NOT NULL DEFAULT 0,
    session_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_context JSONB, -- { "city": "London", "lat": 51.5, "lon": -0.1 }
    is_synced BOOLEAN DEFAULT TRUE
);

-- 4. ZAKAT_RECORDS: Financial purification history
CREATE TABLE zakat_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    custom_name VARCHAR(255) DEFAULT 'Wealth Purification',
    category VARCHAR(100),
    asset_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    zakat_due DECIMAL(15, 2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SETTLED')),
    calculation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. USER_STATS: Aggregated metrics for high-performance UI rendering
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_zikr_count BIGINT DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    impact_points INTEGER DEFAULT 0,
    sabr_points INTEGER DEFAULT 0,
    education_credits DECIMAL(15, 2) DEFAULT 0,
    total_donations DECIMAL(15, 2) DEFAULT 0,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LEGACY_PROJECTS: Community-driven spiritual infrastructure projects
CREATE TABLE legacy_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL,
    raised_amount DECIMAL(15, 2) DEFAULT 0,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MARKETPLACE_ORDERS: History of spiritual product transactions
CREATE TABLE marketplace_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    items_json JSONB NOT NULL, -- Array of products purchased
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for performance
CREATE INDEX idx_a_drive_user ON a_drive_items(user_id);
CREATE INDEX idx_zikr_ledger_user ON zikr_ledger(user_id);
CREATE INDEX idx_zakat_records_user ON zakat_records(user_id);
CREATE INDEX idx_a_drive_type ON a_drive_items(item_type);
