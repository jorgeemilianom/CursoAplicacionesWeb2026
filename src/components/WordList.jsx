
function WordList({ words, deleteWord }) {
  return (
    <ul>
      {words.map((word, index) => (
        <li key={index}>
          {word}
          <button onClick={() => deleteWord(index)}>❌</button>
        </li>
      ))}
    </ul>
  );
}

export default WordList;