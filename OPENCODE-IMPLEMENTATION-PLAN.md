# OpenCode Implementation Plan — TechNotes Angular Frontend

## 1. Current Architecture

### Frontend (Angular 21)
- Standalone components with Angular Router
- HttpClient for API calls
- Tailwind CSS 4
- Features structure under `src/app/features/`
- DummyDataService used extensively for mock data
- No HTTP interceptor currently configured
- Environment API URL: `https://localhost:7029/api/v1`

### Key Features
- **Notes**: note-list, note-create, note-view, note-edit, my-notes, favorite-list
- **Auth**: login, register, forgot-password
- **Dashboard**: dashboard (uses DummyDataService)
- **Search**: search page (uses DummyDataService)
- **Categories**: category-list (uses DummyDataService)
- **Tags**: tag-list (uses DummyDataService)
- **Sharing**: shared-notes (uses DummyDataService)
- **Learn**: learn-home, topic, lesson (uses DummyDataService)
- **Activity**: activity (static data)
- **Profile**: profile (standalone)

### Services Currently in Use
- `DummyDataService` — provides mock notes data (used by many components)
- `NoteApiService` — partial API service (missing auth, withCredentials, some endpoints)

### Models Currently Defined
- `ContentBlockType` — string enum: text, definition, points, example, code, table, graph, quote
- `ContentBlockModel` — type, sortOrder, content, data, metadata
- `NoteSectionModel` — title, sortOrder, children, contents
- `NoteCreateModel` — title, visibility, folderId, categoryId, sections
- `NoteResponse` — id, title, status, visibility, userId, folderId, categoryId, sections
- `NoteSectionResponse` — id, title, sortOrder, children, contents (recursive)

### Backend API Contract (Source of Truth)
- Base: `/api/v1/notes`
- Endpoints: GET, GET/{id}, GET/my, POST, PUT/{id}, DELETE/{id}, search
- Auth: `/api/v1/auth` — register, login, refresh, logout, me
- JWT access token in Authorization header
- Refresh token via HTTP-only cookie (withCredentials required)
- Content Data field is JSON string — must stringify on send, parse on receive
- Sections are recursive with ParentSection/Children structure
- SortOrder on both sections and content blocks

---

## 2. Frontend/Backend Relationship

| Aspect | Approach |
|--------|----------|
| API Contract | Backend is source of truth for requests/responses |
| UI/UX | Frontend is source of truth — do not redesign |
| API URLs | Use environment.apiUrl + endpoints — do not hardcode |
| Authentication | JWT Bearer token in header; refresh cookie withCredentials |
| DTOs | Create Angular models matching backend DTOs exactly |
| Content Blocks | JSON.stringify when sending, JSON.parse when receiving |
| Sections | Recursive structure — map children recursively when rendering |
| SortOrder | Maintain sequential ordering; convert UI array order to SortOrder |

---

## 3. API Mapping

| Frontend Method | Backend Endpoint | Notes |
|-----------------|------------------|-------|
| `getPublicNotes()` | GET `/api/v1/notes` | Public, no auth required |
| `getById(id)` | GET `/api/v1/notes/{id}` | Public or authenticated |
| `getMyNotes()` | GET `/api/v1/notes/my` | Requires auth + withCredentials |
| `create(request)` | POST `/api/v1/notes` | Requires auth + withCredentials |
| `update(id, request)` | PUT `/api/v1/notes/{id}` | Requires auth + withCredentials |
| `delete(id)` | DELETE `/api/v1/notes/{id}` | Requires auth + withCredentials |
| `search(term)` | GET `/api/v1/notes/search?searchTerm=term` | Requires auth + withCredentials |

---

## 4. Model Mapping

### CreateNoteRequest → NoteCreateModel
| Backend Field | Frontend Model | Type |
|--------------|----------------|------|
| title | title | string |
| visibility | visibility | 'Public' | 'Shared' | 'Private' |
| folderId | folderId | Guid (nullable) |
| categoryId | categoryId | Guid (nullable) |
| sections | sections | SectionModel[] |
| → children | children | SectionModel[] |
| → contents | contents | ContentBlockModel[] |
| →→ type | type | ContentBlockType |
| →→ sortOrder | sortOrder | number |
| →→ content | content | string (optional) |
| →→ data | data | string (JSON, optional) |
| →→ metadata | metadata | string (optional) |

