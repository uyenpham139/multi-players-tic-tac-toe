# 🎮 Tic-Tac-Toe with Minimax and Alpha-Beta Pruning
A browser-based Tic-Tac-Toe game where you can play against an AI powered by the Minimax algorithm with Alpha-Beta pruning optimization.
This project demonstrates how classical AI techniques can be applied to simple games for strategic decision-making.

# 🧩 Features
- Play Human vs AI or Human vs Human
- AI with three difficulty levels:
  - Easy – random moves
  - Medium – limited-depth minimax (makes some mistakes)
  - Hard – full minimax with alpha-beta pruning (plays optimally)
- Dynamic UI built with React
- Score tracking for both player and AI
- Step counter to track move count
- Win, loss, and draw detection
- Mode switching without resetting the score
- AI performance display toggle for analysis in Medium and Hard modes

# ⚙️ Setup Instructions
## 1️⃣ Prerequisites
Make sure you have installed:
- Node.js (v16 or later)
- npm or yarn

## 2️⃣ Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/uyenpham139/tic-tac-toe-minimax.git
cd tic-tac-toe-ai
npm install
```

## 3️⃣ Run the project
Start the development server:
```bash
npm start
```
or
```bash
npm run dev
```
Then open your browser and visit:
```bash
http://localhost:5173/
```

# 🕹️ How to Play
- Choose your game mode and AI difficulty.
- Click on an empty cell to make your move.
- The AI (or your opponent) will respond within 1 second.
- The game ends when:
  - A player aligns three symbols in a row, column, or diagonal.
  - All cells are filled with no winner → it’s a draw.
- When you or the AI wins, the score updates automatically, and you can keep playing without losing progress.
- You can switch modes anytime using the Home button.
- To track AI performance, click the More button and toggle AI Performance (available in Medium and Hard modes).
- Use the Reset button to start a new game whenever you like.

# 🧠 AI Difficulty Levels
| Level  | Algorithm Used              | Description |
|--------|-----------------------------|--------------|
| **Easy**   | Random Move                 | AI picks a random empty square. No strategy. |
| **Medium** | Minimax + Alpha-Beta Pruning (Depth-Limited)| AI looks a few moves ahead, can make mistakes. |
| **Hard**   | Minimax + Alpha-Beta Pruning | AI explores all possible moves optimally with pruning for performance. |

# ⚡ Explanation
The Minimax algorithm evaluates all possible moves recursively to choose the one with the best guaranteed outcome:
- Maximizing player (O) tries to maximize the score.
- Minimizing player (X) tries to minimize it.
To improve efficiency, Alpha-Beta pruning skips branches that can’t affect the final decision — reducing computation time without changing the result.

# 🧩 Code Structure
```bash
src/
├── components/
│   ├── Board.tsx
│   ├── Square.tsx
│   └── GameInfo.tsx
├── utils/
│   ├── gameLogic.ts
│   └── minimax.ts
├── App.tsx
└── index.tsx
```
- `gameLogic.ts` – Handles winner detection and basic board utilities.
- `minimax.ts` – Contains the minimax and alpha-beta pruning algorithms with detailed comments.
- `GameInfo.tsx` – Manages the game state and AI moves.

# 💻 Technologies Used
- React + TypeScript
- Functional components and hooks (useState, useEffect)

# 📜 License

This project is licensed under the MIT License