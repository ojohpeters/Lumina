import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/library";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  status: { type: String, enum: ["available", "borrowed"], default: "available" },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  dueDate: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Clear existing data (optional, but good for a clean seed)
    // await User.deleteMany({});
    // await Book.deleteMany({});

    // 1. Seed Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.findOneAndUpdate(
      { email: "admin@lumina.com" },
      {
        email: "admin@lumina.com",
        password: adminPassword,
        name: "Lumina Admin",
        role: "admin"
      },
      { upsert: true, new: true }
    );
    console.log("Admin user seeded: admin@lumina.com / admin123");

    // 2. Seed Regular User
    const userPassword = await bcrypt.hash("user123", 10);
    await User.findOneAndUpdate(
      { email: "user@lumina.com" },
      {
        email: "user@lumina.com",
        password: userPassword,
        name: "Jane Doe",
        role: "user"
      },
      { upsert: true, new: true }
    );
    console.log("Regular user seeded: user@lumina.com / user123");

    // 3. Seed Books
    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Classic",
        description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        category: "Fiction",
        description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Dystopian",
        description: "A startling and haunting vision of the world, 1984 is so powerful that it is completely convincing from start to finish.",
        coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227",
        category: "Fantasy",
        description: "A great modern classic and the prelude to The Lord of the Rings.",
        coverImage: "https://images.unsplash.com/photo-1621351123021-7cb5875c8d54?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        category: "Self-Help",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day.",
        coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780062315007",
        category: "Adventure",
        description: "A fable about following your dream.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        category: "History",
        description: "A Brief History of Humankind.",
        coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
        status: "available"
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "9780374275631",
        category: "Psychology",
        description: "The New York Times Bestseller that will change the way you think.",
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
        status: "available"
      }
    ];

    for (const book of sampleBooks) {
      await Book.findOneAndUpdate({ isbn: book.isbn }, book, { upsert: true });
    }
    console.log("Books seeded successfully.");

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
