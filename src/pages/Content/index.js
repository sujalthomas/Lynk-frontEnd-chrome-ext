import React from 'react';
import ReactDOM from 'react-dom';
import DownloadButton from './DownloadButton';
import './content.styles.css';
import './content.styles.scss';


const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);

const root = ReactDOM.createRoot(app);
root.render(<DownloadButton />);


