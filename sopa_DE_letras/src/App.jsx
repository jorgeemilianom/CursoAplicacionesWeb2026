import { useState, useEffect } from "react";
import WordForm from "./components/WordForm";
import WordList from "./components/WordList";
import Grid from "./components/Grid";
import Timer from "./components/TImer.jsx";
import { generateGrid } from "./utils/wordSearch";
import "./App.css";

function App() {
  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [initialTime, setInitialTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [foundWordsCount, setFoundWordsCount] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("es");

  // --- ESTADOS PARA EL FESTEJO VISUAL ---
  const [showCeleb, setShowCeleb] = useState(false);
  const [lastWord, setLastWord] = useState("");

  const translations = {
    es: {
      title: "🧩 Sopa de Letras profesional",
      langBtn: "🇺🇸 English",
      statsWords: "Total",
      statsFound: "Logrado",
      labelTime: "Tiempo (seg): ",
      playBtn: "▶️ Empezar",
      resetBtn: "🔄 Reiniciar",
      winTitle: "🎉 ¡Ganaste!",
      lostTitle: "⏰ ¡Tiempo Agotado!",
      modalStats: "Encontraste {{count}} de {{total}}",
      modalRetry: "Jugar de nuevo",
      celebText: "¡Excelente!",
      steps: [
        "🌗 Cambiá el tema visual aquí.",
        "✍️ Añadí palabras para tu sopa.",
        "⏱️ Ajustá el tiempo del desafío.",
        "▶️ Dale a jugar para empezar.",
      ]
    },
    en: {
      title: "🧩 Word Search Pro",
      langBtn: "🇦🇷 Español",
      statsWords: "Total",
      statsFound: "Found",
      labelTime: "Time (sec): ",
      playBtn: "▶️ Start",
      resetBtn: "🔄 Reset",
      winTitle: "🎉 You Won!",
      lostTitle: "⏰ Time's Up!",
      modalStats: "You found {{count}} out of {{total}}",
      modalRetry: "Play again",
      celebText: "Great job!",
      steps: [
        "🌗 Toggle light/dark mode.",
        "✍️ Add words to your search.",
        "⏱️ Set the game duration.",
        "▶️ Press play to start.",
      ]
    }
  };

  const t = translations[language];

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    const seen = localStorage.getItem("tutorialVisto");
    if (seen) setStep(999);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "es" ? "en" : "es"));
    resetGame();
  };

  const addWord = (word) => {
    const clean = word.trim().toUpperCase();
    if (!clean || words.includes(clean)) return;
    setWords([...words, clean]);
    resetGame();
  };

  const deleteWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
    resetGame();
  };

  const resetGame = () => {
    setGrid([]);
    setGameActive(false);
    setGameStatus(null);
    setFoundWordsCount(0);
    setShowCeleb(false);
  };

  const createGrid = () => {
    if (words.length === 0) {
      alert(language === "es" ? "Agregá palabras" : "Add words");
      return;
    }
    setGrid(generateGrid(words));
    setTimeLeft(initialTime);
    setFoundWordsCount(0);
    setGameActive(true);
    setGameStatus(null);
  };

  // --- LÓGICA DE ACIERTO DINÁMICO ---
  const handleWordFound = (word) => {
    setLastWord(word); // Guardamos la palabra que se acaba de encontrar
    setShowCeleb(true); // Mostramos el festejo
    
    // El festejo dura 1.5 segundos
    setTimeout(() => setShowCeleb(false), 1500);

    setFoundWordsCount((prev) => {
      const next = prev + 1;
      if (next === words.length) {
        setGameActive(false);
        setTimeout(() => setGameStatus("won"), 400);
      }
      return next;
    });
  };

  const progress = words.length > 0 ? (foundWordsCount / words.length) * 100 : 0;

  return (
    <div className="app-container">
      <div className="top-bar">
        <button onClick={toggleLanguage} className="btn-secondary">{t.langBtn}</button>
        <button onClick={() => setDarkMode(!darkMode)} className="btn-secondary">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <h1 className="title">{t.title}</h1>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="stats-bar">
        <div><p>{t.statsWords}</p><strong>{words.length}</strong></div>
        <div className={`timer-box ${timeLeft <= 10 ? "critical" : ""}`}>⏱ {timeLeft}s</div>
        <div><p>{t.statsFound}</p><strong>{foundWordsCount}</strong></div>
      </div>

      {!gameActive && (
        <div className="time-selector">
          <label>{t.labelTime}</label>
          <input type="number" value={initialTime} onChange={(e) => setInitialTime(Number(e.target.value))} />
        </div>
      )}

      <Timer 
        seconds={timeLeft} 
        setSeconds={setTimeLeft} 
        isActive={gameActive} 
        onTimeUp={() => setGameStatus("lost")} 
      />

      <WordForm addWord={addWord} language={language} />

      <div className="game-layout">
        <div className="grid-section">
          {grid.length > 0 && (
            <Grid 
              grid={grid} 
              words={words} 
              onWordFound={handleWordFound} 
              gameActive={gameActive} 
              language={language} 
            />
          )}
        </div>
        <div className="list-section">
          <WordList words={words} deleteWord={deleteWord} language={language} />
        </div>
      </div>

      <button onClick={createGrid} className="btn-main">
        {gameActive ? t.resetBtn : t.playBtn}
      </button>

      {/* 🌟 OVERLAY DE FESTEJO CON IMAGEN DINÁMICA */}
      {showCeleb && (
        <div className="celeb-overlay">
          <div className="celeb-modal">
            {/* Buscamos la imagen en public/assets/ NOMBRE_PALABRA.png */}
          {/* Cambiamos ${lastWord} por el nombre real del archivo */}
        <img 
  src="/assets/lastWord.webp" 
  alt="¡Excelente!" 
  className="img-celeb" 
/       >
            <h3>{t.celebText}</h3>
            <p className="word-found-text">{lastWord}</p>
          </div>
        </div>
      )}

      {/* MODAL DE RESULTADO FINAL */}
      {gameStatus && (
        <div className="overlay">
          <div className="modal">
            <h2>{gameStatus === "won" ? t.winTitle : t.lostTitle}</h2>
            <p>{t.modalStats.replace("{{count}}", foundWordsCount).replace("{{total}}", words.length)}</p>
            <button onClick={resetGame} className="btn-main">{t.modalRetry}</button>
          </div>
        </div>
      )}

      {/* SISTEMA DE TUTORIAL */}
      {step < t.steps.length && (
        <div className="tutorial-overlay">
          <div className="tutorial-modal">
            <p>{t.steps[step]}</p>
            <button onClick={() => setStep(step + 1)} className="btn-main">
              {step === t.steps.length - 1 ? "🚀" : "➡️"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;