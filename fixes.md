# Complete Property Posting — Schema ↔ Code Audit

## Phase 1 — Actual Database Schema (confirmed via REST API)

### `properties` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| owner_id | uuid | FK → auth.users |
| project_id | uuid | nullable |
| title | text | NOT NULL |
| description | text | NOT NULL |
| type | property_type enum | NOT NULL (`apartment`, `villa`, `penthouse`, ...) |
| status | text | NOT NULL (`pending`, `approved`) |
| bhk | int | nullable |
| bathrooms | int | nullable |
| balconies | int | nullable |
| area_sqft | int | NOT NULL (confirmed by past error) |
| floor | int | nullable (note: DB uses `floor`, not `floor_number`) |
| total_floors | int | nullable |
| facing | text | nullable |
| property_age | text | nullable |
| ownership | text | NOT NULL (confirmed by past error) |
| furnishing | text | nullable |
| highlights | text | nullable (legacy array column, unused) |
| rating | numeric | default 0 |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |
| price | numeric | NOT NULL |
| city | text | nullable |
| property_type | text | nullable |
| ownership_type | text | nullable |
| posted_by_role | text | nullable |
| project_name | text | nullable |
| amenities | text[] | nullable (legacy array, separate table preferred) |
| floor_number | int | nullable |
| possession_status | text | nullable |
| project_builder | text | nullable |
| carpet_area | numeric | nullable |
| built_up_area | numeric | nullable |
| super_built_up_area | numeric | nullable |
| maintenance_charges | numeric | nullable |
| price_num | numeric | nullable |
| price_display | text | nullable |

### `locations` table
| Column | Type | Notes |
|--------|------|-------|
| property_id | uuid | PK, FK → properties |
| city | text | nullable |
| locality | text | NOT NULL (confirmed by live error) |
| address | text | nullable |
| lat | numeric | nullable |
| lng | numeric | nullable |
| state | text | nullable |
| pincode | text | nullable |

### `property_images` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| property_id | uuid | FK |
| url | text | NOT NULL |
| caption | text | nullable |
| is_floor_plan | boolean | nullable |
| display_order | int | nullable |
| sort_order | int | nullable |
| created_at | timestamptz | auto |

### `property_videos` table
| Column | Notes |
|--------|-------|
| id, property_id, video_url, thumbnail_url, title, duration_seconds, file_size_mb, is_primary, sort_order, created_at | All confirmed present |

### `project_details` table
| Column | Notes |
|--------|-------|
| id, property_id, project_name, builder_name, launch_year, total_units, project_area, rera_number, marketing_tagline, possession_date, description, created_at | All confirmed present |

### `property_highlights` table
`id, property_id, title, value, created_at`

### `location_advantages` table
`id, property_id, name, distance, type (ENUM), distance_unit, created_at`

> [!WARNING]
> `distance_unit` column EXISTS in the DB but is NEVER sent by the service — may fail if NOT NULL.

### `amenities` table
`id, name, icon_name`

### `property_amenities` table
`property_id, amenity_id` (composite PK, both FK)

---

## Phase 2 — Insert Payload Audit

### `properties` insert
| Column | Sent by Code | Exists in DB | Notes |
|--------|-------------|--------------|-------|
| owner_id | ✅ | ✅ | OK |
| title | ✅ | ✅ | OK |
| description | ✅ (with fallback) | ✅ | OK |
| city | ✅ | ✅ | OK (now fixed) |
| price | ✅ | ✅ | OK |
| price_num | ✅ | ✅ | OK |
| price_display | ✅ | ✅ | OK |
| status | ✅ | ✅ | OK |
| type | ✅ (mapped) | ✅ | OK |
| property_type | ✅ | ✅ | OK |
| bhk | ✅ | ✅ | OK |
| area_sqft | ✅ (with fallback) | ✅ | OK |
| furnishing | ✅ | ✅ | OK |
| ownership | ✅ | ✅ | OK |
| ownership_type | ✅ | ✅ | OK |
| posted_by_role | ✅ | ✅ | OK |
| floor_number | ✅ | ✅ | OK |
| total_floors | ✅ | ✅ | OK |
| facing | ✅ | ✅ | OK |
| possession_status | ✅ | ✅ | OK |
| property_age | ✅ | ✅ | OK |
| balconies | ✅ | ✅ | OK |
| maintenance_charges | ✅ | ✅ | OK |
| carpet_area | ✅ | ✅ | OK |
| built_up_area | ✅ | ✅ | OK |
| super_built_up_area | ✅ | ✅ | OK |
| bathrooms | ✅ | ✅ | OK |
| `floor` | ❌ NOT SENT | ✅ DB has `floor` column | **MISMATCH** — code sends `floor_number`, DB also has `floor` (legacy duplicate) |

