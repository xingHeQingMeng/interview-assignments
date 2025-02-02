import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './reset.scss'
const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App></App>);
}
