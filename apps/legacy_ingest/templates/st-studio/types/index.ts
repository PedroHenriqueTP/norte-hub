export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  type: 'whatsapp' | 'email' | 'website';
  direction: 'incoming' | 'outgoing';
  leadId?: string;
  createdAt: string;
}

