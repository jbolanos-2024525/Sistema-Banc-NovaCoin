import dotenv from 'dotenv';

dotenv.config();

const { initServer } = await import('./configs/app.js');

initServer();