### NoteResponse → NoteResponseModel
| Backend Field | Frontend Model | Type |
|--------------|----------------|------|
| id | id | string (Guid) |
| title | title | string |
| status | status | number (NoteStatus) |
| visibility | visibility | number (NoteVisibility) |
| userId | userId | string (Guid) |
| folderId | folderId | string | null |
| categoryId | categoryId | string | null |
| sections | sections | NoteSectionResponse[] |

---

## 5. Content-Block Mapping

| Frontend Block | Backend NoteContentType | Content | Data | Metadata | Serialization |
|----------------|------------------------|---------|------|----------|---------------|
| text | text | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| definition | definition | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| points | points | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| example | example | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| code | code | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| table | table | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| graph | graph | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |
| quote | quote | string (optional) | JSON.stringify(object) | string (optional) | JSON.stringify data |

**Key**: Always `JSON.stringify()` the `data` field when sending to backend. Backend returns `data` as JSON string — must `JSON.parse()` when receiving.

---

## 6. Recursive Section Strategy

- Sections have recursive structure: each `NoteSectionResponse` has `children` array for subsections
- When rendering, map recursively through `children` to render nested sections
- Preserve parent/child relationships from backend
- Each section has `sortOrder` — maintain sequential ordering
- The `section-tree` component can be reused for rendering recursive sections
- When creating/updating, ensure children are passed in the correct structure

---

## 7. SortOrder Strategy

| Element | SortOrder Rule |
|---------|----------------|
| Root sections | Sequential order (1, 2, 3, ...) among siblings |
| Child sections | Sequential order among their siblings |
| Content blocks | Sequential order within their section |

**Implementation**: 
- UI array ordering can be converted to SortOrder automatically on submit
- When displaying, sort by sortOrder
- On create/update, assign sequential sortOrder based on current position

---

## 8. Authentication Strategy

### Token Flow
1. **Login** → receives JWT + refresh token cookie set (HTTP-only)
2. **Protected requests** → include `Authorization: Bearer <jwt-token>` header
3. **On 401 response** → call `/api/v1/auth/refresh` with `withCredentials: true`
4. **After refresh** → retry original request with new token
5. **Logout** → call `/api/v1/auth/logout` with `withCredentials: true`

### HTTP Interceptor Required
- Add `Authorization: Bearer <access-token>` to all protected requests
- Handle 401 by triggering token refresh
- Automatically include `withCredentials: true` for cookie-based auth
- Skip interceptor for public endpoints (auth register/login, public notes)

### Endpoints Requiring `withCredentials: true`
- `/api/v1/auth/refresh`
- `/api/v1/auth/logout`
- `/api/v1/notes/my`
- `/api/v1/notes/` (POST, PUT, DELETE)
- Any authenticated request

### Important: Frontend must NOT read HTTP-only refresh token using JavaScript

---

## 9. Dummy-Data Migration

### Components Using DummyDataService
| Component | Path | Migration Required |
|-----------|------|--------------------|
| Dashboard | `src/app/features/dashboard/pages/dashboard/dashboard.ts` | Replace with API |
| FavoriteList | `src/app/features/favorites/pages/favorite-list/favorite-list.ts` | Frontend-only (not persisted) |
| Search | `src/app/features/search/pages/search/search.ts` | Replace with API |
| NoteList | `src/app/features/notes/pages/note-list/note-list.ts` | Replace with API |
| SharedNotes | `src/app/features/sharing/pages/shared-notes/shared-notes.ts` | Replace with API |
| CategoryList | `src/app/features/categories/pages/category-list/category-list.ts` | Replace with API / API may not exist |
| TagList | `src/app/features/tags/pages/tag-list/tag-list.ts` | Replace with API / API may not exist |
| LearnHome | `src/app/features/learn/pages/learn-home/learn-home.ts` | May remain frontend-only |
| Lesson | `src/app/features/learn/pages/lesson/lesson.ts` | May remain frontend-only |
| Topic | `src/app/features/learn/pages/topic/topic.ts` | May remain frontend-only |

