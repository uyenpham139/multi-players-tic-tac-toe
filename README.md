# Week 2 Assignment: Multiplayer Odd/Even Tic-Tac-Toe
## Description
### 🎮 The Game Rules

Before we dive into the distributed systems concepts, let's understand the game you're building:

**Setup:**

- 5x5 board (25 squares)
- All squares start at 0
- First player is the **Odd Player**, second player is the **Even Player**

**Gameplay:**

- Click any square to increment its number by 1 (0→1→2→3→4...)
- Both players can click any square at any time (no turns!)
- Multiple clicks on the same square keep incrementing it

**Winning:**

- **Odd Player wins** if any row, column, or diagonal has all 5 odd numbers
    - Example: [1, 3, 5, 7, 9] or [1, 1, 1, 1, 1]
- **Even Player wins** if any row, column, or diagonal has all 5 even numbers
    - Example: [2, 4, 6, 8, 10] or [4, 6, 8, 8, 8]

**Strategy:**

- Odd player clicks squares to make/keep them odd
- Even player clicks squares to make/keep them even
- Fighting over the same squares is the game!
- If both players click a square with 5, it becomes 7 (stays odd)
- If both players click a square with 4, it becomes 6 (stays even)

---
## 🚀 Features

- 🎮 **Multiplayer Gameplay** – Two players (ODD and EVEN) compete in real-time.
- 👀 **Spectator Mode** – Others can join the room and watch the match live.
- 🧠 **Real-Time Sync** – Powered by Socket.IO, all actions are updated instantly across clients.
- 🏁 **Game Logic** – Automatic win detection, score tracking, and game reset flow.
- 🔄 **Room System** – Create or join unique game rooms.
- 💬 **In-Game Messages** – System notifications and updates (join, leave, reset, etc.).
- ⚙️ **Responsive UI** – Works on desktop and mobile.

---
## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, Socket.IO |
| Styling | CSS |
| Communication | WebSockets (Socket.IO) |

--- 
## 📦 Installation & Setup

Clone the repository:

```bash
git clone git@github.com:uyenpham139/multi-players-tic-tac-toe.git
cd multi-players-tic-tac-toe
```
1️⃣ Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```
2️⃣ Run both client and server locally
1. At the project root, run:
```bash
npm install
```
2. Then run:
```bash
npm start
```
This will start:
- 🖥️ Server on: http://localhost:3000
- 🌐 Client on: http://localhost:5173

---
## 🎮 How to Play

1. Open the client in your browser (http://localhost:5173).
2. Click New game to start a new game, then choosing your role as Player or Spectator. If you are Player, you can Create new room or Join Room to enter an existing one. Or if you are a Spectator, you can only Join an existing room.
3. If you're a Player, you’ll be assigned a role:
- 🟢 ODD player
- 🔵 EVEN player
4. Only Player can click tiles on the board to increment them by your value. (If the room only has 1 player, they cannot play and have to wait for their opponent)
5. The first player to reach the goal wins!
6. Use the Continue button to request a new game round. Or use Reset button to reset the whole game (including score and board)

---
## 📝 License

This project is licensed under the MIT License
