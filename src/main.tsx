import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initContent } from './initContent';
const base = import.meta.env.BASE_URL;                // 예: '/narrative-app/'
const basename = base.endsWith('/') ? base.slice(0,-1) : base; // 예: '/narrative-app'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

initContent();