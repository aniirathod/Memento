# Memento

![Memento Logo](./public/FuturesticBrain.png)

**Memento** is a modern, efficient spaced repetition learning platform built with React, TypeScript, and Vite. It helps users improve knowledge retention by using flashcards and decks, tracking progress, and analyzing learning stats.

_This project was developed for the CodeCircuit hackathon._

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

---

## About

Memento implements the spaced repetition technique to maximize learning efficiency through flashcards and deck reviews. It includes features such as:

- Interactive flashcard decks with review scheduling
- Heatmap calendar to visualize learning activity
- User-friendly onboarding and theme toggling (dark/light mode)
- Detailed statistics and progress tracking

---

## Features

- Create, edit, and review flashcard decks
- Calendar heatmap visualization of study activity
- Responsive UI with light/dark theme toggle
- Onboarding flow for new users
- Real-time stats and progress tracking
- Tags input for easy deck organization
- Robust validation and utility helpers

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router
- **Linting:** ESLint
- **Build Tool:** Vite

---

## Project Structure

```
memento
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│ ├── FuturesticBrain.png
│ ├── FuturesticBrain.svg
│ └── vite.svg
├── src
│ ├── App.tsx
│ ├── assets
│ ├── components
│ │ ├── CalendarHeatmap.tsx
│ │ ├── DeckCard.tsx
│ │ ├── Layout.tsx
│ │ ├── ModeToggle.tsx
│ │ ├── OnboardingDialog.tsx
│ │ ├── TagsInput.tsx
│ │ ├── animation
│ │ ├── home
│ │ └── ui
│ ├── features
│ │ ├── decks
│ │ └── flashcards
│ ├── index.css
│ ├── lib
│ │ ├── utils.ts
│ │ └── validations.ts
│ ├── main.tsx
│ ├── pages
│ │ ├── Add.tsx
│ │ ├── Dashboard.tsx
│ │ ├── DeckDetails.tsx
│ │ ├── Decks.tsx
│ │ ├── Home.tsx
│ │ ├── NotFound.tsx
│ │ ├── Review.tsx
│ │ └── Stats.tsx
│ ├── router
│ │ └── router.tsx
│ ├── store
│ │ └── useThemeStore.ts
│ └── vite-env.d.ts
├── structure.txt
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (>=16.x)
- npm or yarn

### Installation

```bash
git clone https://github.com/aniirathod/Memento.git

npm install
# or
yarn install

npm run dev
# or
yarn dev
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please follow the existing code style and add tests where applicable.

---

## Contact

Your Name — [aniketnr5023@gmail.com](mailto:aniketnr5023@gmail.com)  
Portfolio Link: [https://aniket-rathod.vercel.app](https://aniket-rathod.vercel.app)
