import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { format } from 'date-fns';
import { useBookStore } from '../store/bookStore';
import ChatParticles from './ChatParticles';

const AMBIENT_SOUND_URL = 'https://assets.mixkit.co/music/preview/mixkit-meditation-flute-276.mp3';

const ChatUI: React.FC = () => {
  const [message, setMessage] = useState('');
  const { 
    selectedChapter, 
    messages, 
    addMessage, 
    isSoundEnabled, 
    toggleSound 
  } = useBookStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(AMBIENT_SOUND_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isSoundEnabled) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay prevented. User interaction required.');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isSoundEnabled]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage(message, 'user');
    setMessage('');

    // Simulate assistant response (replace with actual API call)
    setTimeout(() => {
      addMessage('I am here to guide you through the wisdom of the Bhagavad Gita.', 'assistant');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas>
          <ambientLight intensity={0.5} />
          <ChatParticles type="snow" />
          <ChatParticles type="cloud" />
        </Canvas>
      </div>

      {/* Chat Interface */}
      <div className="relative flex flex-col h-full bg-gradient-to-b from-amber-50/90 to-amber-100/90">
        <header className="bg-amber-800/90 text-white p-4 backdrop-blur-sm flex justify-between items-center">
          <h2 className="text-xl font-bold">Chapter {selectedChapter}</h2>
          <button
            onClick={toggleSound}
            className="p-2 hover:bg-amber-700/50 rounded-full transition-colors"
            aria-label={isSoundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </header>
        
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-amber-100' : 'text-amber-600'
                }`}>
                  {format(msg.timestamp, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white/90 border-t border-amber-200 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about this chapter..."
              className="flex-1 p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors backdrop-blur-sm"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;