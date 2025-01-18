import React from 'react';
import { useBookStore } from '../store/bookStore';

const ChapterSelection: React.FC = () => {
  const { setSelectedChapter, setShowChat } = useBookStore();

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setShowChat(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80
                    animate-fadeIn">
      <div className="w-full h-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 
                      max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
          {Array.from({ length: 18 }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleChapterSelect(i + 1)}
              className="group p-6 md:p-8 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl
                       text-white hover:from-amber-600 hover:to-amber-800
                       transform hover:scale-105 transition-all duration-500
                       shadow-lg hover:shadow-amber-500/50"
              style={{
                animation: `fadeIn 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Chapter {i + 1}</h3>
                <div className="h-0.5 w-0 group-hover:w-full bg-amber-400 transition-all duration-300" />
                <p className="text-sm opacity-80">Click to explore the wisdom within</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterSelection;