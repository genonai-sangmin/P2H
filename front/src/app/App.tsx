import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentListPage from './pages/DocumentListPage';
import ViewerPage from './pages/ViewerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentListPage />} />
        <Route path="/viewer/:fileName" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