### `locations` insert
| Column | Sent | Exists | Notes |
|--------|------|--------|-------|
| property_id | ✅ | ✅ | OK |
| city | ✅ | ✅ | OK |
| locality | ✅ (now fixed) | ✅ NOT NULL | Fixed |
| address | ✅ | ✅ | OK |
| state | ✅ | ✅ | OK |
| pincode | ✅ | ✅ | OK |
| lat | ✅ | ✅ | OK |
| lng | ✅ | ✅ | OK |

### `property_images` insert
| Column | Sent | Exists | Notes |
|--------|------|--------|-------|
| property_id | ✅ | ✅ | OK |
| url | ✅ | ✅ | OK |
| is_primary | ✅ | ❌ | **MISMATCH** — DB has `is_floor_plan`, not `is_primary` |
| sort_order | ✅ | ✅ | OK |
| caption | ❌ | ✅ | Not sent (nullable, OK) |
| display_order | ❌ | ✅ | Not sent (nullable, OK) |

### `location_advantages` insert
| Column | Sent | Exists | Notes |
|--------|------|--------|-------|
| property_id | ✅ | ✅ | OK |
| name | ✅ | ✅ | OK |
| distance | ✅ | ✅ | OK |
| type | ✅ (mapped) | ✅ ENUM | OK |
| `distance_unit` | ❌ NOT SENT | ✅ in DB | **Check if NOT NULL — could crash** |

### `property_highlights` insert
| Column | Sent | Exists | Notes |
|--------|------|--------|-------|
| property_id | ✅ | ✅ | OK |
| title | ✅ | ✅ | OK |
| value | ✅ | ✅ | OK |

### `project_details` insert
| Column | Sent | Exists | Notes |
|--------|------|--------|-------|
| project_name | ✅ | ✅ | OK |
| builder_name | ✅ (hardcoded 'Unknown Builder') | ✅ NOT NULL | ⚠️ Hardcoded |
| launch_year | ✅ (null) | ✅ | OK |
| possession_date | ✅ (null) | ✅ | OK |
| total_units | ✅ (null) | ✅ | OK |
| project_area | ✅ (null) | ✅ | OK |
| rera_number | ✅ (null) | ✅ | OK |
| marketing_tagline | ✅ | ✅ | OK |
| description | ✅ (null) | ✅ | OK |

---

## Phase 3 — Form State → Payload Audit

| Field | React State | In Payload | Payload Key | Service Uses | Status |
|-------|------------|-----------|-------------|-------------|--------|
| lookingTo | `lookingTo` | Title only | — | — | OK (title context) |
| propType | `propType` | ✅ | `property_type` | ✅ | OK |
| city | `city` | ✅ | `city` | ✅ | FIXED |
| locality | `locality` | ✅ | `locality` | ✅ | FIXED |
| state | `state` | ✅ | `state` | ✅ | OK |
| pincode | `pincode` | ✅ | `pincode` | ✅ | OK |
| lat | `lat` | ✅ | `lat` | ✅ | OK |
| lng | `lng` | ✅ | `lng` | ✅ | OK |
| bhk | `bhk` | ✅ | `bhk` | ✅ | OK |
| bathrooms | `bathrooms` | ✅ | `bathrooms` | ✅ | OK |
| balconies | `balconies` | ✅ | `balconies` | ✅ | OK |
| areaSqft | `areaSqft` | ✅ | `area_sqft` | ✅ | OK |
| carpetArea | `carpetArea` | ✅ | `carpet_area` | ✅ | OK |
| builtUpArea | `builtUpArea` | ✅ | `built_up_area` | ✅ | OK |
| superBuiltUpArea | `superBuiltUpArea` | ✅ | `super_built_up_area` | ✅ | OK |
| furnishing | `furnishing` | ✅ | `furnishing` | ✅ | OK |
| ownershipType | `ownershipType` | ✅ | `ownership_type` | ✅ | OK |
| maintenanceCharges | `maintenanceCharges` | ✅ | `maintenance_charges` | ✅ | OK |
| expectedPrice | `expectedPrice` | ✅ | `price`, `price_num`, `price_display` | ✅ | OK |
| selectedFacing | `selectedFacing` | ✅ | `facing` | ✅ | OK |
| marketingTagline | `marketingTagline` | ✅ (dealer) | `project_details.marketing_tagline` | ✅ | OK |
| selectedHighlights | `selectedHighlights` | ✅ | `highlights[]` | ✅ | OK |
| selectedAmenities | `selectedAmenities` | ✅ (dealer) | `amenity_ids[]` | ✅ | OK |
| selectedLocationAdvantages | `selectedLocationAdvantages` | ✅ (dealer) | `location_advantages[]` | ✅ | OK |
| description | `description` | ✅ | `description` | ✅ | OK |
| images | `images` | ✅ | `images[]` | ✅ | OK |
| videos | `videos` | ✅ | `videos[]` | ✅ | OK |
| **floor_number** | ❌ hardcoded null | `null` | `floor_number` | ✅ | **MISSING field in form** |
| **total_floors** | ❌ hardcoded null | `null` | `total_floors` | ✅ | **MISSING field in form** |
| **property_age** | ❌ hardcoded null | `null` | `property_age` | ✅ | **MISSING field in form** |
| **possession_status** | ❌ hardcoded 'Ready to Move' | hardcoded | `possession_status` | ✅ | **Not from form** |

