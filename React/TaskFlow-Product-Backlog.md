# ✅ TaskFlow — Product Backlog
### Epic → Feature → Story → Task Breakdown with Planning & Grooming
> **Product**: TaskFlow PWA — Collaborative Task Manager
> **Team Size**: 4 devs (2 Frontend, 1 Backend, 1 QA) | **Sprint Length**: 2 weeks
> **Total Estimated Effort**: ~26 weeks (13 sprints) | **Scale Target**: 10k–100k users

---

## 📦 Product Features Overview

| # | Feature Area | Description |
|---|---|---|
| 1 | **Authentication & Authorization** | Register, Login, JWT, OAuth (Google), RBAC |
| 2 | **User Profile & Settings** | Avatar, dark mode, push notification prefs, account |
| 3 | **Project Management** | Create/archive projects, invite members, roles |
| 4 | **Task Management (Kanban)** | CRUD tasks, drag-and-drop board, filters, bulk actions |
| 5 | **Real-Time Collaboration** | Live cursors, task lock, activity feed via WebSocket |
| 6 | **Notifications** | In-app, push notifications, email digests |
| 7 | **Offline Support & PWA** | Service worker, background sync, install prompt |
| 8 | **Search & Filters** | Global search, tag filter, assignee, date range |
| 9 | **Dashboard & Analytics** | Task completion charts, burndown, velocity |
| 10 | **Performance & Accessibility** | Lighthouse ≥90, a11y, code splitting |

---

## 🗺️ Roadmap Overview

```
Q1 (Sprint 1–4)   → Foundation: Auth + Core Task CRUD + PWA Shell
Q2 (Sprint 5–8)   → Collaboration: Real-time + Notifications + Search
Q3 (Sprint 9–13)  → Intelligence: Dashboard + Analytics + Optimization
```

---

## 📚 Table of Contents

