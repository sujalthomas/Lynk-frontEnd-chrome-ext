import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

import React from 'react';
import ReactDOM from 'react-dom';
import DownloadButton from './DownloadButton';

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
ReactDOM.render(<DownloadButton />, app);
