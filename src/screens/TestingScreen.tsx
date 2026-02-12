// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

// Components
import InventorySection from '@/components/sections/InventorySection';

// Stylesheet
//import styles from './menus.module.css';

// Testing Component/Screen
function TestingScreen() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');

  return (
    <main>
      <section>
        <h2>Testing New Features</h2>
        <Link to={lastScreen}>
          <button>Back</button>
        </Link>
        <hr />
      </section>

      {/* New Features Section */}
      <section>
        <InventorySection />
      </section>
    </main>
  );
}

export default TestingScreen;
