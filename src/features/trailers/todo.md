# 📝 TODO.md — Dump Trailer Admin Portal

---

## ✅ Completed (Ready)

- [x] **Trailer Domain Type** (`Trailer`, `TrailerUsageHistory`, `TrailerBookedDates`)
- [x] **AuthProvider and useAuth Hook** (login/logout/session management)
- [x] **ProtectedRoute**, **GuestRoute**, **RoleGuard** components
- [x] **AppLayout**, **Sidebar**, **Header** scaffolding
- [x] **Basic Routing Setup** (`routes/index.tsx` with route guards)
- [x] **TrailerList Component** (Table-based trailer overview)
- [x] **TrailerForm Component** (Vanilla `useState` version)
- [x] **TrailerPhotos Component** (Image gallery with remove action)
- [x] **formatCurrency Utility**
- [x] **formatTrailerStatus Utility**

---

## 🚀 Next Build Priorities

### 1. Trailer Feature API Layer
- [ ] `api/getAllTrailers.ts`
- [ ] `api/getTrailerById.ts`
- [ ] `api/createTrailer.ts`
- [ ] `api/updateTrailer.ts`
- [ ] `api/deleteTrailer.ts`
- [ ] `api/uploadTrailerImages.ts`
- [ ] `api/getTrailerBookings.ts`

### 2. Trailer Hooks (Data Fetching/Mutations)
- [ ] `hooks/useTrailers.ts`
- [ ] `hooks/useTrailer.ts`
- [ ] `hooks/useCreateTrailer.ts`
- [ ] `hooks/useUpdateTrailer.ts`
- [ ] `hooks/useDeleteTrailer.ts`
- [ ] `hooks/useTrailerBookings.ts`

### 3. TrailersPage.tsx
- [ ] Create page that pulls:
  - Trailer list
  - Trailer form (modal or drawer)
  - Trailer details (drawer)

### 4. Image Upload Logic
- [ ] Build `FileUpload` component (drag/drop or select)
- [ ] Connect to `TrailerPhotos` for new uploads

### 5. Global Error/Loading Handling
- [ ] Add centralized loading spinners
- [ ] Add error boundary or simple error states (trailers, auth, etc.)

---

## 🛠️ Secondary Tasks (Future)

- [ ] Role-based Sidebar Links (`admin` vs `staff`)
- [ ] Booking module API and UI setup
- [ ] Payments module API and UI setup
- [ ] Agreement signing flow (DocuSign or in-house)
- [ ] Dashboard analytics (revenue, booking volume)

---

## 🗺️ High-Level Priority Order

| Priority | Task |
|:--------:|:-----|
| 🔥 | Trailer API + Hooks |
| 🔥 | TrailersPage Integration |
| 🚀 | Trailer Image Upload Feature |
| 🚀 | Error/Loading Handling |
| 🧹 | UI Polish (Sidebar, Header improvements) |
| 🛠️ | Expand to Bookings, Payments, Agreements |