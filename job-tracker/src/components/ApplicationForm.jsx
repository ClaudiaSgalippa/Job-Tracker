import {useState, useEffect} from 'react';

function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('Da valutare')
    const [search, setSearch] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editingStatus, setEditingStatus] = useState('')
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
            <table>
                <thead>
                    <tr>
                        <th>Azienda</th>
                        <th>Posizione</th>
                        <th>Data</th>
                        <th>Stato candidatura</th>
                        <th>Note</th>
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
                            <td>{application.company}</td>
                            <td>{application.position}</td>
                            <td>{new Date(application.date).toLocaleDateString('it-IT')}</td>
                            <td>
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
                            <td>
                                {editingId === application.id ? (
                                    <textarea
                                        value={editingNotes}
                                        onChange={(event) => setEditingNotes(event.target.value)}
                                    />
                                ) : (
                                    application.notes
                                )}
                            </td>
                            <td>
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
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    )
}

export default ApplicationForm;