- [EPIC 1 — Authentication & Authorization](#epic-1--authentication--authorization)
- [EPIC 2 — User Profile & Settings](#epic-2--user-profile--settings)
- [EPIC 3 — Project Management](#epic-3--project-management)
- [EPIC 4 — Task Management (Kanban Board)](#epic-4--task-management-kanban-board)
- [EPIC 5 — Real-Time Collaboration](#epic-5--real-time-collaboration)
- [EPIC 6 — Notifications](#epic-6--notifications)
- [EPIC 7 — PWA & Offline Support](#epic-7--pwa--offline-support)
- [EPIC 8 — Search & Filters](#epic-8--search--filters)
- [EPIC 9 — Dashboard & Analytics](#epic-9--dashboard--analytics)
- [EPIC 10 — Performance & Accessibility](#epic-10--performance--accessibility)
- [Sprint Plan Summary](#sprint-plan-summary)
- [Definition of Ready & Done](#definition-of-ready--done)
- [Grooming Checklist](#grooming-checklist)

---

---

# EPIC 1 — Authentication & Authorization

> **Goal**: Users can securely register, log in, and be authorized based on their role.
> **Business Value**: Gate-keeps the product, enables personalization, ensures data security.
> **Priority**: 🔴 P0 — Must have (Sprint 1)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 1.1 — User Registration

**Description**: New users can create an account with email + password with full validation, email verification, and duplicate detection.

**Acceptance Criteria**:
- [ ] User can register with name, email, and password
- [ ] Password must be ≥ 8 chars, 1 uppercase, 1 number, 1 special char
- [ ] Duplicate email returns a clear error message
- [ ] Verification email sent on registration
- [ ] User cannot log in until email is verified
- [ ] Form shows real-time field-level validation

---

### Story 1.1.1 — Registration Form UI

> **As a** new user,
> **I want to** fill out a registration form,
> **so that** I can create my TaskFlow account.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Create `Register.tsx` page component | FE Dev | 3h | Responsive layout matching Login page design, `<form>` with noValidate, link to Login |
| T2 | Implement React Hook Form + Zod schema | FE Dev | 2h | `registerSchema` — name(2–50), email(valid), password(regex), confirmPassword(refine match) |
| T3 | Add real-time field validation UI | FE Dev | 2h | Error messages under each field, green check on valid, red border on invalid |
| T4 | Password strength indicator | FE Dev | 1h | Visual bar: weak/medium/strong based on regex checks |
| T5 | Write component tests | QA | 2h | Render test, validation error messages, submit disabled until valid |

---

### Story 1.1.2 — Registration API Integration

> **As a** new user,
> **I want to** submit my registration form,
> **so that** my account is created in the system.

**Story Points**: 2 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Create `authService.register()` | FE Dev | 1h | POST `/api/v1/auth/register` via Axios, typed response |
| T2 | Create `registerThunk` in Redux | FE Dev | 1h | `createAsyncThunk` — handle pending/fulfilled/rejected |
| T3 | Show success screen after submit | FE Dev | 1h | "Check your email" confirmation UI, resend email link |
| T4 | Handle API error responses | FE Dev | 1h | Map backend error codes to user-friendly messages |
| T5 | Integration test | QA | 1h | Mock API, test form submit dispatches thunk, success/error states |

---

## Feature 1.2 — User Login

**Description**: Existing users can log in with email/password. Session managed with JWT access + refresh token rotation.

**Acceptance Criteria**:
- [ ] Users can log in with correct credentials
- [ ] JWT access token (15min) + refresh token (7d) returned
- [ ] Access token stored in memory; refresh token in `httpOnly` cookie
- [ ] Auto-refresh access token before expiry
- [ ] Failed login shows attempts remaining (lock after 5 failed)
- [ ] "Remember me" extends session

---

### Story 1.2.1 — Login Form UI & State

> **As a** returning user,
> **I want to** log in with my email and password,
> **so that** I can access my workspace.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Build `Login.tsx` page | FE Dev | 2h | Email + password fields, show/hide password toggle, "Remember me" checkbox |
| T2 | Redux `authSlice` — loginThunk | FE Dev | 2h | `createAsyncThunk`, store user + token, persist to localStorage if "remember me" |
| T3 | Axios interceptor — token refresh | FE Dev | 3h | `axios.interceptors.response` — on 401 call `/auth/refresh`, retry original request |
| T4 | Redirect after login (return URL) | FE Dev | 1h | `useLocation` state — redirect to the page user was trying to access |
| T5 | Lock account UI after 5 attempts | FE Dev | 1h | Show "Account locked for 15 min" banner, disable form |
| T6 | Write unit + integration tests | QA | 2h | Mock login API, test token storage, interceptor retry logic |

---

### Story 1.2.2 — Google OAuth Login

> **As a** user,
> **I want to** sign in with my Google account,
> **so that** I don't have to remember another password.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Add Google OAuth button | FE Dev | 1h | `@react-oauth/google` — `GoogleLogin` component, styled to brand guidelines |
| T2 | Handle Google token → backend exchange | FE Dev | 2h | Send Google `id_token` to `/auth/google`, receive JWT pair |
| T3 | Merge accounts if email exists | BE Dev | 3h | Backend: if email already registered, link Google to existing account |
| T4 | Error handling — popup blocked | FE Dev | 1h | Fallback: open redirect flow if popup blocked |
| T5 | Test OAuth flow | QA | 2h | Mock Google token, test account merge, test new account creation |

---

## Feature 1.3 — Role-Based Access Control (RBAC)

**Description**: Three roles — `Admin`, `Member`, `Viewer`. UI and API actions gated by role.

**Acceptance Criteria**:
- [ ] Admins can manage members, project settings, billing
- [ ] Members can create/edit tasks assigned to them or their projects
- [ ] Viewers can read-only access to assigned projects
- [ ] UI hides/disables actions the user's role cannot perform
- [ ] API rejects unauthorized role actions with 403

---

### Story 1.3.1 — ProtectedRoute & Role Guard

> **As a** system,
> **I want to** prevent users from accessing pages they're not authorized for,
> **so that** data and actions are securely role-gated.

**Story Points**: 2 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ProtectedRoute.tsx` — auth check | FE Dev | 1h | Redirect to `/login` if not authenticated, preserve return URL in state |
| T2 | `RoleGuard.tsx` — role check | FE Dev | 1h | Accepts `allowedRoles[]`, renders 403 page if role not in list |
| T3 | `usePermission(action)` hook | FE Dev | 2h | Returns boolean — `canCreate`, `canEdit`, `canDelete`, `canManageMembers` based on role |
| T4 | Conditionally render UI elements | FE Dev | 1h | Hide "Delete" / "Settings" buttons for Viewers using `usePermission` |
| T5 | Test role-gated routes | QA | 2h | Test each role trying to access each route, verify 403 page shown |

---

---

# EPIC 2 — User Profile & Settings

> **Goal**: Users can manage their profile, preferences, and notification settings.
> **Priority**: 🟡 P1 — Should have (Sprint 2)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 2.1 — Profile Management

**Description**: Users can update name, avatar, bio, and change their password.

---

### Story 2.1.1 — Edit Profile Form

> **As a** user,
> **I want to** update my name and avatar,
> **so that** my teammates can identify me.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `Profile.tsx` page layout | FE Dev | 2h | Avatar section, form fields: name, bio, timezone dropdown |
| T2 | Avatar upload with preview | FE Dev | 3h | `<input type="file">` → FileReader preview → POST to `/users/avatar` (multipart), Cloudinary upload on backend |
| T3 | Crop modal for avatar | FE Dev | 2h | `react-image-crop` — circular crop, confirm before upload |
| T4 | Optimistic update on save | FE Dev | 1h | Update Redux user state immediately, rollback on API error |
| T5 | Change password sub-form | FE Dev | 2h | Current password + new + confirm, separate PATCH endpoint |
| T6 | Test avatar upload + form validation | QA | 2h | Mock Cloudinary, test file type/size validation |

---

## Feature 2.2 — App Settings

**Description**: Dark mode, language, notification preferences, timezone.

---

### Story 2.2.1 — Theme & Preferences

> **As a** user,
> **I want to** switch between light/dark/system mode,
> **so that** the app matches my system or personal preference.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Theme toggle in `Settings.tsx` | FE Dev | 1h | 3-way toggle: Light / Dark / System — uses `ThemeContext` |
| T2 | Persist theme in localStorage | FE Dev | 0.5h | On mount, read from `localStorage.theme`, apply to `<html>` class |
| T3 | Notification preferences form | FE Dev | 2h | Checkboxes: task assigned, due date reminder, mentions, digest email frequency |
| T4 | Timezone selector | FE Dev | 1h | Searchable dropdown with `Intl.supportedValuesOf('timeZone')` |
| T5 | Save prefs to backend | FE Dev | 1h | PATCH `/users/preferences` — debounced auto-save |

---

### Story 2.2.2 — Push Notification Opt-in

> **As a** user,
> **I want to** opt into push notifications,
> **so that** I get alerted about task updates even when the app isn't open.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `usePushNotification` hook | FE Dev | 2h | `Notification.requestPermission()`, `PushManager.subscribe()` with VAPID key |
| T2 | Permission request UI (contextual) | FE Dev | 1h | Don't ask on load — ask after user first saves a task (contextual prompt improves acceptance) |
| T3 | Send subscription to backend | FE Dev | 1h | POST `/notifications/subscribe` with `PushSubscription` JSON |
| T4 | Test & Demo push notification | FE Dev | 1h | Send a test push from settings page via BE endpoint |
| T5 | Unsubscribe / revoke | FE Dev | 1h | Toggle off → `sub.unsubscribe()` + DELETE `/notifications/subscribe` |

---

---

# EPIC 3 — Project Management

> **Goal**: Users can organize work into projects, invite collaborators, and manage access.
> **Priority**: 🔴 P0 — Must have (Sprint 2–3)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 3.1 — Project CRUD

**Description**: Create, rename, archive, and delete projects. Each project has a name, description, color, and members.

---

### Story 3.1.1 — Create & List Projects

> **As a** user,
> **I want to** create a new project and see all my projects,
> **so that** I can organize tasks into separate workspaces.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Projects sidebar list | FE Dev | 2h | `Sidebar.tsx` — list projects from RTK Query, active indicator, max 10 shown + "View all" |
| T2 | Create project modal | FE Dev | 2h | Modal with name (required), description, color picker (12 presets), emoji icon |
| T3 | RTK Query `projectApi` slice | FE Dev | 2h | `createProject`, `getProjects`, `updateProject`, `archiveProject` endpoints |
| T4 | Project card in grid view | FE Dev | 1h | Shows name, member avatars, task count, last updated |
| T5 | Empty state | FE Dev | 0.5h | Illustration + "Create your first project" CTA when no projects exist |
| T6 | Tests | QA | 2h | Create project flow, validation, sidebar update |

---

## Feature 3.2 — Member Management & Invites

**Description**: Project admins can invite members via email, assign roles, and remove members.

---

### Story 3.2.1 — Invite Members

> **As a** project admin,
> **I want to** invite teammates by email,
> **so that** they can collaborate on tasks.

**Story Points**: 3 | **Estimate**: 2.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Members settings page | FE Dev | 2h | Table of members with role badge, avatar, "Remove" button (admin only) |
| T2 | Invite input with multi-email | FE Dev | 2h | Tag input — type email, press Enter, add multiple, validate format |
| T3 | Role selector per invite | FE Dev | 1h | Dropdown: Member / Viewer for each invitee |
| T4 | POST `/projects/:id/invites` | FE Dev | 1h | Send array of `{email, role}` — backend sends invite emails |
| T5 | Invite acceptance page | FE Dev | 2h | `/invite/:token` route — shows project info + "Accept" button → joins project |
| T6 | Revoke pending invite | FE Dev | 1h | List pending invites, DELETE `/projects/:id/invites/:token` |
| T7 | Tests | QA | 2h | Multi-email input validation, invite send, acceptance flow |

---

### Story 3.2.2 — Role Management

> **As a** project admin,
> **I want to** change a member's role,
> **so that** access is appropriate to their responsibilities.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Inline role change dropdown | FE Dev | 1h | `<select>` in member row, disabled for self and last admin |
| T2 | PATCH `/projects/:id/members/:userId/role` | FE Dev | 1h | Optimistic update → rollback on error |
| T3 | Prevent removing last admin | FE Dev | 0.5h | Disable "Remove" + show tooltip if user is last admin |
| T4 | Transfer ownership flow | FE Dev | 2h | Modal warning → confirm → PATCH ownership to new user |

---

---

# EPIC 4 — Task Management (Kanban Board)

> **Goal**: Full task lifecycle management — create, assign, organize, and complete tasks on a visual Kanban board.
> **Priority**: 🔴 P0 — Core product value (Sprint 3–5)
> **Total Estimate**: **21 Story Points** | ~**5 weeks**

---

## Feature 4.1 — Task CRUD

**Description**: Create, view, edit, and delete tasks with rich fields: title, description (markdown), priority, status, assignee, tags, due date, attachments.

---

### Story 4.1.1 — Create Task

> **As a** member,
> **I want to** create a task with details,
> **so that** work is tracked in the system.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `CreateTaskForm.tsx` component | FE Dev | 3h | React Hook Form + Zod — title, description (Markdown textarea), priority dropdown, status select, due date picker, tag input |
| T2 | Assignee picker | FE Dev | 2h | Searchable dropdown of project members with avatar + name |
| T3 | Tag input component | FE Dev | 1h | Type tag + Enter — max 10 tags, autocomplete from existing tags |
| T4 | RTK Query `createTask` mutation | FE Dev | 1h | Invalidates `getTasks` tag — board refreshes |
| T5 | Keyboard shortcut: `N` → new task | FE Dev | 1h | `useEffect` + `keydown` listener, opens modal |
| T6 | Tests | QA | 2h | Form validation, assignee selection, tag creation, API mutation |

---

### Story 4.1.2 — Task Detail View

> **As a** member,
> **I want to** click a task and see all its details,
> **so that** I can view full context and history.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `TaskDetail.tsx` page / slide-over panel | FE Dev | 4h | Right-side slide-over (md+), full page (mobile). URL param `/tasks/:id` |
| T2 | Markdown preview for description | FE Dev | 2h | `react-markdown` + `remark-gfm` — render tables, code, bold, lists |
| T3 | Inline edit for all fields | FE Dev | 3h | Click field → becomes input/select → save on blur/Enter. Title, status, priority, assignee |
| T4 | Activity / comment feed | FE Dev | 3h | Timeline of changes: "Alice changed status to Done at 3:42 PM" + comment box |
| T5 | File attachments | FE Dev | 3h | Drag-and-drop upload (max 10MB, common types), list with preview, delete |
| T6 | Sub-tasks (checklist) | FE Dev | 2h | Add sub-task items with checkbox, progress bar showing completion % |
| T7 | Tests | QA | 3h | Render test, inline edit flow, comment posting, attachment upload mock |

---

### Story 4.1.3 — Bulk Actions

> **As a** member,
> **I want to** select multiple tasks and perform actions in bulk,
> **so that** I can manage large lists efficiently.

**Story Points**: 2 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Multi-select with checkbox | FE Dev | 2h | Checkbox on task hover, "Select all" in column header, selected count badge |
| T2 | Bulk action toolbar | FE Dev | 2h | Appears at bottom when items selected: "Move to", "Assign to", "Set Priority", "Delete" |
| T3 | Bulk API call | FE Dev | 1h | PATCH `/tasks/bulk` with `{ ids[], operation, value }` |
| T4 | Undo bulk action (5s window) | FE Dev | 2h | Toast with "Undo" button → reverse the operation |

---

## Feature 4.2 — Kanban Board

**Description**: Visual board with columns per status. Drag-and-drop cards between columns. Responsive (column scroll on mobile).

---

### Story 4.2.1 — Kanban Board Layout

> **As a** member,
> **I want to** see all tasks organized in status columns,
> **so that** I can understand the flow of work at a glance.

**Story Points**: 3 | **Estimate**: 2.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `KanbanBoard.tsx` — column grid layout | FE Dev | 2h | CSS Grid — 4 columns (lg), horizontal scroll (mobile). Column header with count badge |
| T2 | Virtual list per column | FE Dev | 2h | `react-window` `FixedSizeList` inside each column — handle 1000+ cards without lag |
| T3 | Column "Add card" quick input | FE Dev | 1h | Inline input at bottom of column → `createTask` with pre-set status |
| T4 | Skeleton loader | FE Dev | 1h | 3 skeleton cards per column while RTK Query fetches |
| T5 | Empty column state | FE Dev | 0.5h | Dashed border placeholder with icon |

---

### Story 4.2.2 — Drag-and-Drop

> **As a** member,
> **I want to** drag tasks between columns,
> **so that** I can update status visually without opening the task.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Integrate `@dnd-kit/core` | FE Dev | 2h | `DndContext` + `SortableContext` per column, `useSortable` on each card |
| T2 | Drag overlay (ghost card) | FE Dev | 2h | `DragOverlay` — shows card being dragged, semi-transparent |
| T3 | Drop zone highlight | FE Dev | 1h | Column highlights with indigo border when card hovers over it |
| T4 | Optimistic status update on drop | FE Dev | 2h | Update Redux cache instantly → PATCH API → rollback on failure |
| T5 | Sort within column | FE Dev | 2h | `arrayMove` on `dragEnd` within same column, PATCH `/tasks/reorder` |
| T6 | Touch / mobile drag support | FE Dev | 1h | `@dnd-kit/modifiers` — `restrictToWindowEdges`, touch sensor config |
| T7 | Keyboard drag (a11y) | FE Dev | 2h | `KeyboardSensor` — Space to pick up, arrows to move, Space to drop |
| T8 | Tests | QA | 3h | Simulate drag events, verify status update, verify rollback on API error |

---

## Feature 4.3 — Filters & Sorting

**Description**: Filter tasks by assignee, priority, tags, due date. Sort by date, priority, alphabetical.

---

### Story 4.3.1 — Filter Bar

> **As a** member,
> **I want to** filter the board by assignee and priority,
> **so that** I can focus on specific work.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Filter bar component | FE Dev | 2h | Sticky row above board: Assignee multi-select, Priority multi-select, Tag multi-select, Date range picker |
| T2 | Client-side filter logic | FE Dev | 2h | `useMemo` — filter RTK Query results in memory, no additional API call |
| T3 | Filter URL persistence | FE Dev | 1h | `useSearchParams` — encode filters in URL, shareable filter links |
| T4 | Active filter badges | FE Dev | 1h | Show active filters as dismissible pills above board |
| T5 | "Clear all filters" button | FE Dev | 0.5h | Resets all filters, clears URL params |
| T6 | Tests | QA | 1h | Apply filter, verify correct cards shown, clear filter |

---

---

# EPIC 5 — Real-Time Collaboration

> **Goal**: Multiple users can work on the same board simultaneously with live updates.
> **Priority**: 🟡 P1 — Should have (Sprint 6–7)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 5.1 — Live Task Updates

**Description**: When any user creates/updates/deletes a task, all users on the same board see it instantly via WebSocket.

---

### Story 5.1.1 — Socket.io Integration

> **As a** collaborator,
> **I want to** see task changes made by teammates immediately,
> **so that** I'm always working with current data.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `SocketContext.tsx` setup | FE Dev | 2h | Connect on auth, pass token in `auth` handshake, disconnect on logout |
| T2 | `useTaskSocket(projectId)` hook | FE Dev | 2h | Join project room on mount, listen to `task:created`, `task:updated`, `task:deleted` |
| T3 | Invalidate RTK Query on socket event | FE Dev | 1h | `dispatch(taskApi.util.invalidateTags([...]))` — triggers background refetch |
| T4 | Reconnection handling | FE Dev | 2h | On reconnect, force refetch all tasks (may have missed events) |
| T5 | Connection status indicator | FE Dev | 1h | Small dot in navbar: green=connected, yellow=reconnecting, red=disconnected |
| T6 | Tests | QA | 2h | Mock socket events, verify board updates |

---

## Feature 5.2 — Presence & Editing Indicators

**Description**: Show which teammates are currently viewing the board. Show "being edited by Alice" indicator on task being edited by another user.

---

### Story 5.2.1 — Online Presence Avatars

> **As a** collaborator,
> **I want to** see who else is on the board,
> **so that** I know who I might be working with simultaneously.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Emit `user:joined` on project room enter | FE Dev | 1h | Socket emit with `{ userId, projectId }` on `useTaskSocket` mount |
| T2 | Presence avatars in board header | FE Dev | 2h | Show up to 5 avatars, +N overflow. Pulse animation on active users |
| T3 | Task "being edited" lock indicator | FE Dev | 2h | Emit `task:editing` on focus of task detail. Show editor's avatar overlay on card |
| T4 | Clear presence on disconnect | FE Dev | 1h | Backend: remove user from room on `disconnect` event |

---

## Feature 5.3 — Activity Feed

**Description**: Project-level activity log showing all changes — who changed what and when.

---

### Story 5.3.1 — Activity Log Panel

> **As a** team lead,
> **I want to** see a log of all recent activity,
> **so that** I can track what the team has been working on.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Activity feed sidebar panel | FE Dev | 2h | Right panel (collapsible), shows 50 most recent events, infinite scroll for older |
| T2 | Activity item component | FE Dev | 2h | Avatar + action text (auto-generated from `{ actor, action, entity, changes }`) + relative time |
| T3 | Real-time activity via socket | FE Dev | 1h | Listen to `activity:created` event → prepend to feed |
| T4 | Filter by user or action type | FE Dev | 2h | Toggle filter pills: All / Tasks / Comments / Members |
| T5 | Infinite scroll / pagination | FE Dev | 2h | `IntersectionObserver` at bottom → fetch older activities |

---

---

# EPIC 6 — Notifications

> **Goal**: Users stay informed about relevant events without having to constantly check the app.
> **Priority**: 🟡 P1 — Should have (Sprint 7–8)
> **Total Estimate**: **11 Story Points** | ~**2.5 weeks**

---

## Feature 6.1 — In-App Notifications

**Description**: Notification bell with unread count. Panel showing recent notifications.

---

### Story 6.1.1 — Notification Bell & Panel

> **As a** user,
> **I want to** see a notification count and read my notifications,
> **so that** I don't miss important updates.

**Story Points**: 5 | **Estimate**: 3.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `notificationSlice` in Redux | FE Dev | 1h | State: `{ items[], unreadCount, isLoading }`. Actions: `markAsRead`, `markAllRead`, `addNotification` |
| T2 | Notification bell icon | FE Dev | 1h | In Navbar — red badge with unread count, animate-bounce when new notification arrives |
| T3 | Notification panel dropdown | FE Dev | 3h | Slide-down panel — scrollable list of notification items, "Mark all read" button, grouping by date |
| T4 | Notification item component | FE Dev | 2h | Avatar of actor, action text, task title link, timestamp, unread dot |
| T5 | Real-time via socket | FE Dev | 1h | Listen `notification:new` → dispatch `addNotification`, increment unread count, show toast |
| T6 | Mark as read on click | FE Dev | 1h | PATCH `/notifications/:id/read` → navigate to task |
| T7 | Tests | QA | 2h | Unread count, mark as read, real-time append |

---

## Feature 6.2 — Push Notifications

**Description**: Browser push for: task assigned to you, task due tomorrow, you are mentioned in a comment.

---

### Story 6.2.1 — Push Notification Triggers

> **As a** user,
> **I want to** receive push notifications when I'm assigned a task or mentioned,
> **so that** I respond promptly even when the app isn't open.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Opt-in flow with contextual prompt | FE Dev | 1h | Trigger after first task created (not on load) — improves opt-in rate |
| T2 | SW push event handler | FE Dev | 2h | `showNotification` with title, body, icon, action buttons ("View" / "Dismiss"), `tag` for dedup |
| T3 | Notification click → navigate | FE Dev | 1h | SW `notificationclick` → `clients.openWindow('/tasks/:id')` |
| T4 | Due date reminder scheduling | BE Dev | 3h | CRON job — find tasks due tomorrow, send push to assignee |
| T5 | Tests | QA | 2h | Mock push event, verify notification shown, click navigation |

---

## Feature 6.3 — Email Digest

**Description**: Daily or weekly email summarizing: tasks due soon, overdue tasks, mentions.

---

### Story 6.3.1 — Email Digest Preferences

> **As a** user,
> **I want to** receive a weekly email summary of my tasks,
> **so that** I have an overview of my workload at the start of each week.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Digest frequency selector in Settings | FE Dev | 1h | Radio: None / Daily / Weekly (Monday). Save to `/users/preferences` |
| T2 | Email digest BE job | BE Dev | 4h | Bull queue CRON — query due/overdue tasks per user, render HTML email via template |
| T3 | Unsubscribe link | BE Dev | 1h | One-click unsubscribe token in email footer → PATCH user preference |
| T4 | Preview digest in Settings | FE Dev | 1h | "Preview digest" button → GET `/notifications/digest/preview` → render in modal |

---

---

# EPIC 7 — PWA & Offline Support

> **Goal**: The app works offline, can be installed on device, and syncs when connection restores.
> **Priority**: 🔴 P0 — Core differentiator (Sprint 3–4)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 7.1 — Service Worker & Caching

**Description**: Workbox-powered service worker pre-caches the app shell, runtime-caches API responses.

---

### Story 7.1.1 — App Shell Precaching

> **As a** user,
> **I want to** open the app instantly on repeat visits,
> **so that** I don't wait for network on every load.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Configure `vite-plugin-pwa` | FE Dev | 2h | `registerType: 'autoUpdate'`, `globPatterns`, `workbox` config in `vite.config.ts` |
| T2 | Precache app shell assets | FE Dev | 1h | `precacheAndRoute(self.__WB_MANIFEST)` — all JS, CSS, HTML |
| T3 | Runtime caching strategies | FE Dev | 2h | Tasks API: NetworkFirst(5s timeout). Images: CacheFirst(30d). Fonts: StaleWhileRevalidate |
| T4 | Cache versioning / cleanup | FE Dev | 1h | `cleanupOutdatedCaches()` — remove stale caches on SW activate |
| T5 | Offline fallback page | FE Dev | 1h | Custom `/offline.html` served when network request fails and no cache hit |
| T6 | Lighthouse PWA audit | QA | 2h | Run Lighthouse in CI, assert all PWA checks pass, score ≥ 90 |

---

### Story 7.1.2 — Background Sync

> **As a** user,
> **I want to** create/update tasks while offline,
> **so that** my changes are saved when I reconnect.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `BackgroundSyncPlugin` for mutations | FE Dev | 2h | Queue POST/PATCH/DELETE `/tasks` requests in `task-mutations` queue |
| T2 | Offline task creation UI | FE Dev | 2h | Allow form submission offline — store in IndexedDB, show "Pending sync" badge on card |
| T3 | Sync status indicator | FE Dev | 2h | Badge: "3 changes pending sync" in navbar. Clears when sync completes |
| T4 | Conflict resolution strategy | FE Dev | 3h | Last-write-wins with `updatedAt` comparison. Show conflict banner if server version newer |
| T5 | Optimistic updates everywhere | FE Dev | 2h | RTK Query `updateQueryData` → instant UI, rollback on API error |
| T6 | Tests | QA | 3h | Simulate offline → create task → go online → verify sync |

---

## Feature 7.2 — PWA Install & Update UX

**Description**: Install prompt, update banner, splash screen, home screen icon.

---

### Story 7.2.1 — Install Prompt & Update Banner

> **As a** user,
> **I want to** install TaskFlow on my device,
> **so that** I have quick access without the browser chrome.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `useInstallPrompt` hook | FE Dev | 1h | Capture `beforeinstallprompt`, expose `install()` function |
| T2 | Install CTA banner | FE Dev | 2h | Subtle sticky banner after 3rd visit: "📲 Install TaskFlow for a better experience" |
| T3 | Update available banner | FE Dev | 1h | On SW `onNeedRefresh` event → banner with "Update now" → `skipWaiting()` |
| T4 | Offline ready toast | FE Dev | 1h | On `onOfflineReady` → toast: "✅ Ready for offline use!" |
| T5 | Web manifest icons all sizes | FE Dev | 1h | Generate all required icon sizes (72–512), maskable version for Android |
| T6 | Manifest shortcuts | FE Dev | 0.5h | Quick-action shortcuts: "New Task" → `/tasks/new`, "Dashboard" → `/dashboard` |

---

---

# EPIC 8 — Search & Filters

> **Goal**: Users can quickly find any task, comment, or project using a fast, global search.
> **Priority**: 🟡 P1 — Should have (Sprint 8–9)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 8.1 — Global Search

**Description**: Command-palette style search (`Cmd+K`) across tasks, projects, and members.

---

### Story 8.1.1 — Search Command Palette

> **As a** user,
> **I want to** press Cmd+K and search across everything,
> **so that** I can navigate to any task or project instantly.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `CommandPalette.tsx` component | FE Dev | 3h | Modal overlay triggered by `Cmd+K` / `Ctrl+K`. Input with instant results. Keyboard nav |
| T2 | Debounced search API call | FE Dev | 1h | 300ms debounce → GET `/search?q=...&limit=10`. Grouped results: Tasks / Projects / Members |
| T3 | Highlighted match in results | FE Dev | 2h | Bold the matched substring in result titles |
| T4 | Recent searches | FE Dev | 1h | Store last 5 searches in localStorage, show when palette opens empty |
| T5 | Keyboard navigation | FE Dev | 2h | Arrow keys to navigate results, Enter to select, Esc to close |
| T6 | Navigate to task/project on select | FE Dev | 1h | `useNavigate` to `/tasks/:id` or `/projects/:id` |
| T7 | Tests | QA | 2h | Keyboard open/close, typing debounce, navigation on select |

---

## Feature 8.2 — Advanced Filters (Saved Filters)

**Description**: Save frequently used filter combinations as named filter presets.

---

### Story 8.2.1 — Saved Filter Presets

> **As a** member,
> **I want to** save my filter combinations,
> **so that** I can quickly switch between "My high-priority tasks" and "All overdue" views.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | "Save filter" button | FE Dev | 1h | Appears when filters are active → opens name input modal |
| T2 | Filter presets sidebar section | FE Dev | 2h | Below project list — list of saved filters with icon, click to apply |
| T3 | POST/DELETE `/projects/:id/filters` | FE Dev | 1h | Persist filters to backend (serialized filter state JSON) |
| T4 | Share filter link | FE Dev | 1h | Copy shareable URL with filter params encoded (team members can open same view) |

---

---

# EPIC 9 — Dashboard & Analytics

> **Goal**: Project leads and members have visual insight into team productivity and project health.
> **Priority**: 🟢 P2 — Nice to have (Sprint 10–12)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 9.1 — Personal Dashboard

**Description**: "My Work" view — tasks assigned to me, upcoming due dates, completion summary.

---

### Story 9.1.1 — My Work Dashboard

> **As a** member,
> **I want to** see all tasks assigned to me in one place,
> **so that** I know exactly what I need to work on today.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Dashboard page layout | FE Dev | 2h | Responsive grid: stats row (top) + tasks list (main) + upcoming (side) |
| T2 | Stats row widgets | FE Dev | 3h | 4 cards: Total assigned / Completed today / Overdue / Due this week. Animated count-up |
| T3 | "My tasks" list with quick-complete | FE Dev | 2h | Checkbox to mark done inline. Sorted by due date. Group: Overdue / Today / This week |
| T4 | Completion streak | FE Dev | 2h | GitHub-style heatmap calendar — days with completed tasks colored by intensity |
| T5 | Upcoming deadlines timeline | FE Dev | 2h | Vertical timeline for next 7 days — clustered task pills per day |
| T6 | Tests | QA | 2h | Stats calculation, task completion |

---

## Feature 9.2 — Project Analytics

**Description**: Burndown chart, task distribution by status/assignee, velocity tracking.

---

### Story 9.2.1 — Burndown Chart

> **As a** project lead,
> **I want to** see a burndown chart,
> **so that** I can track if we're on schedule to complete the project.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `recharts` line chart setup | FE Dev | 2h | Ideal line vs actual completion line. Responsive container |
| T2 | GET `/projects/:id/analytics/burndown` | FE Dev | 1h | RTK Query endpoint — returns `{ date, ideal, actual }[]` |
| T3 | Velocity chart (bar chart) | FE Dev | 2h | Tasks completed per week for last 8 weeks |
| T4 | Task distribution donut chart | FE Dev | 2h | Tasks per status (%) — animated on load |
| T5 | Assignee workload chart | FE Dev | 2h | Horizontal bar per member: task count by status — identify overloaded members |
| T6 | Export as PDF | FE Dev | 2h | `@react-pdf/renderer` — generate PDF report of all charts |

---

## Feature 9.3 — Sprint / Milestone Tracking

**Description**: Group tasks into sprints or milestones with start/end date and track progress.

---

### Story 9.3.1 — Milestones

> **As a** project lead,
> **I want to** create milestones and assign tasks to them,
> **so that** I can track delivery towards project goals.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Create milestone modal | FE Dev | 1h | Name, target date, description — POST `/projects/:id/milestones` |
| T2 | Assign tasks to milestone | FE Dev | 2h | Dropdown on task detail: "Milestone" field |
| T3 | Milestone progress bar | FE Dev | 1h | % of milestone tasks completed, shown on milestone list |
| T4 | Milestone filter on board | FE Dev | 1h | Filter board to show only tasks in selected milestone |

---

---

# EPIC 10 — Performance & Accessibility

> **Goal**: The app scores ≥ 90 on all Lighthouse categories and meets WCAG 2.1 AA.
> **Priority**: 🟡 P1 — Cross-cutting concern (Sprint 4 + ongoing)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 10.1 — Performance Optimization

---

### Story 10.1.1 — Code Splitting & Bundle Optimization

> **As a** user,
> **I want to** load the app in under 3 seconds on a slow 3G connection,
> **so that** the product feels fast regardless of network.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Route-level code splitting | FE Dev | 1h | `React.lazy()` on all page components, `Suspense` fallback skeleton |
| T2 | Analyze bundle with `rollup-plugin-visualizer` | FE Dev | 1h | Identify and remove unused large deps |
| T3 | Tree-shake icon library | FE Dev | 0.5h | Import icons individually, not full package |
| T4 | Virtualize Kanban columns | FE Dev | 2h | `react-window` — only render visible task cards |
| T5 | Image lazy loading | FE Dev | 0.5h | `loading="lazy"` on avatars and attachments |
| T6 | Font preload + display:swap | FE Dev | 0.5h | `<link rel="preload">` for primary font, `font-display: swap` |
| T7 | Lighthouse CI in pipeline | QA | 2h | `@lhci/cli` in GitHub Actions — fail CI if score drops below 85 |

---

## Feature 10.2 — Accessibility (a11y)

---

### Story 10.2.1 — WCAG 2.1 AA Compliance

> **As a** user with accessibility needs,
> **I want to** use TaskFlow with a screen reader and keyboard only,
> **so that** I have equal access to all features.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Skip navigation link | FE Dev | 0.5h | `<a href="#main">Skip to main content</a>` — visible on focus |
| T2 | Focus management in modals | FE Dev | 2h | Focus first interactive element on open, trap Tab within modal, restore on close |
| T3 | `aria-live` regions | FE Dev | 1h | Announce task status changes, form errors, notifications to screen readers |
| T4 | Keyboard drag-and-drop | FE Dev | 2h | `KeyboardSensor` in `@dnd-kit` — Space to grab, arrows to move, Space to drop |
| T5 | Color contrast audit | QA | 2h | All text ≥ 4.5:1 ratio (AA). Use `axe-core` in tests |
| T6 | Icon-only button labels | FE Dev | 1h | All icon buttons have `aria-label` or `<title>` |
| T7 | `axe-core` in Vitest | QA | 2h | `@axe-core/react` — run a11y check on all page renders in tests |

---

---

# Sprint Plan Summary

| Sprint | Duration | Epics / Focus | Deliverables | Velocity |
|---|---|---|---|---|
| **Sprint 1** | Wk 1–2 | Epic 1 (Auth) + Project setup | Register, Login, Google OAuth, RBAC, PWA shell | 13 SP |
| **Sprint 2** | Wk 3–4 | Epic 2 (Profile) + Epic 3 start | User settings, dark mode, push opt-in, project CRUD | 13 SP |
| **Sprint 3** | Wk 5–6 | Epic 3 (Members) + Epic 4 start | Invite system, Task CRUD, Task Detail | 13 SP |
| **Sprint 4** | Wk 7–8 | Epic 4 (Kanban) + Epic 7 (PWA) | Kanban board, Drag-and-drop, Service Worker, Offline | 21 SP |
| **Sprint 5** | Wk 9–10 | Epic 4 (Filters) + Epic 10 start | Filter bar, Bulk actions, Code splitting, a11y audit | 13 SP |
| **Sprint 6** | Wk 11–12 | Epic 5 (Real-time) | Socket.io live updates, Presence indicators | 13 SP |
| **Sprint 7** | Wk 13–14 | Epic 5 (Activity) + Epic 6 start | Activity feed, In-app notifications | 13 SP |
| **Sprint 8** | Wk 15–16 | Epic 6 (Push + Email) + Epic 8 | Push notifications, Email digest, Search palette | 13 SP |
| **Sprint 9** | Wk 17–18 | Epic 8 (Filters) + Epic 7 (BGSync) | Saved filters, Background sync, Conflict resolution | 11 SP |
| **Sprint 10** | Wk 19–20 | Epic 9 (Dashboard) | My Work dashboard, completion heatmap | 13 SP |
| **Sprint 11** | Wk 21–22 | Epic 9 (Analytics) | Burndown, velocity, workload charts | 13 SP |
| **Sprint 12** | Wk 23–24 | Epic 9 (Milestones) + Epic 10 | Sprint tracking, Lighthouse CI, WCAG audit | 11 SP |
| **Sprint 13** | Wk 25–26 | Hardening + Launch | Bug fixes, load testing, monitoring setup, launch | 8 SP |

---

## Story Point Reference

| Points | Complexity | Time Estimate |
|---|---|---|
| **1 SP** | Trivial — config change, copy update | < 2 hours |
| **2 SP** | Simple — single component, clear requirements | 0.5–1 day |
| **3 SP** | Medium — multiple components, API integration | 1–2 days |
| **5 SP** | Complex — new feature, multi-layer, edge cases | 2–4 days |
| **8 SP** | Very complex — significant unknowns, cross-team | 4–6 days |
| **13 SP** | Too large — must be split into smaller stories | Decompose! |

---

## Definition of Ready (DoR)

> A story is **ready** to be picked into a sprint when:

- [ ] **Clear title** following format: `As a [role], I want to [action], so that [value]`
- [ ] **Acceptance criteria** written as testable conditions (Given/When/Then or checklist)
- [ ] **Story points** estimated by the whole team (Planning Poker)
- [ ] **UI mockup or wireframe** available for FE stories
- [ ] **API contract** agreed (request/response shape, error codes)
- [ ] **Dependencies** identified and resolved (or story is blocked + noted)
- [ ] **No ambiguity** — team can answer the story without PM clarification
- [ ] Story points **≤ 8** (if larger, decompose)

---

## Definition of Done (DoD)

> A story is **done** when ALL of the following are true:

- [ ] All acceptance criteria met
- [ ] Code reviewed and merged to `develop` branch
- [ ] Unit tests written covering happy path + edge cases (coverage ≥ 80%)
- [ ] Integration tests passing in CI
- [ ] No new lint / TypeScript errors introduced
- [ ] Responsive design verified on: iPhone SE (375px), iPad (768px), Desktop (1440px)
- [ ] Dark mode verified
- [ ] Accessibility checked: keyboard nav, `aria` labels, focus management
- [ ] PWA integrity maintained (Lighthouse PWA pass)
- [ ] PM / Stakeholder demo sign-off in Sprint Review

---

## Grooming Checklist

> Run **Backlog Grooming** every Wednesday (mid-sprint), 1 hour max.

```
Grooming Agenda
───────────────────────────────────────────────
✅ 1. Review current sprint status (10 min)
   - Blockers? Risks to sprint goal?

✅ 2. Refine top 10 backlog items (30 min)
   - Read story aloud
   - Clarify acceptance criteria
   - Identify missing design/API dependency
   - Split any story > 8 SP

✅ 3. Story point voting (15 min)
   - Planning Poker (Fibonacci: 1,2,3,5,8,13)
   - Discuss outliers — converge on consensus
   - Note any spikes needed (research tasks)

✅ 4. Update backlog priority (5 min)
   - Confirm next sprint's candidate stories
   - Ensure all have DoR met

Grooming Output
───────────────────────────────────────────────
→ Top 15 stories refined and estimated
→ Next sprint's stories meet DoR
→ Epic progress updated
→ Blockers raised to PM / stakeholder
```

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Drag-and-drop complex on mobile touch | High | High | Spike in Sprint 4 — `@dnd-kit` touch support evaluation |
| Background sync conflict resolution | High | Medium | Last-write-wins + conflict banner — acceptable MVP trade-off |
| Push notification opt-in rate low | Medium | High | Contextual prompting (not on load), A/B test prompt copy |
| Real-time at scale (10k users) | High | Medium | Redis Pub/Sub + Socket.io cluster adapter from Sprint 6 |
| PWA install blocked by browser policy | Low | Low | Graceful degradation — app works fully without install |
| Lighthouse score regression | Medium | Medium | Lighthouse CI in GitHub Actions — gates merge to main |
| Team velocity drops mid-project | Medium | Medium | Buffer sprint (Sprint 13) for hardening |
