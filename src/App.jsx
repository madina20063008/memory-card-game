import { useState, useEffect } from "react";

const cardImages = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐸", "🐯"];

const shuffleCards = () => {
  const shuffled = [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
  return shuffled;
};

export default function App() {
  const [cards, setCards] = useState(shuffleCards);
  const [selected, setSelected] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      setDisabled(true);
      const [first, second] = selected;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === first || card.id === second ? { ...card, matched: true } : card
          )
        );
        setSelected([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first || card.id === second ? { ...card, flipped: false } : card
            )
          );
          setSelected([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [selected, cards]);

  useEffect(() => {
    if (cards.every(card => card.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  const handleCardClick = (index) => {
    if (disabled || cards[index].flipped || cards[index].matched) return;
    
    setCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, flipped: true } : card))
    );
    
    setSelected(prevSelected => {
      if (prevSelected.length < 2) {
        return [...prevSelected, index];
      }
      return prevSelected;
    });
  };

  const resetGame = () => {
    setCards(shuffleCards());
    setSelected([]);
    setDisabled(false);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Card Game</h1>
      {gameOver ? (
        <div className="text-2xl font-semibold text-green-600 mb-4">You Win! 🎉</div>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full max-w-screen-sm">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-3xl border rounded-xl cursor-pointer ${
                card.flipped || card.matched ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => handleCardClick(index)}
            >
              {card.flipped || card.matched ? card.emoji : "❓"}
            </div>
          ))}
        </div>
      )}
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg" onClick={resetGame}>Reset Game</button>
    </div>
  );
}