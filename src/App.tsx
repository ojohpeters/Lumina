import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book as BookIcon, 
  Search, 
  Plus, 
  LogOut, 
  User as UserIcon, 
  Library, 
  ChevronRight,
  BookOpen,
  Calendar,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import { User, Book } from './types';

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <div className="bg-white/90 backdrop-blur-2xl border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Library className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
            <span className="serif text-xl font-bold tracking-tight">Lumina</span>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/catalogue" className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-accent transition-colors">Catalogue</Link>
              {user && (
                <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-accent transition-colors">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 leading-none mb-1">{user.role}</span>
                  <span className="text-xs font-semibold leading-none">{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-accent transition-colors">Login</Link>
                <Link to="/register" className="bg-accent text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-accent/30 active:scale-95">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-stone-100 border-t border-stone-200 py-16 px-4">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
      <div className="flex items-center gap-2 text-stone-800">
        <Library className="w-6 h-6 text-accent" />
        <span className="serif text-xl font-bold tracking-tight">Lumina</span>
      </div>
      <div className="text-center space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-600">
          Built with ❤️ by Group4
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 max-w-md leading-relaxed">
          Inspired by an Assignment at Rev. Fr. Moses Orshio Adasu University, Makurdi
        </p>
      </div>
      <div className="w-16 h-px bg-stone-300" />
      <p className="text-[11px] text-stone-600 font-bold uppercase tracking-widest">
        © 2026 Lumina Library Management System. All rights reserved.
      </p>
    </div>
  </footer>
);

const BookCard = ({ book, onBorrow, onReturn, isAdmin, onDelete, onEdit }: { 
  book: Book, 
  onBorrow?: (id: string) => void, 
  onReturn?: (id: string) => void,
  isAdmin?: boolean,
  onDelete?: (id: string) => void,
  onEdit?: (book: Book) => void,
  key?: any
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 group hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
        <img 
          src={book.coverImage || `https://picsum.photos/seed/${book.isbn}/400/600`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
            book.status === 'available' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}>
            {book.status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{book.category}</p>
          <h3 className="serif text-xl font-bold leading-tight mb-1 group-hover:text-accent transition-colors">{book.title}</h3>
          <p className="text-sm text-stone-600 italic">by {book.author}</p>
        </div>

        {book.status === 'borrowed' && book.borrowedBy && (
          <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <UserIcon className="w-3 h-3" />
              <span>Borrowed by {book.borrowedBy.name}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <Calendar className="w-3 h-3" />
              <span>Due: {new Date(book.dueDate!).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <button 
                onClick={() => onEdit?.(book)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
              <button 
                onClick={() => onDelete?.(book._id)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            book.status === 'available' ? (
              <button 
                onClick={() => onBorrow?.(book._id)}
                className="w-full py-2.5 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Borrow Now
              </button>
            ) : (
              <button 
                onClick={() => onReturn?.(book._id)}
                className="w-full py-2.5 border border-stone-200 text-stone-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                Return Book
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const Landing = () => (
  <div className="min-h-screen library-bg flex items-center justify-center px-6 py-20">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl text-center text-white"
    >
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-stone-300 mb-6"
      >
        Est. 2026 — Sharp Sharp Knowledge
      </motion.span>
      <h1 className="serif text-5xl sm:text-7xl md:text-9xl font-bold mb-8 leading-[0.9] tracking-tighter">
        Knowledge is <br /> <span className="italic font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Power.</span>
      </h1>
      <p className="text-base md:text-xl text-stone-200 mb-12 max-w-xl mx-auto font-light leading-relaxed px-4">
        No long stories here. Whether you're a serious scholar or just looking for a sharp read, Lumina is your sanctuary. Abeg, come and explore our curated collection.
      </p>
      <Link 
        to="/catalogue" 
        className="inline-flex items-center gap-4 border border-white/40 bg-white/5 backdrop-blur-sm text-white px-12 py-6 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.3em] hover:bg-accent hover:border-accent hover:text-white transition-all duration-500 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(58,58,40,0.3)]"
      >
        Oya, Enter Library <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
      </Link>
    </motion.div>
  </div>
);

const AuthPage = ({ type, onAuth }: { type: 'login' | 'register', onAuth: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = type === 'login' ? { email, password } : { email, password, name };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onAuth(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg px-6 py-20 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <Library className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="serif text-3xl font-bold">{type === 'login' ? 'Welcome Back' : 'Join Lumina'}</h2>
          <p className="text-stone-500 text-sm mt-2">Enter your details to access the library</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 shadow-xl shadow-accent/40 active:scale-[0.98] mt-4 border border-white/10"
          >
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-8">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link to={type === 'login' ? '/register' : '/login'} className="text-accent font-bold hover:underline">
            {type === 'login' ? 'Register' : 'Login'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

const Catalogue = ({ user }: { user: User | null }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);
  
  const handleBorrow = async (id: string) => {
    if (!user) return alert('Please login to borrow books');
    await fetch(`/api/books/${id}/borrow`, { method: 'POST' });
    fetchBooks();
  };

  const handleReturn = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}/return`, { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      }
      fetchBooks();
    } catch (err) {
      alert("Failed to return book");
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Library className="w-5 h-5 text-accent" />
            <h2 className="serif text-2xl font-bold">Library Catalogue</h2>
          </div>
          <p className="text-stone-500 mb-8 max-w-2xl">Browse our extensive collection of literary works. Borrow your next favorite book today.</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title, author, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User | null }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    fetchBooks();
  }, [user]);

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  const handleReturn = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}/return`, { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      }
      fetchBooks();
    } catch (err) {
      alert("Failed to return book");
    }
  };

  if (!user) return null;

  if (user.role === 'admin') {
    return <AdminPanel user={user} />;
  }

  const myBooks = books.filter(b => b.borrowedBy?._id === user.id);

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white serif text-2xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h1 className="serif text-4xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-stone-500 text-sm">Manage your borrowed books and account settings.</p>
            </div>
          </div>
        </div>

        {myBooks.length > 0 ? (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-accent" />
              <h2 className="serif text-2xl font-bold">My Borrowed Books</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {myBooks.map(book => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  onReturn={handleReturn}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-stone-100 text-center">
            <BookIcon className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <h3 className="serif text-xl font-bold mb-2">No borrowed books</h3>
            <p className="text-stone-500 mb-6">You haven't borrowed any books yet. Explore our catalogue to find something interesting.</p>
            <Link to="/catalogue" className="inline-block bg-accent text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
              Browse Catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ user }: { user: User | null }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalBooks: 0, borrowedBooks: 0, totalUsers: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', description: '', coverImage: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/dashboard');
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [booksRes, statsRes, usersRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ]);
      
      const [booksData, statsData, usersData] = await Promise.all([
        booksRes.json(),
        statsRes.json(),
        usersRes.json()
      ]);

      setBooks(booksData);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch admin data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingBook ? 'PUT' : 'POST';
    const url = editingBook ? `/api/books/${editingBook._id}` : '/api/books';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', isbn: '', category: '', description: '', coverImage: '' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      coverImage: book.coverImage
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="serif text-4xl font-bold">Administration</h1>
            <p className="text-stone-500 text-sm">Control center for Lumina Library resources and members.</p>
          </div>
          <button 
            onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-accent/30"
          >
            <Plus className="w-5 h-5" /> Add New Book
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Books', value: stats.totalBooks, icon: BookIcon, color: 'text-stone-600' },
            { label: 'Borrowed', value: stats.borrowedBooks, icon: BookOpen, color: 'text-amber-600' },
            { label: 'Total Users', value: stats.totalUsers, icon: UserIcon, color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl bg-stone-50", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</p>
                <p className="text-3xl font-bold serif">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-stone-200 mb-8">
          <button 
            onClick={() => setActiveTab('books')}
            className={cn(
              "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'books' ? "text-accent" : "text-stone-400 hover:text-stone-600"
            )}
          >
            Book Inventory
            {activeTab === 'books' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
              activeTab === 'users' ? "text-accent" : "text-stone-400 hover:text-stone-600"
            )}
          >
            Member Directory
            {activeTab === 'users' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        </div>

        {activeTab === 'books' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map(book => (
              <BookCard 
                key={book._id} 
                book={book} 
                isAdmin 
                onDelete={handleDelete}
                onEdit={openEdit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Member</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 text-xs font-bold">
                          {u.name[0]}
                        </div>
                        <span className="text-sm font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                        u.role === 'admin' ? "bg-accent/10 text-accent" : "bg-stone-100 text-stone-600"
                      )}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="serif text-3xl font-bold">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Title</label>
                      <input 
                        type="text" required value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Author</label>
                      <input 
                        type="text" required value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">ISBN</label>
                      <input 
                        type="text" required value={formData.isbn}
                        onChange={e => setFormData({...formData, isbn: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Category</label>
                      <input 
                        type="text" required value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Cover Image URL</label>
                      <input 
                        type="text" value={formData.coverImage}
                        onChange={e => setFormData({...formData, coverImage: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 ml-1">Description</label>
                      <textarea 
                        rows={3} value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                      />
                    </div>
                    <div className="col-span-2 pt-4">
                      <button 
                        type="submit"
                        className="w-full py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-accent/40"
                      >
                        {editingBook ? 'Update Book' : 'Save Book'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage type="login" onAuth={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AuthPage type="register" onAuth={setUser} />} />
          <Route path="/catalogue" element={<Catalogue user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
