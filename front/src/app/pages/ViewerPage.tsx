import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chunk } from '../../data/mockData';
import { buildPagesFromBackendChunks, fetchChunksByFileName, type PageViewModel } from '../../lib/api';
import { ChunkList, ErrorBoundary, HTMLViewer, PDFViewer } from '../components';
import { ArrowLeft, BookOpen, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Split from 'react-split';

function ViewerPageContent() {
  const navigate = useNavigate();
  const params = useParams();

  const fileName = useMemo(() => {
    const raw = params.fileName;
    return raw ? decodeURIComponent(raw) : '';
  }, [params.fileName]);

  // PDF URL을 생성 (프론트엔드 public/doc 폴더의 로컬 파일 사용)
  const pdfUrl = useMemo(() => {
    if (!fileName) return '';
    return `/doc/${fileName}`;
  }, [fileName]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeChunkId, setActiveChunkId] = useState<string | undefined>();
  const [expandedPane, setExpandedPane] = useState<'pdf' | 'html' | 'chunks' | null>(null);

  const [pageDataByPage, setPageDataByPage] = useState<Record<number, { chunks: Chunk[]; htmlContent: string }>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const maxPage = useMemo(() => {
    const pages = Object.keys(pageDataByPage).map((k) => Number(k)).filter((n) => Number.isFinite(n));
    return pages.length ? Math.max(...pages) : 1;
  }, [pageDataByPage]);

  const currentPageData = pageDataByPage[currentPage];
  const chunks = currentPageData?.chunks || [];
  const htmlContent = currentPageData?.htmlContent || '<p>이 페이지에는 내용이 없습니다.</p>';
  // 임시 마크다운 예시. 실제로는 pageDataByPage에 markdownContent를 추가하거나 변환해서 사용
  const markdownContent = chunks.length
    ? chunks.map((c, i) => `- ${c.text || c.content || `청크${i + 1}`}`).join('\n')
    : '# 마크다운 미리보기\n\n- 청크 없음';

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setActiveChunkId(undefined);
  };

  const handleChunkClick = (chunk: Chunk) => {
    setActiveChunkId(chunk.id);
    if (chunk.page !== currentPage) {
      setCurrentPage(chunk.page);
    }
  };

  const togglePaneExpansion = (pane: 'pdf' | 'html' | 'chunks') => {
    setExpandedPane(expandedPane === pane ? null : pane);
  };

  const getGridColumns = () => {
    if (expandedPane === 'pdf') return 'grid-cols-1';
    if (expandedPane === 'html') return 'grid-cols-[0.5fr,2fr,0.5fr]';
    if (expandedPane === 'chunks') return 'grid-cols-[0.5fr,0.5fr,2fr]';
    return 'grid-cols-3';
  };

  const loadDocument = async () => {
    if (!fileName) return;
    try {
      setIsLoading(true);
      setError(null);
      setActiveChunkId(undefined);

      const rows = await fetchChunksByFileName(fileName);
      const pages: Record<number, PageViewModel> = buildPagesFromBackendChunks(rows);

      const mapped: Record<number, { chunks: Chunk[]; htmlContent: string }> = {};
      for (const pageStr of Object.keys(pages)) {
        const page = Number(pageStr);
        const pageVm = pages[page];
        mapped[page] = { chunks: pageVm.chunks, htmlContent: pageVm.htmlContent };
      }

      setPageDataByPage(mapped);
      const firstPage = Object.keys(mapped)
        .map((p) => Number(p))
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b)[0];
      setCurrentPage(firstPage || 1);
    } catch (e: any) {
      setError(e?.message || '문서를 불러오지 못했습니다.');
      setPageDataByPage({});
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Eager load when entering the page.
  React.useEffect(() => {
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={28} />
              <div>
                <h1 className="text-2xl font-bold">문서 뷰어</h1>
                <p className="text-sm text-blue-100 mt-0.5">{fileName || '문서가 선택되지 않았습니다.'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded transition"
              >
                <ArrowLeft size={16} />
                목록
              </button>
              <div className="text-right">
                <p className="text-sm text-blue-100">현재 페이지</p>
                <p className="text-xl font-bold">{currentPage}</p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-blue-100">
              {isLoading ? '불러오는 중...' : maxPage > 1 ? `페이지 범위: 1 ~ ${maxPage}` : ''}
              {error ? <span className="ml-3 text-red-200">{error}</span> : null}
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1 h-full overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[33, 34, 33]}
          minSize={200}
          gutterSize={8}
          direction="horizontal"
          style={{ display: 'flex', height: '100%' }}
        >
          <div className="relative border-r border-gray-300 bg-white h-full overflow-hidden">
            <button
              onClick={() => togglePaneExpansion('pdf')}
              className="absolute top-2 right-2 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
              title="PDF 뷰어 확대/축소"
            >
              <Maximize2 size={16} className={expandedPane === 'pdf' ? 'text-blue-600' : 'text-gray-600'} />
            </button>
            <PDFViewer currentPage={currentPage} onPageChange={handlePageChange} pdfUrl={pdfUrl} />
          </div>

          <div className="relative border-r border-gray-300 bg-white h-full overflow-hidden">
            <HTMLViewer htmlContent={htmlContent} markdownContent={markdownContent} pageNumber={currentPage} highlightChunk={activeChunkId} />
          </div>

          <div className="relative bg-gray-50 h-full overflow-hidden">
            <ChunkList chunks={chunks} currentPage={currentPage} onChunkClick={handleChunkClick} activeChunkId={activeChunkId} />
          </div>
        </Split>
      </main>
    </div>
  );
}

export default function ViewerPage() {
  return (
    <ErrorBoundary>
      <ViewerPageContent />
    </ErrorBoundary>
  );
}
