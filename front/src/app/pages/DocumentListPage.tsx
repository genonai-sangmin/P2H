import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFileList } from '../../lib/api';

export default function DocumentListPage() {
  const navigate = useNavigate();

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchFileList();
        if (!mounted) return;
        setFiles(list);
        setError(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || '문서 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold">문서 목록</h1>
          <p className="text-sm text-blue-100 mt-0.5">백엔드의 /show_files 결과를 표시합니다.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">파일</h2>
            {loading ? (
              <span className="text-xs text-gray-500">불러오는 중...</span>
            ) : (
              <span className="text-xs text-gray-500">{files.length}개</span>
            )}
          </div>

          {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}

          <ul className="divide-y divide-gray-100">
            {files.length === 0 && !loading ? (
              <li className="p-4 text-sm text-gray-500">표시할 문서가 없습니다.</li>
            ) : (
              files.map((f) => (
                <li key={f}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition text-gray-700"
                    onClick={() => navigate(`/viewer/${encodeURIComponent(f)}`)}
                  >
                    {f}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
