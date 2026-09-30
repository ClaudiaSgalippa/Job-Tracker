import {useState} from 'react';

function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('Da valutare')
    const [applications, setApplications] = useState([])

    function handleSubmit(event) {
        event.preventDefault()

        const newApplication = {
            id: Date.now(),
            company:company,
            position:position,
            status:status
        }

        setApplications([...applications, newApplication])
    }

    function handleDelete(id) {
        const updatedApplications = applications.filter(
            (application) => application.id !== id
        )

        setApplications(updatedApplications)
    }

    function handleStatusChange(id, newStatus) {
        const updatedApplications = applications.map((application) => {
            if (application.id === id) {
                return {
                    ...application,
                    status: newStatus
                }
            }

            return application
        })

        setApplications(updatedApplications)
    }


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
                <button type='submit'>Aggiungi candidatura</button>
            </form>
            <h2>Candidature:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Azienda</th>
                        <th>Posizione</th>
                        <th>Stato candidatura</th>
                        <th>Modifiche</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.company}</td>
                            <td>{application.position}</td>
                            <td>
                                <select 
                                    value={application.status} 
                                    onChange={(event) => 
                                        handleStatusChange(application.id, event.target.value)
                                    }
                                >
                                    <option value={"Da valutare"}>Da valutare</option>
                                    <option value={"Candidatura inviata"}>Candidatura inviata</option>
                                    <option value={"Colloquio"}>Colloquio</option>
                                    <option value={"Rifiutata"}>Rifiutata</option>
                                    <option value={"Assunta"}>Assunta</option>
                                </select>
                            </td>
                            <td>
                                <button>Modifica</button>
                                <button onClick={() => handleDelete(application.id)}>
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default ApplicationForm;