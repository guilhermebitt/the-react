// Dependencies
import ReactDOM from 'react-dom/client';

// Components
import VersionBadge from './components/common/VersionBadge.jsx';

// Screens
import App from './App';

// Stylesheet
import './assets/css/index.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <VersionBadge />
  </>
);
