# Bidding App

A project bidding and estimation tool designed for general contractors. Built to modernize the manual process of creating bids by offering a faster, digital alternative. Currently functional with core features implemented and actively in development.

🔗 [Visit the Live Site](https://bidding-cwj5ldmyw-mrpanzerrs-projects.vercel.app/)

---

## What It Does

This app helps general contractors:

- Organize and manage multiple construction projects
- Create calculators within each project to handle:
  - Square footage estimation
  - Line-by-line pricing
  - Descriptive breakdowns of work
- Rename or delete projects and calculators on the fly
- Eventually generate a printable document containing all bid totals and details

The goal is to replace handwritten bids with a digital, streamlined tool that saves time and improves accuracy.

---

## Current Status
- Core functionality like project and calculator management is fully functional.
- The user interface is basic and visually unpolished, with improvements planned.
- User authentication is planned and Firebase is set up, but not yet integrated.
- Additional features like printable bid summaries and import/export templates are on the roadmap.
- ESLint is configured to help maintain code quality.
- The app is manually tested regularly to ensure features work as expected; formal unit and integration tests are planned for future development.

## Features

- Create, rename, and delete projects
- Per-project calculators for:
  - Square footage calculation
  - Price calculation
  - Description fields
- Automatic calculation of totals per calculator
- Future feature: A Totals page combining all calculator data into a bid-ready document
- Data stored and synced with Firestore (Firebase)
- Deployed via Vercel

---

## Tech Stack

- **Frontend:** React, React Router
- **Backend / Database:** Firebase Firestore
- **Hosting:** Vercel
- **Styling:** CSS, HTML
- **Tooling:** ESLint for code quality

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- Firebase project (Firestore + Authentication enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/mrpanzerr/bidding-app
cd bidding-app

# Install dependencies
npm install

# Create your environment variables file
cp .env.example .env

# Add your Firebase config to the new .env file
# (See your Firebase project's settings for these values)

# Run the development server
npm start
```

📸 Screenshots / Demo
(Coming soon – visual walkthrough of features)

## What I Learned
- Understand and implement real-time database operations with Firebase Firestore
- Build nested state systems for dynamic calculators
- Structure React apps using reusable components and router-based navigation
- Collaborate with a real client to solve practical problems for the construction industry

## Roadmap
- Add more calculator types (e.g, materials, labor, mobilization)
- Provide default Firebase seed data to simplify setup for other users
- Improve UI styling and layout consistency
- Authentication with user roles
- Totals page with combined project summary
- Print-to-PDF functionality

## Contact 
[My Portfolio](https://mrpanzerr.github.io/gaetano.github.io/)

[Live Site](https://bidding-cwj5ldmyw-mrpanzerrs-projects.vercel.app/)

[Email](gaetanopanzer01@gmail.com)

## License
MIT
