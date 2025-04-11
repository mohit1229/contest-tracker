
# 🧠 SyntaxContest - Coding Contest Tracker

A web app to track coding contests from **LeetCode**, **Codeforces**, and **CodeChef**, with features like bookmarking, reminders, Google Calendar integration, and note-taking – personalized per user.

---

## 🚀 Features

- 📅 View upcoming and past contests (last 10)
- 🔖 Bookmark contests
- ⏰ Set Google Calendar reminders
- 📝 Add notes and solution links
- 🔐 Clerk-authenticated user-specific data
- 🧠 Clean and modular backend using `Next.js` App Router and `Prisma`

---

## ⚙️ Tech Stack

| Purpose           | Tech/Service       |
|------------------|--------------------|
| Frontend         | Next.js (App Router) |
| Backend/API      | Node.js + Server Actions |
| ORM              | Prisma              |
| Auth             | Clerk.dev           |
| Calendar Sync    | Google Calendar API |
| Contest APIs     | LeetCode, Codeforces, CodeChef |

---

## 🗂️ Project Structure

```
/lib
  ├── platform-fetchers.ts     // Fetch contests from external APIs
  ├── getContests.ts           // Fetch contests from DB with user data
  ├── contests-utils.ts        // Transform contests
  ├── getOrCreateUser.ts       // Sync Clerk user with DB
  ├── prisma.ts                // Prisma client

/actions
  ├── bookmark.ts              // Toggle bookmark status
  ├── reminder.ts              // Toggle reminder + Google Calendar
  ├── fetch-contests.ts        // Upsert fetched contests to DB

/types
  └── contest.ts               // Shared contest type definitions
```

---

## 🧩 Core Modules

### 📥 1. Fetching Contests (`lib/platform-fetchers.ts`)

Fetches contests from:
- ✅ LeetCode (GraphQL)
- ✅ Codeforces (REST)
- ✅ CodeChef (REST)


```

---

### 🔃 2. Upserting to DB (`actions/fetch-contests.ts`)

- Transforms contests
- Performs `prisma.contest.upsert()` to sync data without duplicates
- Skips updating user-specific fields like notes, reminders

---

### 📦 3. Getting Contests from DB (`lib/getContests.ts`)

- Fetches `upcoming` and `previous` contests
- Includes user-specific info using `userContests` relation
- Returns normalized data structure

---

### 👤 4. User Management (`lib/getOrCreateUser.ts`)

- Uses Clerk’s `auth()` to fetch current user
- Creates or finds corresponding user in Prisma
- Links with `GoogleAccount` and `UserContest`

---

### 🧷 5. Bookmark (`actions/bookmark.ts`)

- Toggle bookmark per contest per user
- Uses composite key `userId + contestId` in `UserContest` table

---

### ⏰ 6. Reminder (`actions/reminder.ts`)

- Toggle reminder status
- On enable:
  - Fetches user’s Google Calendar tokens
  - Creates an event in their calendar with contest details
- Event includes contest title, link, and time

---

## 🔐 Authentication

- Powered by **Clerk.dev**
- All API routes and server actions check for logged-in user via `auth()`
- Each user is tied to their own bookmarks, reminders, notes

---

## 📅 Google Calendar Integration

- When a reminder is set:
  - The event is created in the user’s Google Calendar using access/refresh tokens
  - Includes: title, URL, start/end time
- Stored via `GoogleAccount` model

---

## 🛠️ Setup & Installation

### 1. Clone and Install

```bash
git clone https://github.com/your-username/coding-contest-tracker.git
cd coding-contest-tracker
npm install
```

---

### 2. Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/contestdb
CLERK_SECRET_KEY=your-clerk-secret
CLERK_PUBLISHABLE_KEY=your-clerk-publishable
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

### 3. Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### 4. Run Dev Server

```bash
npm run dev
```

---

## 🧪 To Do / Future Plans

- [ ] Frontend UI for user interaction
- [ ] Discuss page
- [ ] Geeksforgeeks integration
- [ ] Contest filtering, search, tags
- [ ] Email or SMS reminders
- [ ] Admin dashboard
- [ ] ML-based contest recommendations

---

## 🤝 Contributing

Want to help improve the tracker? PRs and issues are welcome!

---

## 📄 License

MIT License

---
