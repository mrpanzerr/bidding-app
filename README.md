# 🛠️ Bidding Application

A simple and intuitive web app for managing construction bidding projects. Built with **React**, **Firebase**, and a focus on clean, accessible UI/UX.

This project is designed for small teams or individuals who want to track projects with options to **create**, **rename**, and **delete** them — all stored in the cloud via Firebase.

---

## ✨ Features

- ✅ View a list of all projects
- ➕ Create new projects with a custom name
- ✏️ Rename existing projects
- 🗑️ Delete projects with confirmation
- 🔐 All data is stored securely in **Cloud Firestore**
- ⚡ Responsive and keyboard-accessible UI
- 🔁 Automatic refresh on create, rename, or delete

---

<!-- ## 📸 Preview 

![screenshot of app](./screenshot.png) <!-- Add this later when you have a screenshot -->

---

## 🧠 Tech Stack

| Frontend | Backend  |   Deployment    |
|----------|----------|-----------------|
| React    | Firebase | Netlify(planned)|

---

## 🚀 Getting Started

### 1. Clone the Repo

git clone https://github.com/mrpanzerr/bidding-app.git
cd bidding-application

### 2. Install Dependencies
npm install

### 3. Set Up Firebase
Create a file called .env.local and add your Firebase credentials:

VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

⚠️ Make sure .env.local is in your .gitignore so secrets are not pushed to GitHub.

### 4. Start the Development Server
npm run dev

📌 Future Plans
 Add data import/export functionality

 Build a calculator pages for project estimations on material, material cost and labor cost

 Improve styling and animations
