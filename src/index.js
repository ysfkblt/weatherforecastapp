import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import App2 from './App2';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<h1>test this is in index.js. app2 should be below</h1>
		<App2 />
	</React.StrictMode>
);
