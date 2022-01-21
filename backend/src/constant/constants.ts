require('dotenv').config()

export const __prod__ = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT || 4000;
export const WEB_URL = process.env.WEB_URI || 'http://localhost:3000';
