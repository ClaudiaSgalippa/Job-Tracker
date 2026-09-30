import {useState} from 'react';

function ApplicationForm() {
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')


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

        </form>
    )
}

export default ApplicationForm;