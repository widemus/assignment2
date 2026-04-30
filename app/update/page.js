"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function UpdateAppliance() {
    // state for the serial number lookup
    const [searchSerial, setSearchSerial] = useState("")

    // state variables for user fields
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [eircode, setEircode] = useState("")

    // state variables for appliance fields (populated after search)
    const [applianceType, setApplianceType] = useState("")
    const [brand, setBrand] = useState("")
    const [modelNumber, setModelNumber] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState("")
    const [costOfAppliance, setCostOfAppliance] = useState("")

    // state for controlling which step is shown
    const [found, setFound] = useState(false)
    const [errors, setErrors] = useState({})
    const [searchError, setSearchError] = useState("")
    const [success, setSuccess] = useState("")

    // find the appliance by serial number
    const handleFind = async (e) => {
        e.preventDefault()
        setSearchError("")
        setFound(false)
        setSuccess("")

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber: searchSerial })
            })

            const data = await response.json()

            if (response.ok) {
                // populate all form fields with current values from the database
                const r = data.data
                setFirstName(r.FirstName)
                setLastName(r.LastName)
                setAddress(r.Address)
                setMobile(r.Mobile)
                setEmail(r.Email)
                setEircode(r.Eircode)
                setApplianceType(r.ApplianceType)
                setBrand(r.Brand)
                setModelNumber(r.ModelNumber)
                setSerialNumber(r.SerialNumber)
                // format dates
                setPurchaseDate(r.PurchaseDate?.split('T')[0] || "")
                setWarrantyExpirationDate(r.WarrantyExpirationDate?.split('T')[0] || "")
                setCostOfAppliance(r.CostOfAppliance?.toString() || "")
                setFound(true)
            } else {
                setSearchError(data.error || "Appliance not found.")
            }
        } catch (err) {
            console.error(err)
            setSearchError("An error occurred while searching.")
        }
    }

    // submit the updated data
    const handleUpdate = async (e) => {
        e.preventDefault()
        setErrors({})
        setSuccess("")

        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serialNumber, firstName, lastName, address, mobile, email, eircode,
                    applianceType, brand, modelNumber, purchaseDate,
                    warrantyExpirationDate, costOfAppliance
                })
            })

            const result = await response.json()

            if (response.ok) {
                setSuccess(result.message)
            } else {
                if (result.errors) {
                    setErrors(result.errors)
                } else {
                    setErrors({ general: result.error || "Failed to update." })
                }
            }
        } catch (err) {
            console.error(err)
            setErrors({ general: "An error occurred while updating." })
        }
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold">Update Appliance</h1>
            <Link href="/" className="btn btn-outline-dark btn-sm mb-4">← Home</Link>

            {/* search for the appliance */}
            {!found && (
                <form onSubmit={handleFind}>
                    <div className="mb-3">
                        <label className="form-label">Enter Serial Number to Find</label>
                        <input type="text" className="form-control" value={searchSerial}
                            onChange={(e) => setSearchSerial(e.target.value)} placeholder="0000-0000-0000" />
                    </div>
                    <button type="submit" className="btn btn-dark">Find</button>
                    {searchError && <div className="alert alert-warning mt-3">{searchError}</div>}
                </form>
            )}

            {/* edit the appliance details */}
            {found && (
                <form onSubmit={handleUpdate}>
                    <h5 className="mb-3">User Details</h5>

                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                        {errors.firstName && <p className="text-danger mt-1">{errors.firstName}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                        {errors.lastName && <p className="text-danger mt-1">{errors.lastName}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                        {errors.address && <p className="text-danger mt-1">{errors.address}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mobile</label>
                        <input type="text" className="form-control" value={mobile}
                            onChange={(e) => setMobile(e.target.value)} />
                        {errors.mobile && <p className="text-danger mt-1">{errors.mobile}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <p className="text-danger mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Eircode</label>
                        <input type="text" className="form-control" value={eircode}
                            onChange={(e) => setEircode(e.target.value)} />
                        {errors.eircode && <p className="text-danger mt-1">{errors.eircode}</p>}
                    </div>

                    <h5 className="mb-3 mt-4">Appliance Details</h5>

                    <div className="mb-3">
                        <label className="form-label">Serial Number</label>
                        <input type="text" className="form-control" value={serialNumber} readOnly disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Appliance Type</label>
                        <select className="form-select" value={applianceType}
                            onChange={(e) => setApplianceType(e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="kettle">Kettle</option>
                            <option value="dishwasher">Dishwasher</option>
                            <option value="oven">Oven</option>
                            <option value="fridge">Fridge</option>
                            <option value="washing-machine">Washing Machine</option>
                        </select>
                        {errors.applianceType && <p className="text-danger mt-1">{errors.applianceType}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Brand</label>
                        <input type="text" className="form-control" value={brand}
                            onChange={(e) => setBrand(e.target.value)} />
                        {errors.brand && <p className="text-danger mt-1">{errors.brand}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Model Number</label>
                        <input type="text" className="form-control" value={modelNumber}
                            onChange={(e) => setModelNumber(e.target.value)} />
                        {errors.modelNumber && <p className="text-danger mt-1">{errors.modelNumber}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Purchase Date</label>
                        <input type="date" className="form-control" value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)} />
                        {errors.purchaseDate && <p className="text-danger mt-1">{errors.purchaseDate}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Warranty Expiration Date</label>
                        <input type="date" className="form-control" value={warrantyExpirationDate}
                            onChange={(e) => setWarrantyExpirationDate(e.target.value)} />
                        {errors.warrantyExpirationDate && <p className="text-danger mt-1">{errors.warrantyExpirationDate}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cost of Appliance (€)</label>
                        <input type="text" className="form-control" value={costOfAppliance}
                            onChange={(e) => setCostOfAppliance(e.target.value)} />
                        {errors.costOfAppliance && <p className="text-danger mt-1">{errors.costOfAppliance}</p>}
                    </div>

                    <button type="submit" className="btn btn-dark w-100 mt-2">Update</button>

                    {errors.general && <div className="alert alert-danger mt-3">{errors.general}</div>}
                    {success && (
                        <div className="alert alert-success mt-3">
                            {success} <br />
                            <Link href="/">Return to Home</Link>
                        </div>
                    )}
                </form>
            )}
        </div>
    )
}
