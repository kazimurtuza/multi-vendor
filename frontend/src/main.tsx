import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
export const authService = "http://localhost:5001";
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="851155076921-dgqu7ljrvb6qt1g4stfjbq0enra998h0.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider> 
    <div>
    </div> 
  </StrictMode>,
)