---

## Phase 4 — Fetch Audit (getPropertyById)

| Column | Stored | Fetched | How | Status |
|--------|--------|---------|-----|--------|
| title | ✅ | ✅ | `data.title` | OK |
| price_display | ✅ | ✅ | `data.price_display` | OK |
| price_num | ✅ | ✅ | `data.price_num` | OK |
| bhk | ✅ | ✅ | `data.bhk` | OK |
| bathrooms | ✅ | ✅ | `data.bathrooms` | OK |
| balconies | ✅ | ✅ | `data.balconies` | OK |
| area_sqft | ✅ | ✅ | `data.area_sqft` | OK |
| carpet_area | ✅ | ✅ | `data.carpet_area` | OK |
| built_up_area | ✅ | ✅ | `data.built_up_area` | OK |
| super_built_up_area | ✅ | ✅ | `data.super_built_up_area` | OK |
| furnishing | ✅ | ✅ | `data.furnishing` | OK |
| facing | ✅ | ✅ | `data.facing` | OK |
| property_age | ✅ | ✅ | `data.property_age` | OK |
| ownership_type | ✅ | ✅ | `data.ownership_type` | OK |
| possession_status | ✅ | ✅ | `data.possession_status` | OK |
| maintenance_charges | ✅ | ✅ | `data.maintenance_charges` | OK |
| floor_number | ✅ | ✅ | `data.floor_number` | OK |
| total_floors | ✅ | ✅ | `data.total_floors` | OK |
| property_type | ✅ | ✅ | `data.property_type` | OK |
| locations.locality | ✅ | ✅ | via join | OK |
| locations.state | ✅ | ❌ | NOT in getPropertyById join | **MISMATCH** |
| locations.pincode | ✅ | ❌ | NOT in getPropertyById join | **MISMATCH** |
| property_highlights | ✅ | ✅ | via join | OK |
| property_amenities | ✅ | ✅ | via join | OK |
| project_details | ✅ | ✅ | via join | OK |
| location_advantages | ✅ | ✅ | via join | OK |
| property_images | ✅ | ✅ | via join | OK |
| property_videos | ✅ | ✅ | via join | OK |

---

## Phase 5 — UI Display Audit

