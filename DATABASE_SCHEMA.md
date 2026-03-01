# Ashadu Database Architecture v4.0

This document outlines the database schema designed to support user accounts and the **A-Drive** (Spiritual Storage) system. The schema is optimized for a PostgreSQL environment (compatible with Supabase) and follows the "Celestial Emerald" design philosophy of transparency and permanence.

## Core Tables

### 1. `profiles`
The central identity table. It stores user account details, roles, and spiritual tiers.
- **Key Fields**: `email` (unique identifier), `role` (servant, admin, developer), `tier` (spiritual rank).

### 2. `a_drive_items` (The A-Drive)
The **A-Drive** is a flexible spiritual storage system. It allows users to "save" various types of content for later use or reflection.
- **Item Types**:
  - `lesson`: Saved educational content or progress.
  - `zikr_preset`: Custom zikr phrases and targets.
  - `legacy_save`: Bookmarked community projects.
  - `bookmark`: General app bookmarks (e.g., specific marketplace items or map locations).
- **Design**: Uses a `JSONB` column (`content_json`) to allow for heterogeneous data structures without needing a table for every item type.

### 3. `zikr_ledger`
A high-volume table for logging every spiritual session.
- **Sync Logic**: Includes an `is_synced` flag to support the app's offline-first "SyncBridge" architecture.

### 4. `zakat_records`
Private financial data for wealth purification.
- **Status**: Tracks `PENDING` vs `SETTLED` amounts to help users manage their Amanah obligations.

### 5. `user_stats`
A "denormalized" table that stores aggregated metrics. This prevents expensive `COUNT` and `SUM` queries on the `zikr_ledger` and `zakat_records` tables during every dashboard render.

### 6. `legacy_projects` & `marketplace_orders`
Tables supporting the community and commerce aspects of the ecosystem.

---

## Implementation Notes

### JSONB Usage
The `a_drive_items` table uses PostgreSQL's `JSONB` type. This is critical for the A-Drive because it allows the app to evolve. If a new feature is added (e.g., "Saved Qibla Locations"), it can be stored in the A-Drive without a database migration.

### Relationships
All tables are linked to the `profiles` table via a `user_id` foreign key. We use `ON DELETE CASCADE` for user-specific data (like A-Drive items and Zikr logs) to ensure data privacy and clean deletion if an account is closed.

### Performance
Indexes have been added to all `user_id` columns and the `item_type` column in the A-Drive to ensure that even with millions of records, the user's personal "Spiritual Cloud" remains fast.
