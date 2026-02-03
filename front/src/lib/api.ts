export type FileName = string;

export interface BackendChunk {
  content: string;
  file_name: string;
  file_path: string;
  i_page: number;
}

export interface PageViewModel {
  pageNumber: number;
  chunks: Array<{
    id: string;
    page: number;
    title: string;
    content: string;
    startIndex: number;
    endIndex: number;
  }>;
  htmlContent: string;
}

function getApiBaseUrl(): string {
  // Vite exposes env vars starting with VITE_
  // Fallback keeps local dev simple.
  return (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
}

export async function fetchFileList(): Promise<FileName[]> {
  const res = await fetch(`${getApiBaseUrl()}/show_files`);
  if (!res.ok) throw new Error(`Failed to load file list (${res.status})`);
  const data = await res.json();
  // Backend returns { files: [...] }, extract the files array
  return data.files || [];
}

export async function fetchChunksByFileName(fileName: string): Promise<BackendChunk[]> {
  const res = await fetch(`${getApiBaseUrl()}/files/${encodeURIComponent(fileName)}`);
  if (!res.ok) throw new Error(`Failed to load file chunks (${res.status})`);
  return res.json();
}

export function buildPagesFromBackendChunks(rows: BackendChunk[]): Record<number, PageViewModel> {
  const pages: Record<number, PageViewModel> = {};

  for (const row of rows) {
    const page = Number(row.i_page ?? 0);
    if (!Number.isFinite(page)) continue;

    if (!pages[page]) {
      pages[page] = {
        pageNumber: page,
        chunks: [],
        // Backend doesn't provide HTML today; render plain text in HTML viewer.
        htmlContent: '',
      };
    }

    const id = `${row.file_name || 'file'}-${page}-${pages[page].chunks.length}`;
    pages[page].chunks.push({
      id,
      page,
      title: `${row.file_name || '문서'} - 페이지 ${page}`,
      content: row.content || '',
      startIndex: 0,
      endIndex: (row.content || '').length,
    });
  }

  // Build a simple HTML content per page by joining chunks.
  for (const pageStr of Object.keys(pages)) {
    const page = Number(pageStr);
    // HTML 태그가 포함되어 있을 수 있으므로 이스케이프하지 않음
    const joined = pages[page].chunks.map((c) => {
      const content = c.content || '';
      // 콘텐츠에 HTML 태그가 있는지 확인
      const hasHtmlTags = /<[^>]+>/.test(content);
      if (hasHtmlTags) {
        // HTML이 있으면 그대로 사용
        return content;
      } else {
        // 일반 텍스트면 줄바꿈을 <br>로 변환
        return content.replace(/\n/g, '<br/>');
      }
    }).join('<div style="margin: 1rem 0; border-top: 1px solid #e5e7eb; padding-top: 1rem;"></div>');
    
    pages[page].htmlContent = `
      <div class="page-content">
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem;">
          페이지 ${page}
        </h2>
        <div>${joined || '<p style="color: #9ca3af;">내용이 없습니다.</p>'}</div>
      </div>
    `;
  }

  return pages;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
