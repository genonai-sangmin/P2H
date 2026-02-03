import React from 'react';
import { X } from 'lucide-react';
import { Chunk } from '@/data/mockData';

interface ChunkModalProps {
  chunk: Chunk | null;
  onClose: () => void;
}

export const ChunkModal: React.FC<ChunkModalProps> = ({ chunk, onClose }) => {
  if (!chunk) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{chunk.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              페이지 {chunk.page} • 위치: {chunk.startIndex} - {chunk.endIndex}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {chunk.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
