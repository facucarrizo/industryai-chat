export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: React.ReactNode;
}
