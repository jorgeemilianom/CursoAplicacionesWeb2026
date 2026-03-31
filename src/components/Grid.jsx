import { useState } from "react";

function Grid({ grid, words, onWordFound, gameActive }) {
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // 🔊 sonido simple (opcional)
  const playSound = () => {
    try {
      const audio = new Audio("/click.mp3");
      audio.volume = 0.3;
      audio.play();
    } catch {}
  };

  // 📳 vibración mobile
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(30);
  };

  // 🧠 validar línea recta
  const isStraightLine = (points) => {
    if (points.length < 2) return true;

    const dx = points[1].x - points[0].x;
    const dy = points[1].y - points[0].y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return false;

    return points.every((point, i) => {
      if (i === 0) return true;

      return (
        point.x === points[0].x + dx * i &&
        point.y === points[0].y + dy * i
      );
    });
  };

  const handleMouseDown = (x, y) => {
    if (!gameActive) return;

    playSound();
    vibrate();

    setIsSelecting(true);
    setSelected([{ x, y }]);
  };

  const handleMouseEnter = (x, y) => {
    if (!isSelecting) return;

    // 🚫 evitar repetir misma celda
    if (selected.some((pos) => pos.x === x && pos.y === y)) return;

    const newSelection = [...selected, { x, y }];

    if (isStraightLine(newSelection)) {
      setSelected(newSelection);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;

    setIsSelecting(false);

    const word = selected
      .map(({ x, y }) => grid[y][x])
      .join("");

    const reversed = word.split("").reverse().join("");

    const matchedWord =
      words.find((w) => w === word || w === reversed) || null;

    if (matchedWord && !foundWords.includes(matchedWord)) {
      console.log("✅ Correcta:", matchedWord);

      setFound((prev) => [...prev, selected]);
      setFoundWords((prev) => [...prev, matchedWord]);

      onWordFound(matchedWord);
    } else {
      console.log("❌ Incorrecta o repetida:", word);
    }

    setSelected([]);
  };

  // 🎨 helpers
  const isSelected = (x, y) =>
    selected.some((pos) => pos.x === x && pos.y === y);

  const isFound = (x, y) =>
    found.some((group) =>
      group.some((pos) => pos.x === x && pos.y === y)
    );

  return (
    <div
      className="grid-main"
      onMouseLeave={() => {
        setIsSelecting(false);
        setSelected([]);
      }}
      onMouseUp={handleMouseUp} // 🔥 mejora: captura global
    >
      {grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div
              key={x}
              onMouseDown={() => handleMouseDown(x, y)}
              onMouseEnter={() => handleMouseEnter(x, y)}
              className={`cell 
                ${isSelected(x, y) ? "selected" : ""} 
                ${isFound(x, y) ? "found" : ""}
              `}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
