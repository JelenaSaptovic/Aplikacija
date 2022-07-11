import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import Application from './components/Application/Application';
import reportWebVitals from './common/reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>
);

reportWebVitals(console.log);
