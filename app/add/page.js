"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function AddAppliance() {
    // state variables for user fields
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [eircode, setEircode] = useState("")

    // state variables for appliance fields
    const [applianceType, setApplianceType] = useState("")
    const [brand, setBrand] = useState("")
    const [modelNumber, setModelNumber] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState("")
    const [costOfAppliance, setCostOfAppliance] = useState("")

    // state variables for displaying feedback to the user
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")

    // handles form submission, sends data to the add endpoint
    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setSuccess("")

        try {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName, lastName, address, mobile, email, eircode,
                    applianceType, brand, modelNumber, serialNumber,
                    purchaseDate, warrantyExpirationDate, costOfAppliance
                })
            })

            const result = await response.json()

            if (response.ok) {
                setSuccess(result.message)
                // reset form fields on success
                setFirstName(""); setLastName(""); setAddress("")
                setMobile(""); setEmail(""); setEircode("")
                setApplianceType(""); setBrand(""); setModelNumber("")
                setSerialNumber(""); setPurchaseDate("")
                setWarrantyExpirationDate(""); setCostOfAppliance("")
            } else {
                // set errors returned from the server
                if (result.errors) {
                    setErrors(result.errors)
                } else {
                    setErrors({ general: result.message || "Failed to add appliance." })
                }
            }
        } catch (error) {
            console.error(error)
            setErrors({ general: "An error occurred while submitting." })
        }
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold">Add Appliance</h1>
            <Link href="/" className="btn btn-outline-dark btn-sm mb-4">← Home</Link>

            <form onSubmit={handleSubmit}>
                {/* user details section */}
                <h5 className="mb-3 mt-3">User Details</h5>

                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                    {errors.firstName && <p className="text-danger mt-1">{errors.firstName}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                    {errors.lastName && <p className="text-danger mt-1">{errors.lastName}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" value={address}
                        onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" />
                    {errors.address && <p className="text-danger mt-1">{errors.address}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input type="text" className="form-control" value={mobile}
                        onChange={(e) => setMobile(e.target.value)} placeholder="0831234567" />
                    {errors.mobile && <p className="text-danger mt-1">{errors.mobile}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email}
                        onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                    {errors.email && <p className="text-danger mt-1">{errors.email}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Eircode</label>
                    <input type="text" className="form-control" value={eircode}
                        onChange={(e) => setEircode(e.target.value)} placeholder="D00 0000" />
                    {errors.eircode && <p className="text-danger mt-1">{errors.eircode}</p>}
                </div>

                {/* appliance details section */}
                <h5 className="mb-3 mt-4">Appliance Details</h5>

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
                        onChange={(e) => setModelNumber(e.target.value)} placeholder="000-000-0000" />
                    {errors.modelNumber && <p className="text-danger mt-1">{errors.modelNumber}</p>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input type="text" className="form-control" value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)} placeholder="0000-0000-0000" />
                    {errors.serialNumber && <p className="text-danger mt-1">{errors.serialNumber}</p>}
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
                        onChange={(e) => setCostOfAppliance(e.target.value)} placeholder="299.99" />
                    {errors.costOfAppliance && <p className="text-danger mt-1">{errors.costOfAppliance}</p>}
                </div>

                <button type="submit" className="btn btn-dark w-100 mt-2">Add</button>

                {/* general error message */}
                {errors.general && <div className="alert alert-danger mt-3">{errors.general}</div>}

                {/* success message with link to home */}
                {success && (
                    <div className="alert alert-success mt-3">
                        {success} <br />
                        <Link href="/">Return to Home</Link>
                    </div>
                )}
            </form>
        </div>
    )
}
