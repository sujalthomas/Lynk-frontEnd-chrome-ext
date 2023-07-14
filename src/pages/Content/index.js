import React from 'react';
import ReactDOM from 'react-dom';
import DownloadButton from './DownloadButton';

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
ReactDOM.render(<DownloadButton />, app);
