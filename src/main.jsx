import { createRoot } from 'react-dom/client'
import { SpeedInsights } from "@vercel/speed-insights/react"
import './index.css'
import App from './App.jsx'
import "./styles/globals.css";
import "./styles/components.css";   
import "./styles/sponsors.css";
import { ThemeProvider } from "./context/ThemeContext";

const isProduction = import.meta.env.PROD;

createRoot(document.getElementById('root')).render(
  <>
  <ThemeProvider>
    {isProduction ? <SpeedInsights /> : null}
    <App />
    </ThemeProvider>
  </>,
)
