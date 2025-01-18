import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { BookOpen } from 'lucide-react';
import Book3D from './components/Book3D';
import ParticleField from './components/ParticleField';
import ChapterSelection from './components/ChapterSelection';
import ChatUI from './components/ChatUI';
import { useBookStore } from './store/bookStore';

function App() {
  const { isBookOpen, selectedChapter, showChat, setBookOpen } = useBookStore();

  const handleOpenBook = () => {
    setBookOpen(true);
  };

  return (
    <div className="h-screen w-screen">
      <Canvas className="bg-gradient-to-b from-amber-900 to-amber-950">
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParticleField />
          <Book3D />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>

      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-8 pointer-events-auto
                      transition-opacity duration-1000 ${isBookOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center space-y-4">
          <h1 className="text-white text-5xl font-serif mb-2">The Bhagavad Gita</h1>
          <p className="text-amber-200 text-xl font-serif">Ancient Wisdom for Modern Times</p>
        </div>
        <button
          onClick={handleOpenBook}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700
                   text-white rounded-lg hover:from-amber-500 hover:to-amber-600
                   transition-all duration-300 transform hover:scale-105
                   shadow-lg hover:shadow-amber-500/50"
        >
          <BookOpen size={24} />
          <span className="text-xl">Begin Journey</span>
        </button>
      </div>

      {isBookOpen && !selectedChapter && (
        <div className="transition-opacity duration-1000 opacity-100">
          <ChapterSelection />
        </div>
      )}
      
      {showChat && <ChatUI />}
    </div>
  );
}

export default App;