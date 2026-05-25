import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'
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
    <MatomoProvider value={instance}>
      <App />
    </MatomoProvider>
  </StrictMode>,
)