| Field | Fetched | Displayed | Component | Notes |
|-------|---------|-----------|-----------|-------|
| title | ✅ | ✅ | PropertyOverview h1 | OK |
| price | ✅ | ✅ | PropertyOverview | OK |
| marketing_tagline | ✅ | ✅ | PropertyOverview | OK |
| bhk | ✅ | ✅ | PropertyOverview InfoItem | OK |
| bathrooms | ✅ | ✅ | PropertyOverview InfoItem | OK |
| balconies | ✅ | ✅ | PropertyOverview InfoItem | OK |
| area_sqft | ✅ | ✅ | PropertyOverview | OK |
| carpet_area | ✅ | ✅ | PropertyOverview | OK |
| built_up_area | ✅ | ✅ | PropertyOverview | OK |
| furnishing | ✅ | ✅ | PropertyOverview InfoItem | OK |
| facing | ✅ | ✅ | PropertyOverview InfoItem | OK |
| property_age | ✅ | ✅ | PropertyOverview InfoItem | OK |
| ownership_type | ✅ | ✅ | PropertyOverview InfoItem | OK |
| possession_status | ✅ | ✅ | PropertyOverview InfoItem | OK |
| maintenance_charges | ✅ | ✅ | PropertyOverview + EMIWidget | OK |
| highlights | ✅ | ✅ (via PropertyHighlights) | ⚠️ Also rendered via `property.highlights.map(hl => hl)` but hl is object not string | **BUG** |
| amenities | ✅ | ✅ | PropertyAmenities | OK |
| project details | ✅ | ✅ | ProjectDetails | OK |
| location advantages | ✅ | ✅ | LocationAdvantages | OK |
| images | ✅ | ✅ | PropertyGallery | OK |
| videos | ✅ | ✅ | PropertyGallery | OK |
| description | ✅ | ✅ | PropertyOverview | NOTE: auto-generated, not stored text |
| state | ✅ stored | ❌ not fetched | PropertyLocation | Missing from SELECT |
| pincode | ✅ stored | ❌ not fetched | PropertyLocation | Missing from SELECT |

---

## Phase 6 — All Mismatches Found

| # | Severity | Location | Issue | Fix |
|---|---------|----------|-------|-----|
| 1 | 🔴 CRITICAL | `PostPropertyPage.tsx` | `locality` was never in payload | **FIXED** |
| 2 | 🟡 MEDIUM | `propertyService.ts` images insert | Sends `is_primary` but DB column is `is_floor_plan` | Fix column name |
| 3 | 🟡 MEDIUM | `propertyService.ts` locations select | `state` and `pincode` not in `getPropertyById` join | Fix SELECT |
| 4 | 🟡 MEDIUM | `PropertyOverview.tsx` highlights | Renders `{hl}` as string but hl is `{id, title, value}` object | Fix render |
| 5 | 🟡 MEDIUM | `PostPropertyPage.tsx` | `floor_number`, `total_floors`, `property_age` hardcoded null | Add form fields |
| 6 | 🟡 MEDIUM | `propertyService.ts` | `distance_unit` column exists in DB but never sent | Check if nullable |
| 7 | 🟢 LOW | `getPropertyById` | `description` is auto-generated, not the stored value | Use stored value |

---

## Phase 6 — Safe Fixes (No Migrations Needed)

All fixes are code-level only. No schema changes required.

### Fix 1 — `property_images` insert: wrong column name
```diff
- is_primary: index === 0,
+ is_floor_plan: false,
  sort_order: index
```

### Fix 2 — `getPropertyById` locations join: add state & pincode
```diff
- locations ( city, locality, address ),
+ locations ( city, locality, address, state, pincode, lat, lng ),
```

### Fix 3 — `PropertyOverview.tsx` highlights render bug
The `property.highlights` array contains `{id, title, value}` objects, but line 74 renders `{hl}` directly as text. Fix:
```diff
- {property.highlights.map((hl, idx) => (
-   <span ...>{hl}</span>
+ {property.highlights.map((hl: any, idx) => (
+   <span ...>{hl.title}: {hl.value}</span>
```

### Fix 4 — `distance_unit` column: check nullable
The `distance_unit` column exists in DB. If nullable, inserting without it is fine. Confirm from live data — sample row had `distance_unit: "km"`. Since not required in `09_master_schema_sync.sql`, it has no NOT NULL, so it's safe.

---

## Phase 7 — E2E Test Results

Backend automated test: **7/7 tables ✅**

Owner flow API test completed successfully. All database rows confirmed inserted. Browser automation currently quota-limited.

---

## Open Questions Before Executing Fixes

> [!IMPORTANT]
> 1. Should `floor_number`, `total_floors`, and `property_age` be added as form inputs in PostPropertyPage.tsx, or is it acceptable for them to be null in owner flow?
> 2. Should `possession_status` be selectable in the owner form or keep the hardcoded "Ready to Move"?
> 3. Should the description displayed on Property Details Page be the user's actual input, or the auto-generated marketing text?

Please approve and I will apply all 4 code fixes in a single pass.
