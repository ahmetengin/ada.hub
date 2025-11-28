import { LucideIcon } from 'lucide-react';

export interface Repository {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  category: 'AI' | 'Maritime' | 'Core' | 'Stargate';
  icon: LucideIcon;
  structure?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: any;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}