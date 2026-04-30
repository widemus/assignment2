"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function DeleteAppliance() {
    // state for the serial number lookup
    const [searchSerial, setSearchSerial] = useState("")
    // state for the found appliance data
    const [appliance, setAppliance] = useState(null)
    // state for error and success messages
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // find the appliance by serial number
    const handleFind = async (e) => {
        e.preventDefault()
        setError("")
        setAppliance(null)
        setSuccess("")

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber: searchSerial })
            })

            const data = await response.json()

            if (response.ok) {
                setAppliance(data.data)
            } else {
                setError(data.error || "Appliance not found.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while searching.")
        }
    }

    // confirm and delete the appliance
    const handleDelete = async () => {
        setError("")

        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber: appliance.SerialNumber })
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(data.message)
                setAppliance(null)
            } else {
                setError(data.error || "Failed to delete.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while deleting.")
        }
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold">Delete Appliance</h1>
            <Link href="/" className="btn btn-outline-dark btn-sm mb-4">← Home</Link>

            {/* search for the appliance */}
            {!appliance && !success && (
                <form onSubmit={handleFind}>
                    <div className="mb-3">
                        <label className="form-label">Enter Serial Number to Find</label>
                        <input type="text" className="form-control" value={searchSerial}
                            onChange={(e) => setSearchSerial(e.target.value)} placeholder="0000-0000-0000" />
                    </div>
                    <button type="submit" className="btn btn-dark">Find</button>
                    {error && <div className="alert alert-warning mt-3">{error}</div>}
                </form>
            )}

            {/* confirm deletion */}
            {appliance && (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Confirm Deletion</h5>
                        <p className="text-muted">Are you sure you want to delete this appliance?</p>
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '70%' }} />
                            </colgroup>
                            <tbody>
                                <tr><td><strong>Type</strong></td><td>{appliance.ApplianceType}</td></tr>
                                <tr><td><strong>Brand</strong></td><td>{appliance.Brand}</td></tr>
                                <tr><td><strong>Model</strong></td><td>{appliance.ModelNumber}</td></tr>
                                <tr><td><strong>Serial</strong></td><td>{appliance.SerialNumber}</td></tr>
                                <tr><td><strong>Owner</strong></td><td>{appliance.FirstName} {appliance.LastName}</td></tr>
                            </tbody>
                        </table>
                        <button onClick={handleDelete} className="btn btn-danger me-2">Confirm Delete</button>
                        <button onClick={() => setAppliance(null)} className="btn btn-outline-dark">Cancel</button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            )}

            {/* success message after deletion */}
            {success && (
                <div className="alert alert-success mt-3">
                    {success} <br />
                    <Link href="/">Return to Home</Link>
                </div>
            )}
        </div>
    )
}
