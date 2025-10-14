# BidWise

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) | 
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](https://nodejs.org/) | 
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/) | 
[![Firebase](https://img.shields.io/badge/Firebase-Active-yellowgreen)](https://firebase.google.com/) | 
[![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)](https://vercel.com/) |
[![Jest](https://img.shields.io/badge/jest-26.6.3-blue.svg)](https://jestjs.io/)


A streamlined bidding tool built for general contractors. This project replaces the slow, error-prone process of handwritten estimates with a faster, digital alternative. Built from the ground up to reflect how real contractors think, work, and price.

🔗 [Live Site](https://bidding-app-phi.vercel.app/)

---

## What It Does

This app helps general contractors:

- Manage multiple construction projects at once  
- Create custom calculators within each project for:
  - Square footage and price estimates  
  - Descriptions and work breakdowns  
  - Real-time total calculations  
- Rename or delete projects and calculators instantly  
- Generate a printable bid-ready document with full cost breakdown.
  - This includes PDF and Excel exports of project total breakdown, material list and labor estimations.

It’s built to feel familiar to contractors — simple, clear, and focused — while saving them hours of manual work.

---

## Features

> **Project & Calculator Management**
- Create, rename, and delete projects to organize construction bids  
- Add detailed calculators per project, including nested pricing and descriptions  
- Real-time total calculations for fast, accurate estimates  

> **Estimation Tools**
- Material and labor calculators tailored for construction bids  
- Instant PDF and Excel exports for client-ready proposals  

> **Data Handling & Collaboration**
- Firestore-backed database with live sync for seamless collaboration  
- All calculations persist instantly — no refresh required  
- Deployed on Vercel for reliable, always-up-to-date access  

> **User Access & Security**
- Role-based login with admin access for secure, multi-user environments  

> **User Interface**
- Intuitive, user-friendly interface designed for efficiency and readability

---

## Tech Stack

- **Frontend:** React, React Router  
- **Backend / Database:** Firebase Firestore  
- **Hosting:** Vercel  
- **Styling:** Vanilla CSS  
- **Tooling:** ESLint
- **Testing:** Jest

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

---

## What I Learned

- Built a full CRUD app with nested state and real-time sync  
- Integrated Firebase Firestore for live data updates with minimal config  
- Designed flexible, reusable React components that scale as projects grow  
- Worked with a real contractor to build a tool that solves *his actual problems*  
- Translated real-world workflows into usable software without losing the human logic behind them  
- Learned how to ship working software that trades polish for usefulness
- Prioritized clear scoping and thoughtful planning to reduce rework, align features with real needs, and support long-term scalability.

---

## Contact

[Portfolio](https://mrpanzerr.github.io/gaetano.github.io/)  
[Email](mailto:gaetanopanzer01@gmail.com)  
[Live Site](https://bidding-app-phi.vercel.app/)

---

## License

MIT