### Migration Plan
1. **PHASE 1-4**: Create NoteApiService, models, authentication
2. **PHASE 5-9**: Migrate NoteList, MyNotes, NoteView, CreateNote, UpdateNote, DeleteNote
3. **PHASE 10**: Replace DummyDataService usage with API where backends exist
4. **PHASE 11**: Mark favorites as frontend-only, remove from persistence
5. **PHASE 12**: Remove DummyDataService entirely after all migrations

---

## 10. Files to Create

```
C:\Angular\Technotes-client\src\app\features\notes\services\note-api.service.ts
C:\Angular\Technotes-client\src\app\features\auth\services\auth.service.ts
C:\Angular\Technotes-client\src\app\features\auth\services\http.interceptor.ts
C:\Angular\Technotes-client\src\app\features\notes\models\note-response.model.ts
C:\Angular\Technotes-client\src\app\features\notes\models\note-create.model.ts
C:\Angular\Technotes-client\src\app\features\notes\models\content-block.model.ts
C:\Angular\Technotes-client\src\app\features\notes\models\content-block-type.model.ts
```

*(Models already exist — may need modification)*

---

## 11. Files to Modify

### Services
- **`note-api.service.ts`** — Add withCredentials, proper auth handling, all endpoints
- **`auth.service.ts`** (new) — Auth service with login/logout/refresh
- **`http.interceptor.ts`** (new) — Authorization header, 401 handling, withCredentials

### Components — Migrate from DummyData to API
- **`note-list.ts`** — Replace DummyDataService with NoteApiService
- **`my-notes/`** — Create or update to use API (need to find component)
- **`note-create.ts`** — Replace dummy save with API call
- **`note-view.ts`** — Already uses API, may need error/loading state enhancements
- **`favorite-list.ts`** — Mark as frontend-only, remove DummyDataService dependency
- **`search.ts`** — Replace DummyDataService with API search
- **`dashboard.ts`** — Replace DummyDataService with API or mark as frontend-only
- **`shared-notes.ts`** — Replace DummyDataService with API
- **`category-list.ts`** — Replace DummyDataService or mark as frontend-only
- **`tag-list.ts`** — Replace DummyDataService or mark as frontend-only
- **`learn-home.ts`** — May keep DummyDataService (learning data may not have API)
- **`lesson.ts`** — May keep DummyDataService
- **`topic.ts`** — May keep DummyDataService

### Templates — Update for API states
- **`note-create.html`** — Update save handler, loading states
- **`note-list.html`** — Add loading/error/empty states
- **`note-view.html`** — Enhance loading/error states
- **`my-notes.html`** — Need to find and update
- **`favorite-list.html`** — Remove dummy data references

### App Configuration
- **`app.config.ts`** — Add provideHttpClient with withCredentials support
- **`app.routes.ts`** — Ensure auth guards routes properly

### New Files
- **`src\app\features\auth\services\auth.service.ts`** — Auth service
- **`src\app\features\auth\services\http.interceptor.ts`** — HTTP interceptor

---

## 12. Files to Remove (After Migration)

- Remove DummyDataService usage from migrated components
- Can delete `DummyDataService` entirely after all migrations complete
- Do NOT delete during planning stage — migrate first

---

## 13. Implementation Phases

### PHASE 1: Inspect Backend Contract
- Verify backend API endpoints and DTO structures
- Confirm NoteContentType enum values
- Confirm NoteVisibility, NoteStatus enums

### PHASE 2: Frontend Environment/API Configuration
- Ensure environment.apiUrl is set correctly
- Add HTTP interceptor to app.config.ts
- Configure withCredentials where needed

### PHASE 3: Frontend TypeScript Models
- Verify NoteCreateModel matches CreateNoteRequest
- Verify NoteResponseModel matches NoteResponse
- Verify ContentBlockModel matches NoteContentResponse
- Add proper types for visibility, status enums

### PHASE 4: Note API Service
- Complete NoteApiService with all methods
- Add withCredentials configuration
- Handle error responses

### PHASE 5: Authentication and HTTP Interceptor
- Create AuthService
- Create HTTP Interceptor
- Add provideHttpClient to app.config.ts
- Add route guards for authentication

