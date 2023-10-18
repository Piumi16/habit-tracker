import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Routes } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

i18next.init({
  interpolation: { escapeValue: false }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Routes>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </Routes>
)
