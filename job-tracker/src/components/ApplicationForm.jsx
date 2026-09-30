import {useState} from 'react';

function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('Da valutare')


    return (
        <form>
            <h2>Nuova candidatura</h2>
            <label htmlFor='company'>Azienda</label>
            <input
                id="company"
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
            />
            <label htmlFor='position'>Posizione</label>
            <input
                id="position"
                type="text"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
            />
            <label htmlFor='status'>Stato candidatura</label>
            <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
            >
                <option value="Da valutare">Da valutare</option>
                <option value="Candidatura inviata">Candidatura inviata</option>
                <option value="Colloquio">Colloquio</option> 
                <option value="Rifiutata">Rifiutata</option> 
                <option value="Assunta">Assunta</option>
            </select>

        </form>
    )
}

export default ApplicationForm;