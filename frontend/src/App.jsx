import React, { useState, useEffect } from 'react';

function App() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // New Form Input States
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // 1. Fetch existing flashcards from backend on load
  const fetchCards = () => {
    fetch('http://localhost:5000/api/flashcards')
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch((err) => console.error("Error communicating with backend server:", err));
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // 2. Submit new flashcard directly to backend & MongoDB
  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return alert("Please fill out both fields!");

    fetch('http://localhost:5000/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer })
    })
      .then((res) => res.json())
      .then((newCard) => {
        // Refresh the deck instantly on screen
        fetchCards();
        // Clear input boxes
        setNewQuestion('');
        setNewAnswer('');
        alert("🎉 Success! Flashcard added directly to MongoDB.");
      })
      .catch((err) => console.error("Error creating flashcard:", err));
  };

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '5px' }}>⚡ Flashcard Studio Dashboard</h1>
      <p style={{ color: '#64748b', marginTop: '0', marginBottom: '30px' }}>Full-Stack Integration (React 🤝 Node.js 🤝 MongoDB)</p>

      {/* ==================================================== */}
      {/* NEW INTERACTIVE CARD CREATION FORM                   */}
      {/* ==================================================== */}
      <form onSubmit={handleCreateCard} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '600px', boxSizing: 'border-box' }}>
        <input 
          type="text" 
          placeholder="Type Question..." 
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '220px', outline: 'none' }}
        />
        <input 
          type="text" 
          placeholder="Type Answer..." 
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '220px', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          ➕ Add Card
        </button>
      </form>

      {/* ==================================================== */}
      {/* FLASHCARD PREVIEW CANVAS AREA                        */}
      {/* ==================================================== */}
      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <h3>Your Database is empty!</h3>
          <p>Use the form above to add your first live flashcard entry.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontWeight: 'bold', color: '#64748b', margin: '5px 0' }}>Card: {index + 1} / {cards.length}</p>

          <div 
            onClick={() => setShowAnswer(!showAnswer)}
            style={{
              width: '400px',
              height: '250px',
              backgroundColor: showAnswer ? '#3b82f6' : '#1e3a8a',
              color: '#ffffff',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              padding: '30px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              boxSizing: 'border-box',
              marginTop: '15px'
            }}
          >
            <span style={{ fontSize: '12px', color: '#93c5fd', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
              {showAnswer ? "💡 Answer" : "❓ Question"}
            </span>
            <h2 style={{ fontSize: '24px', margin: 0, padding: '0 10px', wordBreak: 'break-word' }}>
              {showAnswer ? cards[index].answer : cards[index].question}
            </h2>
            <span style={{ fontSize: '11px', color: '#93c5fd', marginTop: '35px', opacity: 0.7 }}>
              (Click card canvas workspace to flip)
            </span>
          </div>

          {/* Navigation Layout System */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 130px', gap: '20px', marginTop: '35px' }}>
            <button onClick={prevCard} style={{ padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              ⏮️ Back
            </button>
            <button onClick={nextCard} style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
              Next ⏭️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;