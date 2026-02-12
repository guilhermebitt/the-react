// Dependencies
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useStore } from '@/stores';

// Components
import InventorySection from '@/components/sections/InventorySection';

// Stylesheet
//import styles from './menus.module.css';

// Testing Component/Screen
function TestingScreen() {
  // Getting the lastScreen from localStorage
  const [lastScreen, setLastScreen] = useLocalStorage('lastScreen', '/');

  // Inventory store
  const inv = useStore("inventory", "actions");

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
        <button onClick={() => {inv.addItem("iron_sword")}}>Add item</button>
      </section>
    </main>
  );
}

export default TestingScreen;
