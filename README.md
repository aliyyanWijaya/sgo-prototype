# SavGoSpend (SGO)

A dignity-first smart rewards app for independent travellers aged 65 and over.

---

## About

SavGoSpend connects senior travellers with participating retailers and local travel information, guided by a warm in-app companion called **Aroha**. This repository contains a working MVP prototype built to demonstrate core functionality based on SGO's living Build Brief.

---

## Features Implemented

- **Onboarding flow** — welcome screen, opt-in settings (notifications, location sharing, larger text), completion confirmation
- **Home screen** — three-tile navigation (Nearby Retailers, What's On, Good to Know)
- **Digital membership card** — offline-available card with mock member data (name, member number, tier, join date), persisted locally
- **Aroha AI companion** — chat widget powered by the Anthropic Claude API, with a warm, plain-language persona and a first-encounter pronunciation guide
- **Nearby Retailers map** — interactive map (react-native-maps) with sample retailer markers, profiles, and a list view alternative
- **Smart Rewards UI** — five-tier progression display (Bronze → Silver → Gold → Platinum → Kiwi Elite) with mock points
- **Post a Tip** — community tip submission form with a pending review list
- **Emergency SOS button** — fixed header button on the Home screen with a confirmation flow before simulating an emergency alert
- **Accessibility** — global Larger Text toggle affecting font scale across the app

---

## Tech Stack

- **React Native (Expo)** — cross-platform mobile framework
- **React Navigation** — tab-based navigation (Home, Card, Map, Profile)
- **AsyncStorage** — local persistence (onboarding status, member data, accessibility preferences)
- **react-native-maps** — Nearby Retailers map view
- **Express.js** — lightweight backend serving the Aroha chat endpoint
- **Anthropic Claude API** — powers Aroha's conversational responses
- **React Context API** — global state for accessibility and user preferences

---

## How to Run Locally

### Prerequisites

- Node.js and npm installed
- Expo Go app (for testing on a physical device) or an iOS/Android emulator
- An Anthropic API key (for Aroha chat functionality)

### Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Set up the backend server for Aroha:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` folder with:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

   Then start the backend:

   ```bash
   node server.js
   ```

3. In a separate terminal, start the Expo app from the project root:

   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go, or press `i` / `a` to launch an iOS/Android emulator.

---

## Roadmap — Not Yet Implemented

This MVP focuses on demonstrating core user flows and interactions. The following are planned for a full production build:

- **Firebase authentication and real data storage** — current version uses local mock data and AsyncStorage only
- **SGO admin panel** — for founders to manage tips and retailer listings
- **Google Translate API / DeepL multilingual support**
- **Full compliance work for the NZ Privacy Act 2020**
- **Country-specific animated map markers** (Kiwi for NZ, Kangaroo for Australia) — stretch goal

---

## Note

This is a 3-day MVP prototype built as part of an internship application, based on an approved design system and a comprehensive Build Brief provided by SGO's founders. It is intended to demonstrate technical capability and understanding of the product vision, not as a production-ready release.
