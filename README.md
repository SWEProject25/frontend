# Hankers

<div align="center">
  <img src="public/favicon.svg" alt="Hankers Logo" width="120" height="120" />
  <h2>Modern Social Networking Platform — Frontend</h2>
  <p>A scalable, feature‑first frontend inspired by Twitter/X</p>
  <a href="https://hankers.tech" target="_blank"><strong>🔗 Live Demo: hankers.tech</strong></a>
</div>

---

## 📌 Overview

**Hankers Frontend** is a production‑ready social networking UI built with **Next.js (App Router)** and **TypeScript**, designed using a **feature‑based modular architecture**. The project prioritizes **scalability**, **maintainability**, **performance**, and **developer experience**, making it suitable for large‑scale frontend teams and long‑term growth.

The codebase mirrors real‑world frontend engineering practices: isolated features, strict typing, predictable state, testability, and modern UI patterns.

---

## ✨ Key Frontend Features

* 🔐 **Authentication UI** — login, signup, OTP, captcha, password reset
* 🧑‍🎨 **User Profiles** — avatars, bios, cover images, profile editing
* 📰 **Timeline Feed** — infinite scrolling, posts, replies, likes, reposts
* 🔍 **Explore & Search** — trends, hashtags, interests, real‑time search
* 💬 **Messaging UI** — real‑time chat, group conversations, indicators
* 🔔 **Notifications** — live badges, unread states, Firebase integration
* ⚙️ **Settings** — privacy, security, notification preferences
* 📱 **Responsive Design** — mobile‑first, desktop‑ready, PWA‑friendly
* ♿ **Accessibility** — keyboard navigation, ARIA, contrast support

---

## 🧱 Architecture Philosophy

Hankers follows a **Feature‑First Architecture**, where each feature is:

* Fully **self‑contained**
* Independently **testable**
* Easy to **scale and refactor**

This avoids monolithic `components/` or `hooks/` folders and instead groups logic by *business domain*.

> ✅ This structure is ideal for large frontend codebases and multi‑developer teams.

---

## 🛠 Tech Stack

### Core

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **UI**: React, Tailwind CSS

### State & Data

* **Server State**: React Query
* **Client State**: Context API + feature stores
* **API Layer**: RESTful services (feature‑scoped)

### Testing & Quality

* **Unit & Integration**: Vitest
* **UI Testing**: React Testing Library
* **Mocking**: MSW (Mock Service Worker)

### Tooling & Deployment

* **CI/CD**: GitHub Actions
* **Hosting**: AWS
* **Linting & Formatting**: ESLint, Prettier

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

You can start editing the app from:

```
src/app/page.tsx
```

---

## 📁 Project Structure

```text
frontend/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   ├── assets/            # Shared static assets
│   ├── components/        # Global reusable UI components
│   ├── constants/         # Global constants
│   ├── features/          # Feature‑based modules (core of the app)
│   ├── hooks/             # Global reusable hooks
│   ├── lib/               # Providers & app configuration
│   ├── mocks/             # MSW setup & mock handlers
│   ├── services/          # Global API services
│   ├── test/              # Test utilities & setup
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Helper utilities
└── config files
```

---

## 🧩 Feature Module Pattern

Each feature inside `src/features/` follows a consistent internal structure:

```text
feature-name/
├── components/
├── hooks/
├── services/
├── store/
├── constants/
├── types/
├── tests/
└── utils/
```

This ensures:

* Clear ownership of logic
* Easy deletion or refactor of features
* Minimal cross‑feature coupling

---

## 🧪 Testing Strategy

* **Unit tests** for hooks, utilities, and services
* **Component tests** for UI behavior
* **Integration tests** for feature flows
* **MSW** used to mock APIs consistently across tests

Testing lives **inside each feature**, close to the code it validates.

---

## 🌍 Live Demo

* **Production**: [https://hankers.tech](https://hankers.tech)

---

## 🧠 Best Practices Used

* Feature‑first folder structure
* Strict TypeScript typing
* API abstraction via services
* Separation of UI, logic, and state
* Optimistic UI updates
* Accessibility‑aware components
* Test‑driven mindset

---

## 🎨 Frontend Team

<table>
<tr>
  <td align="center">
    <a href="https://github.com/Abdelrahman-Adel610">
      <img src="https://github.com/Abdelrahman-Adel610.png" width="100">
      <br />
      <sub><b>Abdelrahman Adel</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/ahmedfathy0-0">
      <img src="https://github.com/ahmedfathy0-0.png" width="100">
      <br />
      <sub><b>Ahmed Fathy</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/YousefAdel23">
      <img src="https://github.com/YousefAdel23.png" width="100">
      <br />
      <sub><b>Yousef Adel</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/AMYasserF">
      <img src="https://github.com/AMYasserF.png" width="100">
      <br />
      <sub><b>Ammar Yasser</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/engmohamed-emad">
      <img src="https://github.com/engmohamed-emad.png" width="100">
      <br />
      <sub><b>Mohamed Emad</b></sub>
    </a>
  </td>
</tr>
</table>

---

## 📄 License

This project is for educational and portfolio purposes.

---

> ⭐ If you find this frontend architecture useful, consider starring the repository!
