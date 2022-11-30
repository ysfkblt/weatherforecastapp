import { useState, useEffect } from 'react'

const DisplayZone = ({ }) => {
    const [zip, setZip] = useState('')
    const [zone, setZone] = useState('')

    const fetchZone = async (zip) => {
        const response = await fetch(`https://phzmapi.org/${zip}.json`)
        const data = await response.json()
        return data
    }


    useEffect(() => {
        async function getZone() {
            let zoneResults = await fetchZone(zip)
            setZone(zoneResults)
        }
        getZone()
    }, [zip])

    return (
        <div>
            <span>ENTER ZIP
                <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
            </span>
            <h1>ZONE--->{zone.zone}</h1>
        </div>
    )
}

export default DisplayZone
