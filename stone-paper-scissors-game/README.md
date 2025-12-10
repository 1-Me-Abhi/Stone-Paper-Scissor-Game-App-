# Stone Paper Scissors Game

This is a multiplayer Stone Paper Scissors game built using Svelte for the client-side and Node.js with Express for the server-side. The game allows players to compete against each other in real-time.

## Features

- Real-time multiplayer gameplay using WebSockets
- Dynamic game board for player interactions
- Player score tracking
- Game result display

## Project Structure

```
stone-paper-scissors-game
├── client                # Client-side application
│   ├── src               # Source files for the Svelte app
│   ├── public            # Public assets
│   ├── package.json      # Client dependencies and scripts
│   ├── vite.config.js    # Vite configuration
│   └── rollup.config.js  # Rollup configuration
└── server                # Server-side application
    ├── src               # Source files for the Node.js server
    └── package.json      # Server dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd stone-paper-scissors-game
   ```

2. Install dependencies for the client:

   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:

   ```
   cd server
   npm install
   ```

### Running the Application

1. Start the server:

   ```
   cd server
   node src/server.js
   ```

2. Start the client:

   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to play the game.

## Usage

- Players can join the game and make their selections (stone, paper, or scissors).
- The game will determine the winner and update the scores in real-time.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.