// Dependencies
import ReactDOM from 'react-dom/client';

// Components
import VersionBadge from './components/common/VersionBadge.jsx';

// Screens
import App from './App.jsx';

// Stylesheet
import './assets/css/index.css';
import './assets/css/theBox.css';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <>
    <App />
    <VersionBadge />
  </>
);
