export interface AttachedFile {
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  isFavorite?: boolean;
  image?: string; // URL of the image
  files?: AttachedFile[]; // Array of attached files
  marketAnalysis?: MarketData[]; // Market analysis data
}

export interface ChatSession {
  sessionId: string;
  firstMessage: string;
  createdAt: Date;
  messageCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
  image?: File;
}

export interface SendMessageWithFilesRequest {
  message: string;
  sessionId?: string;
  files: File[];
}

export interface SendMessageResponse {
  message: Message;
  sessionId: string;
}

export interface SendMessageWithFilesResponse {
  message: Message;
  sessionId: string;
  userMessage: {
    id: string;
    content: string;
    type: string;
    timestamp: string;
    files?: AttachedFile[];
  };
}

export interface ChatHistoryItem {
  sessionId: string;
  firstMessage: string;
  createdAt: Date;
  messageCount: number;
}

export interface FavoriteMessage {
  id: string;
  content: string;
  originalMessage: string;
  createdAt: Date;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
} 