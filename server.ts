import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const PORT = 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/library";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5s timeout
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Schemas
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

// Seeding Logic
async function seedData() {
  try {
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    console.log(`[SEED] Current DB State: ${userCount} users, ${bookCount} books`);
    
    // 1. Ensure Admin exists
    console.log("[SEED] Verifying Admin user...");
    const adminExists = await User.findOne({ email: "admin@lumina.com" });

    if (!adminExists) {
      console.log("[SEED] Admin user missing. Creating admin...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        email: "admin@lumina.com",
        password: adminPassword,
        name: "Lumina Admin",
        role: "admin"
      });
      await admin.save();
      console.log("[SEED] Admin created successfully.");
    } else {
      console.log("[SEED] Admin already exists.");
    }

    // 2. Seed other users if empty
    if (userCount <= 1) { // Only admin exists or no one
      const userExists = await User.findOne({ email: "user@lumina.com" });
      if (!userExists) {
        console.log("[SEED] Seeding regular user...");
        const userPassword = await bcrypt.hash("user123", 10);
        const user = new User({
          email: "user@lumina.com",
          password: userPassword,
          name: "Jane Doe",
          role: "user"
        });
        await user.save();
        console.log("[SEED] Regular user seeded.");
      }
    }

    // 3. Seed books if empty
    if (bookCount === 0) {
      console.log("[SEED] Seeding initial books...");
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

      await Book.insertMany(sampleBooks);
      console.log("[SEED] Books seeded successfully.");
    }
    console.log("[SEED] Seeding process finished.");
  } catch (err) {
    console.error("[SEED] Error during seeding:", err);
  }
}

// Health check for Vercel
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Auth Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, name });
      await user.save();
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      res.cookie("token", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
      });
      res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`[AUTH] Login attempt for: ${email}`);
      
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`[AUTH] User not found in database: ${email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log(`[AUTH] User found. Comparing passwords...`);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`[AUTH] Password match result for ${email}: ${isMatch}`);

      if (!isMatch) {
        console.log(`[AUTH] Password mismatch for: ${email}`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log(`[AUTH] Login successful for: ${email}`);
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      res.cookie("token", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
      });
      res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error("[AUTH] Login error:", err);
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    res.json({ user: { id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  // Book Routes
  app.get("/api/books", async (req, res) => {
    try {
      let books = await Book.find().populate("borrowedBy", "name email");
      // Only seed if empty and not in a recursive call
      if (books.length === 0 && process.env.VERCEL) {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log("[API] No users found. Triggering automatic seeding...");
          await seedData();
          books = await Book.find().populate("borrowedBy", "name email");
        }
      }
      res.json(books);
    } catch (err) {
      console.error("[API] Error fetching books:", err);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.post("/api/books", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const book = new Book(req.body);
      await book.save();
      res.json(book);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/books/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  });

  app.delete("/api/books/:id", authenticate, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  });

  // Borrowing Logic
  app.post("/api/books/:id/borrow", authenticate, async (req: any, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || book.status === "borrowed") return res.status(400).json({ error: "Book unavailable" });
    
    book.status = "borrowed";
    book.borrowedBy = req.user._id;
    book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
    await book.save();
    res.json(book);
  });

  app.post("/api/books/:id/return", authenticate, async (req: any, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book || book.status === "available") {
        return res.status(400).json({ error: "Book already returned" });
      }
      
      const isBorrower = book.borrowedBy && book.borrowedBy.toString() === req.user._id.toString();
      const isAdmin = req.user.role === "admin";

      if (!isBorrower && !isAdmin) {
        return res.status(403).json({ error: "You can only return books you borrowed" });
      }
      
      book.status = "available";
      book.borrowedBy = null;
      book.dueDate = null;
      await book.save();
      res.json(book);
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Only Routes
  app.get("/api/admin/stats", authenticate, async (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const totalBooks = await Book.countDocuments();
    const borrowedBooks = await Book.countDocuments({ status: "borrowed" });
    const totalUsers = await User.countDocuments();
    res.json({ totalBooks, borrowedBooks, totalUsers });
  });

  app.get("/api/admin/users", authenticate, async (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const users = await User.find({}, "-password");
    res.json(users.map(u => ({
      id: u._id,
      email: u.email,
      name: u.name,
      role: u.role
    })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

// Only listen if not on Vercel
if (!process.env.VERCEL) {
  connectDB().then(() => {
    seedData().then(() => {
      app.listen(3000, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:3000`);
      });
    });
  }).catch(console.error);
} else {
  // On Vercel, we don't call seedData() at the top level to avoid cold start timeouts.
  // The DB connection is handled by the middleware.
}
