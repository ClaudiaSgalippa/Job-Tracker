import './App.css'; // Importa gli stili del componente App dal file indicato
import ApplicationForm from './components/ApplicationForm'; // Importa il form per gestire le candidature dal file indicato

function App() {
  return ( // Restituisce il JSX da visualizzare
    <>
      <main> {/* Contenitore principale della pagina */}
        <h1>Job tracker</h1> {/* Titolo dell'applicazione */}
        <h2>Tieni traccia delle tue candidature</h2> {/* Sottotitolo descrittivo */}
        <ApplicationForm /> {/* Mostra il form delle candidature */}
      </main>
    </>
  );
}

export default App; // Esporta il componente per utilizzarlo in altri file