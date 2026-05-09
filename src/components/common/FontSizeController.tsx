import { Minus, Plus, Type } from "lucide-react";
import { useEffect, useState } from "react";

export default function FontSizeController() {
  const [fontSize, setFontSize] = useState(100);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fontSize");
    if (saved) {
      setFontSize(parseInt(saved));
      document.documentElement.style.fontSize = `${parseInt(saved)}%`;
    }
  }, []);

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(80, Math.min(120, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem("fontSize", newSize.toString());
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
    localStorage.setItem("fontSize", "100");
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl p-4 mb-2 border-2 border-blue-200 min-w-[200px]">
          <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Font Size: {fontSize}%
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeFontSize(-10)}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
              aria-label="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={resetFontSize}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => changeFontSize(10)}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
              aria-label="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-gray-700 w-12 h-12 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-gray-200 hover:border-blue-500"
        aria-label="Font size controller"
      >
        <Type className="w-5 h-5" />
      </button>
    </div>
  );
}
