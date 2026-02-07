# Snake Game

This repository is a self-contained Snake game built with HTML, CSS, and vanilla JavaScript.

## Run locally

You can open the game in any modern browser:

1. In a terminal, change into the repo root (the folder containing `index.html`):
   ```bash
   cd /path/to/snake-game
   ```
2. Start a simple static server from that repo root:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://127.0.0.1:8000` in your browser.

Alternatively, you can open `index.html` directly in your browser without a server.

### How to find the correct path

If you are not sure what path to use in the `cd` step, try one of these:

- **macOS/Linux**: open a terminal in the folder and run:
  ```bash
  pwd
  ```
  That printed path is what you use with `cd`.
- **Windows (PowerShell)**: open PowerShell in the folder and run:
  ```powershell
  Get-Location
  ```
  Use the printed path with `cd`.
- **Windows (File Explorer)**: open the folder, click the address bar, and copy the full path.

## Controls

- Arrow keys or WASD to move.
- Space to pause/resume.
- Enter or the Restart button to reset after a game over.
