// Dependencies
import ReactDOM from 'react-dom/client';

// Components
import VersionBadge from './components/common/VersionBadge.jsx';

// Screens
import App from './App';

// Stylesheet
import './assets/css/index.css';
import './assets/css/theBox.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <VersionBadge />
  </>
);
