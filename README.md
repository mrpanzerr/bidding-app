# Bidding App

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) | 
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/) | 
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/) | 
[![Firebase](https://img.shields.io/badge/Firebase-Active-yellowgreen)](https://firebase.google.com/) | 
[![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)](https://vercel.com/)

A streamlined bidding tool built for general contractors. This project replaces the slow, error-prone process of handwritten estimates with a faster, digital alternative. Built from the ground up to reflect how real contractors think, work, and price.

🔗 [Live Site](https://bidding-i81vx3i2u-mrpanzerrs-projects.vercel.app)

---

## What It Does

This app helps general contractors:

- Manage multiple construction projects at once  
- Create custom calculators within each project for:
  - Square footage and price estimates  
  - Descriptions and work breakdowns  
  - Real-time total calculations  
- Rename or delete projects and calculators instantly  
- (Coming soon) Generate a printable bid-ready document with full cost breakdown

It’s built to feel familiar to contractors — simple, clear, and focused — while saving them hours of manual work.

---

## Current Status

- Core functionality is working and deployed  
- Firebase backend is fully connected for real-time data sync  
- UI is clean but minimal — visual polish is on the roadmap  
- User authentication is set up on Firebase but not yet integrated  
- Roadmap features (printable summaries, role-based access, import/export tools) are planned and in progress  
- ESLint is configured and enforced  
- App is manually tested across workflows to ensure reliability; automated tests will be added later

---

## Features

> **Project & Calculator Management**
- Create, rename, and delete projects  
- Add calculators per project with nested pricing and descriptions  
- Real-time total calculations

> **Data Handling**
- Firestore-backed database for live sync  
- All calculations persist instantly — no refresh needed  
- Vercel deployment with live updates

> **Roadmap**
- PDF export for client-ready bids  
- Role-based login (e.g., estimator vs. admin)  
- New calculator types (materials, labor, transportation)  
- Firebase seed data for easier setup  
- Full UI redesign focused on readability and mobile usability

---

## Tech Stack

- **Frontend:** React, React Router  
- **Backend / Database:** Firebase Firestore  
- **Hosting:** Vercel  
- **Styling:** Vanilla CSS  
- **Tooling:** ESLint

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- Firebase project with Firestore (authentication optional for now)

### Installation

```bash
git clone https://github.com/mrpanzerr/bidding-app
cd bidding-app
npm install
cp .env.example .env
# Add your Firebase config to .env
npm start
```

## Screenshots / Demo

(Coming soon — but you can explore it live at the link above.)

---

## What I Learned

- Built a full CRUD app with nested state and real-time sync  
- Integrated Firebase Firestore for live data updates with minimal config  
- Designed flexible, reusable React components that scale as projects grow  
- Worked with a real contractor to build a tool that solves *his actual problems*  
- Translated real-world workflows into usable software without losing the human logic behind them  
- Learned how to ship working software that trades polish for usefulness

---

## Roadmap

- 🔧 PDF export  
- 🔐 User authentication with roles  
- 💾 Default Firebase seed data  
- 🎨 UI/UX polish  
- 🧮 More calculator types  
- 🧪 Unit + integration testing

---

## Contact

[Portfolio](https://mrpanzerr.github.io/gaetano.github.io/)  
[Email](mailto:gaetanopanzer01@gmail.com)  
[Live Site](https://bidding-i81vx3i2u-mrpanzerrs-projects.vercel.app)

---

## License

MIT

