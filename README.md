# 🎮 Tetris Game - Web Version

A beautiful, modern web-based Tetris game with customizable block images and colors.

## Features

✨ **Classic Tetris Gameplay**
- Full tetromino pieces (I, O, T, S, Z, J, L)
- Smooth rotation and movement
- Line clearing and score system
- Progressive difficulty (increasing levels and speed)

🎨 **Customization**
- Upload custom images to use as block textures
- Pre-defined color presets (Red, Orange, Yellow, Green, Blue, Indigo, Violet, Cyan)
- Real-time preview of selected block style
- Delete uploaded images

📊 **Game Stats**
- Score tracking
- Level progression
- Line counter

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Tetris.git
cd Tetris
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

### Controls
- **← →** - Move block left/right
- **↓** - Speed up falling
- **↑** or **Z** - Rotate block
- **Space** - Drop block instantly

### Gameplay
1. Click "Start Game" to begin
2. Blocks will fall from the top
3. Arrange blocks to complete horizontal lines
4. Complete lines to score points and increase level
5. Game ends when blocks reach the top

## Customization Guide

### Using Custom Block Images

1. **Upload Images**
   - Click the upload area or drag & drop image files
   - Supported formats: JPG, PNG, GIF, WebP (Max 5MB)

2. **Select Block Style**
   - Click any uploaded image to use it as your block texture
   - Or select a color from the preset buttons

3. **Preview**
   - See your selected block style in the "Current Block Style" preview

4. **Manage Images**
   - Hover over uploaded images and click ✕ to delete

## Project Structure

```
Tetris/
├── server.js           # Express server with file upload handling
├── package.json        # Project dependencies
├── public/
│   ├── index.html      # Game HTML structure
│   ├── style.css       # Game styling
│   └── game.js         # Game logic and UI interactions
└── uploads/            # User-uploaded block images (created at runtime)
```

## Technologies Used

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Canvas API, JavaScript
- **File Upload**: Multer
- **Game Rendering**: HTML5 Canvas

## Game Rules

- Complete horizontal lines by placing blocks
- Each completed line: 100 points × current level
- Every 10 lines completed: level increases
- Speed increases with each level
- Game ends when blocks reach the top

## Performance

- Smooth 60 FPS gameplay
- Optimized canvas rendering
- Efficient collision detection
- Responsive design for all screen sizes

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - Feel free to use and modify!

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

---

Enjoy the game! 🎮✨
