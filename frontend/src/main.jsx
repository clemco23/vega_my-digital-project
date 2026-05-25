import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const instance = createInstance({
  urlBase: 'https://haptokids.matomo.cloud/',
  siteId: 1,
  trackPageView: true,
  enableAutoPageViews: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <MatomoProvider value={instance}>
        <App />
      </MatomoProvider>
    </HelmetProvider>
  </StrictMode>,
)