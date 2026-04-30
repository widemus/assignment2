"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function SearchAppliance() {
    // state for the serial number input
    const [serialNumber, setSerialNumber] = useState("")
    // state for the search result
    const [result, setResult] = useState(null)
    // state for error/not found messages
    const [error, setError] = useState("")

    // handles the search form submission
    const handleSearch = async (e) => {
        e.preventDefault()
        setError("")
        setResult(null)

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber })
            })

            const data = await response.json()

            if (response.ok) {
                setResult(data.data)
            } else {
                setError(data.error || "Something went wrong.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while searching.")
        }
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold">Search Appliance</h1>
            <Link href="/" className="btn btn-outline-dark btn-sm mb-4">← Home</Link>

            {/* serial number search form */}
            <form onSubmit={handleSearch}>
                <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input type="text" className="form-control" value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)} placeholder="0000-0000-0000" />
                </div>
                <button type="submit" className="btn btn-dark">Search</button>
            </form>

            {/* error or not found message */}
            {error && (
                <div className="alert alert-warning mt-4">
                    {error} <br />
                    <Link href="/">Return to Home</Link>
                </div>
            )}

            {/* display appliance + user details if found */}
            {result && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="mt-3">Appliance Details</h5>
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '70%' }} />
                            </colgroup>
                            <tbody>
                                <tr><td><strong>Type</strong></td><td>{result.ApplianceType}</td></tr>
                                <tr><td><strong>Brand</strong></td><td>{result.Brand}</td></tr>
                                <tr><td><strong>Model</strong></td><td>{result.ModelNumber}</td></tr>
                                <tr><td><strong>Serial</strong></td><td>{result.SerialNumber}</td></tr>
                                <tr><td><strong>Purchase Date</strong></td><td>{result.PurchaseDate}</td></tr>
                                <tr><td><strong>Warranty Expires</strong></td><td>{result.WarrantyExpirationDate}</td></tr>
                                <tr><td><strong>Cost</strong></td><td>€{result.CostOfAppliance}</td></tr>
                            </tbody>
                        </table>
                        <h5 className="mt-3">Owner Details</h5>
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '70%' }} />
                            </colgroup>
                            <tbody>
                                <tr><td><strong>Name</strong></td><td>{result.FirstName} {result.LastName}</td></tr>
                                <tr><td><strong>Address</strong></td><td>{result.Address}</td></tr>
                                <tr><td><strong>Mobile</strong></td><td>{result.Mobile}</td></tr>
                                <tr><td><strong>Email</strong></td><td>{result.Email}</td></tr>
                                <tr><td><strong>Eircode</strong></td><td>{result.Eircode}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
