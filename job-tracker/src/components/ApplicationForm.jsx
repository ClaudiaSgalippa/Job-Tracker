import {useState, useEffect} from 'react';

function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('Da valutare')
    const [search, setSearch] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editingStatus, setEditingStatus] = useState('')
    const [expandedNotes, setExpandedNotes] = useState({})
    const [notes, setNotes] = useState('')
    const [editingNotes, setEditingNotes] = useState('')
    const [applications, setApplications] = useState(() => {
        const savedApplications = localStorage.getItem('applications')

        if (savedApplications) {
            return JSON.parse(savedApplications)
        }

        return []
    })

    function handleSubmit(event) {
        event.preventDefault()

        if (company.trim() === '' || position.trim() === '') {
            return
        }

        const newApplication = {
            id: Date.now(),
            company:company,
            position:position,
            status:status,
            notes:notes,
            date: new Date().toISOString()
        }

        setApplications([...applications, newApplication])

        setCompany('')
        setPosition('')
        setStatus('Da valutare')
        setNotes('')
        document.activeElement.blur()
    }

    function handleDelete(id) {
        const updatedApplications = applications.filter(
            (application) => application.id !== id
        )

        setApplications(updatedApplications)
    }

    function handleEdit(application) {
        setEditingId(application.id)
        setEditingStatus(application.status)
        setEditingNotes(application.notes)
    }

    function handleStatusChange(id) {
        const updatedApplications = applications.map((application) => {
            if (application.id === id) {
                return {
                    ...application,
                    status: editingStatus,
                    notes: editingNotes
                }
            }

            return application
        })

        setApplications(updatedApplications)
        setEditingId(null)
        setEditingStatus('')
        setEditingNotes('')
    }

    function getStatusClass(status) {
        if (status === 'Da valutare') return 'status-da-valutare'
        if (status === 'Candidatura inviata') return 'status-inviata'
        if (status === 'Colloquio') return 'status-colloquio'
        if (status === 'Rifiutata') return 'status-rifiutato'
        if (status === 'Assunta') return 'status-assunta'
    }

    useEffect(() => {
        localStorage.setItem('applications', JSON.stringify(applications))
    }, [applications])

    const filteredApplications = applications.filter((application) => {
        return (
            application.company.toLowerCase().includes(search.toLowerCase()) ||
            application.position.toLowerCase().includes(search.toLowerCase())
        )
    })

    const totalApplications = applications.length
    const toEvaluate = applications.filter(
        (application) => application.status === 'Da valutare'
    ).length
    const interviews = applications.filter(
        (application) => application.status === 'Colloquio'
    ).length
    const hired = applications.filter(
        (application) => application.status === 'Assunta'
    ).length

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Nuova candidatura</h2>
                <label htmlFor='company'>Azienda</label>
                <input
                    id='company'
                    type='text'
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                />
                <label htmlFor='position'>Posizione</label>
                <input
                    id='position'
                    type='text'
                    value={position}
                    onChange={(event) => setPosition(event.target.value)}
                />
                <label htmlFor='status'>Stato candidatura</label>
                <select
                    id='status'
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                >
                    <option value='Da valutare'>Da valutare</option>
                    <option value='Candidatura inviata'>Candidatura inviata</option>
                    <option value='Colloquio'>Colloquio</option> 
                    <option value='Rifiutata'>Rifiutata</option> 
                    <option value='Assunta'>Assunta</option>
                </select>
                <label htmlFor='notes'>Note</label>
                <textarea
                    id='notes'
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                ></textarea>
                <button type='submit'>Aggiungi candidatura</button>
            </form>
            <h2>Candidature:</h2>          
            <div className="application-summary">
                <div className="summary-card">
                    <span>Totali</span>
                    <strong>{totalApplications}</strong>
                </div>

                <div className="summary-card">
                    <span>Da valutare</span>
                    <strong>{toEvaluate}</strong>
                </div>

                <div className="summary-card">
                    <span>Colloqui</span>
                    <strong>{interviews}</strong>
                </div>

                <div className="summary-card">
                    <span>Assunta</span>
                    <strong>{hired}</strong>
                </div>
            </div>
            <div>
                <label htmlFor='search'>Cerca</label>
                <input
                    id='search'
                    type='text'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Cerca azienda o posizione'
                />
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Azienda</th>
                            <th>Posizione</th>
                            <th>Data</th>
                            <th>Stato candidatura</th>
                            <th className="notes-column">Note</th>
                            <th>Modifiche</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.length === 0 ? (
                            <tr>
                                <td colSpan='6'>Nessuna candidatura trovata</td>
                            </tr>
                        ) : (
                            filteredApplications.map((application) => (
                                <tr key={application.id}>
                                <td data-label="Azienda">{application.company}</td>
                                <td data-label="Posizione">{application.position}</td>
                                <td data-label="Data">{new Date(application.date).toLocaleDateString('it-IT')}</td>
                                <td data-label="Stato candidatura">
                                    {editingId === application.id ? (
                                        <select 
                                            value={editingStatus} 
                                            onChange={(event) => setEditingStatus(event.target.value)}
                                        >
                                            <option value={"Da valutare"}>Da valutare</option>
                                            <option value={"Candidatura inviata"}>Candidatura inviata</option>
                                            <option value={"Colloquio"}>Colloquio</option>
                                            <option value={"Rifiutata"}>Rifiutata</option>
                                            <option value={"Assunta"}>Assunta</option>
                                        </select>
                                    ) : (
                                        <span className={`status-badge ${getStatusClass(application.status)}`}>
                                            {application.status}
                                        </span>
                                    )}
                                </td>    
                                <td className="notes-column" data-label="Note">
                                    {editingId === application.id ? (
                                        <textarea
                                            className="editing-notes"
                                            value={editingNotes}
                                            onChange={(event) => setEditingNotes(event.target.value)}
                                        />
                                    ) : (application.notes || '').trim() !== '' ? (
                                        <div className={`note-cell ${expandedNotes[application.id] ? 'expanded' : ''}`}>
                                            <span>
                                                {(application.notes || '').length > 45 &&
                                                !expandedNotes[application.id]
                                                    ? `${(application.notes || '').slice(0, 45)}...`
                                                    : application.notes}
                                            </span>
                                                
                                            {(application.notes || '').length > 45 && (
                                                <button
                                                    type="button"
                                                    className="note-toggle"
                                                    onClick={() =>
                                                        setExpandedNotes((previous) => ({
                                                            ...previous,
                                                            [application.id]: !previous[application.id]
                                                        }))
                                                    }
                                                >
                                                    {expandedNotes[application.id]
                                                        ? 'Mostra meno'
                                                        : 'Leggi tutto'}
                                                </button>
                                            )}
                                        </div>
                                    ) : null}
                                </td>
                                <td data-label="Modifiche">
                                    <div className="row-actions">
                                        <button
                                            type='button'
                                            onClick={() => {
                                                if (editingId === application.id) {
                                                    handleStatusChange(application.id)
                                                } else {
                                                    handleEdit(application)
                                                }
                                            }}
                                        >
                                            {editingId === application.id ? 'Conferma' : 'Modifica'}
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => handleDelete(application.id)}
                                        >
                                            Elimina
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
    )
}

export default ApplicationForm;