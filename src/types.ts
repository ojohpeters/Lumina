export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverImage: string;
  status: 'available' | 'borrowed';
  borrowedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
}
