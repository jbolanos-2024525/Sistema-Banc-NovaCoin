import dotenv from 'dotenv';
import crypto from 'crypto';

// Polyfill crypto globally para ES modules
global.crypto = crypto;

dotenv.config();

const { initServer } = await import('./configs/app.js');

initServer();