import styles from './styles/Global.module.sass'
import LizingForm from './components/LizingForm/LizingForm';

import './styles/fonts.sass';

function App() {
    return (
        <div className={styles.global}>
            <LizingForm />
        </div>
    );
}

export default App;
