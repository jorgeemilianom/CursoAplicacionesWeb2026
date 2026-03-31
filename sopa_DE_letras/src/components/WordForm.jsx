import { useState } from "react";

function WordForm({ addWord, language }) { // 👈 Recibimos "language"
  const [input, setInput] = useState("");

  // Definimos los textos dinámicos
  const placeholderText = language === "es" ? "Nueva palabra..." : "New word...";
  const buttonText = language === "es" ? "Añadir" : "Add";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addWord(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholderText} // 👈 Ahora el placeholder cambia
      />
      <button type="submit">{buttonText}</button> {/* 👈 El botón ahora es bilingüe */}
    </form>
  );
}

export default WordForm;