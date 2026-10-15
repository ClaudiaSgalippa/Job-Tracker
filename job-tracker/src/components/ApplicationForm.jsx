import { useState, useEffect } from 'react'; // Importa gli hook React per gestire lo stato e gli effetti collaterali

function ApplicationForm() {
    const [company, setCompany] = useState(''); // Memorizza il nome dell'azienda, inizialmente una stringa vuota
    const [position, setPosition] = useState(''); // Memorizza la posizione lavorativa, inizialmente una stringa vuota
    const [status, setStatus] = useState('Da valutare'); // Memorizza lo stato iniziale della candidatura
    const [search, setSearch] = useState(''); // Memorizza il testo di ricerca, inizialmente una stringa vuota
    const [editingId, setEditingId] = useState(null); // Identifica la candidatura in modifica, inizialmente nessuna
    const [editingStatus, setEditingStatus] = useState(''); // Memorizza il nuovo stato durante la modifica, inizialmente vuoto
    const [expandedNotes, setExpandedNotes] = useState({}); // Tiene traccia delle note espanse, inizialmente con un oggetto vuoto
    const [notes, setNotes] = useState(''); // Memorizza le note inserite nel form, inizialmente una stringa vuota
    const [editingNotes, setEditingNotes] = useState(''); // Memorizza le note in modifica, inizialmente una stringa vuota

    const [applications, setApplications] = useState(() => { // Recupera dal browser le candidature già salvate per mostrarle quando l'applicazione viene aperta
        const savedApplications = localStorage.getItem('applications'); // Recupera le candidature salvate con la chiave 'applications'

        if (savedApplications) {
            return JSON.parse(savedApplications); // Converte la stringa JSON recuperata in un valore JavaScript
        }

        return []; // Inizializza un array vuoto se non ci sono candidature salvate
    });

    function handleSubmit(event) { // Gestisce l'invio del form per creare una nuova candidatura
        event.preventDefault(); // Impedisce il ricaricamento della pagina al submit

        if (company.trim() === '' || position.trim() === '') {
            return; // Interrompe l'inserimento se azienda o posizione sono vuote
        }

        const newApplication = { // Crea l'oggetto che rappresenta la nuova candidatura
            id: Date.now(), // Genera un identificativo basato sull'orario corrente
            company: company, // Salva il nome dell'azienda
            position: position, // Salva la posizione lavorativa
            status: status, // Salva lo stato selezionato
            notes: notes, // Salva le note inserite
            date: new Date().toISOString() // Registra la data e l'ora di creazione
        };

        setApplications([...applications, newApplication]); // Crea un nuovo array con le candidature esistenti e aggiunge quella nuova

        setCompany(''); // Svuota il campo azienda
        setPosition(''); // Svuota il campo posizione
        setStatus('Da valutare'); // Ripristina lo stato iniziale
        setNotes(''); // Svuota il campo note
        document.activeElement.blur(); // Rimuove il focus dall'elemento attivo
    }

    function handleDelete(id) { // Gestisce l'eliminazione di una candidatura
        const updatedApplications = applications.filter( // Applica un filtro alle candidature
            (application) => application.id !== id // Mantiene tutte le candidature tranne quella selezionata
        );

        setApplications(updatedApplications); // Aggiorna l'elenco delle candidature
    }

    function handleEdit(application) { // Attiva la modifica della candidatura selezionata
        setEditingId(application.id); // Memorizza l'ID della candidatura in modifica
        setEditingStatus(application.status); // Carica lo stato attuale nel campo di modifica
        setEditingNotes(application.notes || ''); // Carica le note, usando una stringa vuota se assenti
    }

    function handleStatusChange(id) { // Salva le modifiche apportate alla candidatura
        const updatedApplications = applications.map((application) => { // Crea un nuovo array per aggiornare la candidatura corrispondente
            if (application.id === id) { // Individua la candidatura da aggiornare
                return {
                    ...application, // Mantiene invariati gli altri dati della candidatura
                    status: editingStatus, // Aggiorna lo stato
                    notes: editingNotes // Aggiorna le note
                };
            }

            return application; // Lascia invariate le altre candidature
        });

        setApplications(updatedApplications); // Aggiorna l'elenco delle candidature con i dati modificati
        setEditingId(null); // Azzera l'ID della candidatura per terminare la modalità di modifica
        setEditingStatus(''); // Svuota lo stato temporaneo utilizzato durante la modifica
        setEditingNotes(''); // Svuota le note temporanee utilizzate durante la modifica
    }

    function getStatusClass(status) { // Associa una classe CSS allo stato della candidatura
        if (status === 'Da valutare') return 'status-da-valutare'; // Restituisce la classe CSS per lo stato Da valutare
        if (status === 'Candidatura inviata') return 'status-inviata'; // Restituisce la classe CSS per lo stato Candidatura inviata
        if (status === 'Colloquio') return 'status-colloquio'; // Restituisce la classe CSS per lo stato Colloquio
        if (status === 'Rifiutata') return 'status-rifiutato'; // Restituisce la classe CSS per lo stato Rifiutata
        if (status === 'Assunta') return 'status-assunta'; // Restituisce la classe CSS per lo stato Assunta
    }

    useEffect(() => { // Esegue il salvataggio delle candidature quando cambia il relativo stato
        localStorage.setItem('applications', JSON.stringify(applications)); // Converte l'array JavaScript in una stringa JSON e la salva nel browser
    }, [applications]); // Riesegue l'effetto ogni volta che cambia applications

    const filteredApplications = applications.filter((application) => { // Crea un array con le candidature che soddisfano la ricerca
        return (
            application.company.toLowerCase().includes(search.toLowerCase()) || // Verifica se il nome dell'azienda contiene il testo cercato ignorando maiuscole e minuscole
            application.position.toLowerCase().includes(search.toLowerCase()) // Verifica se la posizione contiene il testo cercato ignorando maiuscole e minuscole
        );
    });

    const totalApplications = applications.length; // Calcola il numero totale di candidature

    const toEvaluate = applications.filter( // Filtra le candidature in base allo stato
        (application) => application.status === 'Da valutare' // Seleziona le candidature ancora da valutare
    ).length; // Conta le candidature selezionate

    const interviews = applications.filter( // Filtra le candidature in base allo stato
        (application) => application.status === 'Colloquio' // Seleziona le candidature con un colloquio
    ).length; // Conta le candidature selezionate

    const hired = applications.filter( // Filtra le candidature in base allo stato
        (application) => application.status === 'Assunta' // Seleziona le candidature con esito positivo
    ).length; // Conta le candidature selezionate

    return (
        <> {/* Raggruppa gli elementi senza aggiungere un nodo HTML */}
            <form onSubmit={handleSubmit}> {/* Form per inserire una nuova candidatura */}
                <h2>Nuova candidatura</h2> {/* Titolo della sezione di inserimento */}

                <label htmlFor='company'>Azienda</label> {/* Associa la scritta Azienda al campo di testo con id company, così cliccando sull'etichetta si seleziona il campo corrispondente */}
                <input // Crea un campo di testo in cui inserire il nome dell'azienda
                    id='company' // Assegna un identificativo al campo, utilizzato anche dall'etichetta tramite htmlFor
                    type='text' // Specifica che il campo deve accettare testo
                    value={company} // Collega il valore visualizzato nel campo alla variabile di stato company
                    onChange={(event) => setCompany(event.target.value)} // Quando l'utente scrive, recupera il testo inserito e aggiorna lo stato company
                />

                <label htmlFor='position'>Posizione</label> {/* Associa la scritta Posizione al campo di testo identificato da position */}
                <input // Crea un campo di testo in cui inserire il ruolo lavorativo per cui ci si candida
                    id='position' // Assegna un identificativo al campo, collegato alla sua etichetta
                    type='text' // Specifica che il campo deve accettare testo
                    value={position} // Mostra nel campo il valore attualmente contenuto nella variabile di stato position
                    onChange={(event) => setPosition(event.target.value)} // Recupera il testo digitato e aggiorna lo stato position a ogni modifica
                />

                <label htmlFor='status'>Stato candidatura</label> {/* Associa la scritta Stato candidatura al menu a tendina identificato da status */}
                <select // Crea un menu a tendina che permette di scegliere lo stato della candidatura
                    id='status' // Assegna un identificativo al menu, collegato alla sua etichetta
                    value={status} // Seleziona l'opzione il cui valore corrisponde alla variabile di stato status
                    onChange={(event) => setStatus(event.target.value)} // Quando l'utente seleziona un'opzione diversa, aggiorna lo stato status con il valore scelto
                >
                    <option value='Da valutare'>Da valutare</option> {/* Opzione per le candidature da valutare */}
                    <option value='Candidatura inviata'>Candidatura inviata</option> {/* Opzione per le candidature inviate */}
                    <option value='Colloquio'>Colloquio</option> {/* Opzione per le candidature con colloquio */}
                    <option value='Rifiutata'>Rifiutata</option> {/* Opzione per le candidature rifiutate */}
                    <option value='Assunta'>Assunta</option> {/* Opzione per le candidature con esito positivo */}
                </select>

                <label htmlFor='notes'>Note</label> {/* Associa l'etichetta Note al campo di testo identificato da notes, permettendo all'utente di riconoscere a cosa serve il campo */}
                <textarea // Crea un campo di testo su più righe, utile per inserire informazioni aggiuntive sulla candidatura
                    id='notes' // Assegna un identificativo al campo, collegandolo all'etichetta tramite htmlFor
                    value={notes} // Mostra nel campo il testo attualmente contenuto nella variabile di stato notes
                    onChange={(event) => setNotes(event.target.value)} // Quando l'utente scrive o modifica il testo, recupera il nuovo contenuto e aggiorna lo stato notes
                />

                <button type='submit'>Aggiungi candidatura</button> {/* Invoca handleSubmit all'invio del form */}
            </form>

            <h2>Candidature:</h2> {/* Titolo della sezione con l'elenco delle candidature */}

            <div className='application-summary'> {/* Contiene il riepilogo numerico delle candidature */}
                <div className='summary-card'> {/* Scheda con il totale delle candidature */}
                    <span>Totali</span> {/* Etichetta del conteggio totale */}
                    <strong>{totalApplications}</strong> {/* Mostra il numero totale di candidature */}
                </div>

                <div className='summary-card'> {/* Scheda delle candidature da valutare */}
                    <span>Da valutare</span> {/* Etichetta del conteggio */}
                    <strong>{toEvaluate}</strong> {/* Mostra quante candidature sono da valutare */}
                </div>

                <div className='summary-card'> {/* Scheda delle candidature con colloquio */}
                    <span>Colloqui</span> {/* Etichetta del conteggio */}
                    <strong>{interviews}</strong> {/* Mostra il numero di colloqui */}
                </div>

                <div className='summary-card'> {/* Scheda delle candidature con esito positivo */}
                    <span>Assunta</span> {/* Etichetta del conteggio */}
                    <strong>{hired}</strong> {/* Mostra il numero di candidature con esito positivo */}
                </div>
            </div>

            <div> {/* Raggruppa gli elementi che compongono il campo di ricerca delle candidature */}
                <label htmlFor='search'>Cerca</label> {/* Associa l'etichetta Cerca al campo di testo identificato da search */}
                <input // Crea il campo di testo in cui inserire una parola per cercare tra le candidature
                    id='search' // Assegna un identificativo al campo e lo collega all'etichetta tramite htmlFor
                    type='text' // Specifica che il campo accetta testo inserito dall'utente
                    value={search} // Mostra nel campo il valore attualmente contenuto nella variabile di stato search
                    onChange={(event) => setSearch(event.target.value)} // Aggiorna lo stato search con il testo digitato ogni volta che l'utente modifica il campo
                    placeholder='Cerca azienda o posizione' // Suggerimento nel campo vuoto per indicare che è possibile cercare per azienda o posizione
                />
            </div>

            <div className='table-container'> {/* Contenitore della tabella delle candidature */}
                <table> {/* Tabella che mostra le candidature filtrate */}
                    <thead> {/* Intestazione della tabella */}
                        <tr> {/* Riga contenente i nomi delle colonne */}
                            <th>Azienda</th> {/* Colonna del nome dell'azienda */}
                            <th>Posizione</th> {/* Colonna della posizione lavorativa */}
                            <th>Data</th> {/* Colonna della data di candidatura */}
                            <th>Stato candidatura</th> {/* Colonna dello stato della candidatura */}
                            <th className='notes-column'>Note</th> {/* Colonna dedicata alle note */}
                            <th>Modifiche</th> {/* Colonna delle azioni disponibili */}
                        </tr>
                    </thead>

                    <tbody> {/* Corpo della tabella con i dati delle candidature */}
                        {filteredApplications.length === 0 ? ( // Controlla se il numero di candidature filtrate è uguale a zero
                            <tr> {/* Crea una riga per il messaggio di assenza di risultati */}
                                <td colSpan='6'>Nessuna candidatura trovata</td> {/* Estende la cella su tutte e sei le colonne della tabella */}
                            </tr>
                        ) : ( // Se la condizione è falsa, mostra le candidature trovate
                            filteredApplications.map((application) => ( // Scorre ogni elemento dell'array e restituisce una riga JSX per ciascuna candidatura, creando così le righe della tabella
                                <tr key={application.id}> {/* Usa l'ID univoco come chiave per identificare la riga in React */}
                                    <td data-label='Azienda'>{application.company}</td> {/* Mostra il nome dell'azienda e definisce l'etichetta responsive */}
                                    <td data-label='Posizione'>{application.position}</td> {/* Mostra la posizione lavorativa e definisce l'etichetta responsive */}
                                    <td data-label='Data'>
                                        {new Date(application.date).toLocaleDateString('it-IT')} {/* Converte la data in formato leggibile secondo le impostazioni italiane */}
                                    </td>

                                    <td data-label='Stato candidatura'> {/* Cella della tabella dedicata allo stato della candidatura */}
                                        {editingId === application.id ? ( // Confronta l'ID della candidatura in modifica con quello della riga corrente per decidere se mostrare il menu a tendina oppure lo stato attuale
                                            <select
                                                value={editingStatus} // Imposta come valore selezionato lo stato salvato in editingStatus
                                                onChange={(event) => setEditingStatus(event.target.value)} // Aggiorna editingStatus quando l'utente seleziona un nuovo stato
                                            >
                                                <option value='Da valutare'>Da valutare</option> {/* Opzione per le candidature ancora da valutare */}
                                                <option value='Candidatura inviata'>Candidatura inviata</option> {/* Opzione per le candidature già inviate */}
                                                <option value='Colloquio'>Colloquio</option> {/* Opzione per le candidature con un colloquio previsto o in corso */}
                                                <option value='Rifiutata'>Rifiutata</option> {/* Opzione per le candidature che hanno ricevuto un rifiuto */}
                                                <option value='Assunta'>Assunta</option> {/* Opzione per le candidature con esito positivo */}
                                            </select>
                                        ) : ( // Se la candidatura non è in modifica, mostra lo stato attuale
                                            <span className={`status-badge ${getStatusClass(application.status)}`}> {/* Applica la classe CSS comune e quella specifica dello stato */}
                                                {application.status} {/* Visualizza il testo dello stato attuale della candidatura */}
                                            </span>
                                        )}
                                    </td>

                                    <td // Crea la cella della tabella dedicata alle note della candidatura
                                        className={`notes-column ${ // Applica la classe CSS principale e calcola se aggiungere una classe condizionale
                                            editingId !== application.id && // Verifica che la candidatura corrente non sia in modalità modifica
                                            (application.notes || '').trim() === '' // Verifica che l'ID della candidatura corrente sia diverso da quello della candidatura in modifica, così da applicare la classe CSS solo quando la riga non è in modalità modifica
                                                ? 'empty-notes' // Se entrambe le condizioni sono vere, aggiunge la classe CSS empty-notes
                                                : '' // Altrimenti non aggiunge una classe CSS aggiuntiva
                                        }`}
                                        data-label='Note' // Definisce l'etichetta della cella per identificarla nella visualizzazione responsive
                                    >
                                        {editingId === application.id ? ( // Verifica se l'ID della candidatura corrente coincide con quello in modifica
                                            <textarea // Crea un campo di testo su più righe per modificare le note
                                                className='editing-notes' // Applica la classe CSS dedicata allo stile del campo di modifica
                                                value={editingNotes} // Collega il contenuto del campo allo stato editingNotes
                                                onChange={(event) => setEditingNotes(event.target.value)} // Aggiorna editingNotes ogni volta che l'utente modifica il testo
                                            />
                                        ) : (application.notes || '').trim() !== '' ? ( // Se la candidatura non è in modalità modifica, controlla che il testo delle note, dopo aver rimosso gli spazi iniziali e finali, non sia vuoto per decidere se mostrare il contenuto delle note
                                            <div className={`note-cell ${expandedNotes[application.id] ? 'expanded' : ''}`}> {/* Crea il contenitore delle note e aggiunge expanded se quelle della candidatura sono espanse */}
                                                <span> {/* Racchiude il testo delle note da visualizzare nella cella */}
                                                    {(application.notes || '').length > 45 && // Verifica se il testo delle note supera i 45 caratteri
                                                    !expandedNotes[application.id] // Controlla che le note della candidatura corrente non siano già espanse
                                                        ? `${(application.notes || '').slice(0, 45)}...` // Mostra i primi 45 caratteri e i puntini se le note sono lunghe e compresse
                                                        : application.notes} {/* Mostra il testo completo se le note sono brevi oppure già espanse */}
                                                </span>

                                                {(application.notes || '').length > 45 && ( // Mostra il pulsante soltanto se le note superano i 45 caratteri
                                                    <button // Crea il pulsante per espandere o comprimere le note
                                                        type='button' // Impedisce al pulsante di inviare un eventuale form
                                                        className='note-toggle' // Applica la classe CSS dedicata al pulsante delle note
                                                        onClick={() => { // Definisce la funzione da eseguire quando l'utente clicca sul pulsante
                                                            setExpandedNotes((previous) => ({ // Aggiorna lo stato partendo dall'oggetto precedente per conservare le altre espansioni
                                                                ...previous, // Copia tutte le proprietà precedenti dell'oggetto expandedNotes
                                                                [application.id]: !previous[application.id] // Aggiorna il valore associato all'ID della candidatura corrente invertendo quello precedente: se è true diventa false e le note si comprimono, mentre se è false o undefined diventa true e le note si espandono
                                                            }));
                                                        }}
                                                    >
                                                        {expandedNotes[application.id] ? 'Mostra meno' : 'Leggi tutto'} {/* Mostra Mostra meno se le note sono espanse, altrimenti Leggi tutto */}
                                                    </button>
                                                )}
                                            </div>
                                        ) : null} {/* Non mostra contenuti se le note sono vuote e la candidatura non è in modifica */}
                                    </td>

                                    <td data-label='Modifiche'> {/* Crea la cella dedicata alle azioni disponibili sulla candidatura */}
                                        <div className='row-actions'> {/* Raggruppa i pulsanti per gestirne la disposizione tramite CSS */}
                                            <button // Crea il pulsante che avvia la modifica oppure conferma le modifiche
                                                type='button' // Specifica che il pulsante non deve inviare un eventuale form
                                                onClick={() => { // Definisce le operazioni da eseguire al clic sul pulsante
                                                    if (editingId === application.id) { // Verifica se la candidatura corrente è già in modalità modifica
                                                        handleStatusChange(application.id); // Salva le modifiche allo stato e alle note della candidatura identificata dall'ID
                                                    } else { // Se la candidatura non è ancora in modalità modifica
                                                        handleEdit(application); // Avvia la modifica passando alla funzione l'intero oggetto della candidatura selezionata
                                                    }
                                                }}
                                            >
                                                {editingId === application.id ? 'Conferma' : 'Modifica'} {/* Cambia il testo del pulsante in base alla modalità della candidatura */}
                                            </button>

                                            <button // Crea il pulsante per eliminare la candidatura selezionata
                                                type='button' // Impedisce al pulsante di inviare un eventuale form
                                                className='delete-button' // Applica la classe CSS che definisce l'aspetto del pulsante di eliminazione
                                                onClick={() => handleDelete(application.id)} // Chiama handleDelete passando l'ID della candidatura da eliminare
                                            >
                                                Elimina {/* Definisce il testo visualizzato sul pulsante */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApplicationForm; // Esporta il componente per consentirne l'importazione e l'utilizzo in App.jsx