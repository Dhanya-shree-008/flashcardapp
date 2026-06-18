import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors()); // Allows your React frontend to safely talk to this backend
app.use(express.json()); // Allows the server to read JSON data sent from Postman

// ⚠️ Insert your database connection string here
const MONGO_URI = "mongodb://dshree_db:akshudhanya@ac-ebidqmv-shard-00-00.yjattr3.mongodb.net:27017,ac-ebidqmv-shard-00-01.yjattr3.mongodb.net:27017,ac-ebidqmv-shard-00-02.yjattr3.mongodb.net:27017/?ssl=true&replicaSet=atlas-mfw3ar-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const cardSchema = new mongoose.Schema({
  question: String,
  answer: String
});
const Flashcard = mongoose.model('Flashcard', cardSchema);

// GET route: React frontend will call this to get data
app.get('/api/flashcards', async (req, res) => {
  const cards = await Flashcard.find();
  res.json(cards);
});

// POST route: Postman will call this to save a card
app.post('/api/flashcards', async (req, res) => {
  const newCard = new Flashcard(req.body);
  await newCard.save();
  res.json(newCard);
});

app.listen(5000, () => console.log("💻 Backend Server running on port 5000"));