### PHASE 6: Content Block Mapping
- Implement JSON.stringify/JSON.parse for data field
- Map ContentBlockType enum correctly
- Handle serialization in create/update flow

### PHASE 7: Recursive Section Structure
- Implement recursive section rendering
- Maintain sortOrder for sections and content
- Update section-tree component if needed

### PHASE 8: Public Notes
- Update NoteList to use GET /api/v1/notes
- Add loading, error, empty states
- Replace dummy data with API data

### PHASE 9: Note View
- Ensure getById works with API
- Handle loading and error states
- Render nested sections and content blocks

### PHASE 10: My Notes
- Update to use GET /api/v1/notes/my
- Add authentication requirement
- Add loading, error, empty states

### PHASE 11: Create Note
- Transform editor state to NoteCreateModel
- POST /api/v1/notes with proper structure
- Handle nested sections and content block ordering
- JSON.stringify data fields

### PHASE 12: Update Note
- Use PUT /api/v1/notes/{id}
- Clear old section tree before adding updated structure
- Handle SortOrder conversion

### PHASE 13: Delete Note
- Use DELETE /api/v1/notes/{id}
- Confirmation dialog
- Success handling and navigation

### PHASE 14: Search
- Use GET /api/v1/notes/search?searchTerm=value
- Add auth requirement
- Replace dummy data search with API

### PHASE 15: Remove Migrated Dummy-Data Dependencies
- Remove DummyDataService imports
- Remove this.data references from migrated components
- Delete DummyDataService if fully migrated

### PHASE 16: Testing and Verification
- Frontend compilation check
- API connection verification
- All core features working:
  - Login / Logout
  - Access token flow
  - Public notes
  - Single note view
  - My notes
  - Create note
  - Update note
  - Delete note
  - Search
  - Nested sections
  - SortOrder for sections and content
  - All content block types
  - 401 handling
  - 404 handling
  - Loading states
  - Empty states
  - Error states
  - Refresh token flow
  - Logout

---

## 14. Risks

| Risk | Mitigation |
|------|-----------|
| Backend API changes not reflected in plan | Inspect actual backend DTOs before modeling — do not guess |
| Content block Data serialization bugs | Always JSON.stringify on send, JSON.parse on receive — test thoroughly |
| SortOrder not maintained correctly | Convert UI array order to sequential SortOrder on submit; test nested sections |
| Authentication token refresh infinite loop | Implement refresh with retry count limit; handle 401 after refresh gracefully |
| CORS issues between frontend and backend | Verify backend CORS config; use withCredentials: true for authenticated requests |
| Breaking changes when migrating from DummyData to API | Keep dummy data as fallback during transition; incrementally migrate one component at a time |
| Recursive section rendering bugs | Test with deeply nested sections; ensure children are properly propagated |

---

## 15. Testing Checklist

- [ ] Frontend compilation (`ng build`)
- [ ] Backend running with API endpoints
- [ ] API connection — all endpoints respond correctly
- [ ] Login — obtains JWT and refresh cookie
- [ ] Access token — stored and used in Authorization header
- [ ] Protected API request — includes bearer token
- [ ] Public notes — works without auth
- [ ] Single note — getById works with and without auth
- [ ] My notes — requires auth + withCredentials
- [ ] Create note — POST with proper structure, JSON data serialization
- [ ] Update note — PUT with proper structure
- [ ] Delete note — DELETE with auth
- [ ] Nested sections — recursive rendering works
- [ ] Section SortOrder — sequential ordering maintained
- [ ] Content SortOrder — sequential ordering within sections
- [ ] All content block types (text, definition, points, example, code, table, graph, quote)
- [ ] Search — GET /api/v1/notes/search?searchTerm=value
- [ ] 401 handling — triggers token refresh
- [ ] 404 handling — shows "not found" message
- [ ] Loading state — shown during API calls
- [ ] Empty state — shown when API returns []
- [ ] Error state — 400/401/403/500 handled gracefully
- [ ] Refresh token — on 401, call /api/v1/auth/refresh
- [ ] Logout — call /api/v1/auth/logout with withCredentials