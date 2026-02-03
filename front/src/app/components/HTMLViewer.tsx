import React, { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HTMLViewerProps {
  htmlContent: string;
  markdownContent: string;
  pageNumber: number;
  highlightChunk?: string;
}

export const HTMLViewer: React.FC<HTMLViewerProps> = ({
  htmlContent,
  markdownContent,
  pageNumber,
  highlightChunk
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'html' | 'markdown'>('html');

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [pageNumber, mode]);

  useEffect(() => {
    if (highlightChunk && contentRef.current) {
      const element = contentRef.current.querySelector(`[data-chunk-id="${highlightChunk}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightChunk, mode]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200 flex-shrink-0">
        <FileText size={20} className="text-blue-600" />
        <h2 className="font-semibold text-gray-800">청크 뷰어</h2>
        <span className="ml-auto text-sm text-gray-500">페이지 {pageNumber}</span>
        <div className="ml-4 flex gap-2">
          <button
            className={`px-3 py-1 rounded border text-sm font-medium ${mode === 'html' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-500'}`}
            onClick={() => setMode('html')}
          >
            HTML
          </button>
          <button
            className={`px-3 py-1 rounded border text-sm font-medium ${mode === 'markdown' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-500'}`}
            onClick={() => setMode('markdown')}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin"
        style={{ minHeight: 0 }}
      >
        {mode === 'html' ? (
          <div
            className="prose prose-sm max-w-none html-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="prose prose-sm max-w-none html-content">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Styles for HTML Content */}
      <style>{`
        .html-content h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #1f2937;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.5rem;
        }

        .html-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .html-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #4b5563;
        }

        .html-content p {
          line-height: 1.75;
          margin-bottom: 1rem;
          color: #6b7280;
        }

        .html-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .html-content th {
          background-color: #f3f4f6;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .html-content td {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          color: #4b5563;
        }

        .html-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .html-content tr:hover {
          background-color: #f3f4f6;
        }

        .html-content ul, .html-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .html-content li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .html-content .page-content {
          background-color: #ffffff;
        }

        .html-content [data-chunk-id] {
          transition: background-color 0.3s ease;
        }

        .html-content [data-chunk-id].highlighted {
          background-color: #fef3c7;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};
