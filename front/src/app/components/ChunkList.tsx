import React, { useState } from 'react';
import { Chunk } from '@/data/mockData';
import { FileCode, ChevronRight } from 'lucide-react';
import { ChunkModal } from './ChunkModal';

interface ChunkListProps {
  chunks: Chunk[];
  currentPage: number;
  onChunkClick: (chunk: Chunk) => void;
  activeChunkId?: string;
}

export const ChunkList: React.FC<ChunkListProps> = ({
  chunks,
  currentPage,
  onChunkClick,
  activeChunkId
}) => {
  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null);

  const handleChunkCardClick = (chunk: Chunk) => {
    // 페이지 이동은 기존 동작
    onChunkClick(chunk);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200 flex-shrink-0">
          <FileCode size={20} className="text-blue-600" />
          <h2 className="font-semibold text-gray-800">청크 리스트</h2>
          <span className="ml-auto px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {chunks.length}개
          </span>
        </div>

        {/* Chunk Cards */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 scrollbar-thin"
          style={{ minHeight: 0 }}
        >
          {chunks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FileCode size={48} className="mb-3 opacity-50" />
              <p className="text-sm">이 페이지에는 청크가 없습니다.</p>
            </div>
          ) : (
            chunks.map((chunk) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                isActive={activeChunkId === chunk.id}
                onClick={() => setSelectedChunk(chunk)}
              />
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>현재 페이지: {currentPage}</span>
            <span>청크를 더블클릭으로 전체 보기</span>
          </div>
        </div>
      </div>

      {/* Chunk Modal */}
      <ChunkModal 
        chunk={selectedChunk} 
        onClose={() => setSelectedChunk(null)} 
      />
    </>
  );
};

interface ChunkCardProps {
  chunk: Chunk;
  isActive: boolean;
  onClick: () => void;
}

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isActive
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
          {chunk.title}
        </h3>
        <ChevronRight
          size={16}
          className={`flex-shrink-0 mt-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
        />
      </div>

      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
        {chunk.content}
      </p>

      <div className="flex items-center gap-3 text-xs">
        <span className={`px-2 py-1 rounded ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
          페이지 {chunk.page}
        </span>

      </div>
    </div>
  );
};
