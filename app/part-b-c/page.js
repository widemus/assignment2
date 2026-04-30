"use client"
import { useState, useEffect } from 'react'

export default function InventoryForm() {
     // state variables to control form inputs and display messages
    const [eircode, setEircode] = useState("")
    const [applianceType, setApplianceType] = useState("")
    const [brand, setBrand] = useState("")
    const [modelNumber, setModelNumber] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState("")

    // state variables for displaying feedback to the user
    const [errors, setErrors] = useState({}) // changed to object
    const [confirmed, setConfirmed] = useState(false)

    // state variable to hold the fetched inventory list
    const [inventory, setInventory] = useState([])

    // function to fetch inventory from the get endpoint
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/inventory')
            if (response.ok) {
                const data = await response.json()
                setInventory(data)
            }
        } catch (error) {
            console.error(error)
            setErrors({ general: "Failed to load inventory." })
        }
    }

    // fetch inventory on the initial render of the component
    useEffect(() => {
        fetchInventory()
    }, [])

    // handles form submission, performs validation, and api fetch
    const handleSubmit = async (e) => {
        e.preventDefault();
        setConfirmed(false) // hide confirmation message if user is submitting again
        setErrors({}) // reset errors on new submission

        // send valid data to the endpoint
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eircode, applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyExpirationDate })
            })
            // wait for the body of the response
            const result = await response.json()

            // check if server confirmed success
            if (response.ok) {
                // reset the form only on success so the user can add another item
                setEircode("")
                setApplianceType("")
                setBrand("")
                setModelNumber("")
                setSerialNumber("")
                setPurchaseDate("")
                setWarrantyExpirationDate("")
                setErrors({})
                setConfirmed(true)
                fetchInventory() // refresh the inventory list after successful addition
            } else {
                if (result.errors) {
                    setErrors(result.errors) // set the errors returned from the server
                } else {
                    setErrors({ general: "Failed to submit the form." })
                }
            }
        } catch (error) {
            // server didn't respond
            console.error(error)
            setErrors({ general: "An error occurred while submitting the form." })
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
                <h1 className="heading">House<br /> Appliance<br />Inventory</h1>

                <div className="field">
                    <label className="label">Eircode</label>
                    <input type="text" className="input" value={eircode} onChange={(e) => setEircode(e.target.value)} placeholder="D00 0000" />
                    {errors.eircode && <p className="error">{errors.eircode}</p>}
                </div>

                <div className="field">
                    <label className="label">Appliance Type</label>
                    <div className="selectWrapper">
                        <select className="select" value={applianceType} onChange={(e) => setApplianceType(e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="kettle">Kettle</option>
                            <option value="dishwasher">Dishwasher</option>
                            <option value="oven">Oven</option>
                        </select>
                        {errors.applianceType && <p className="error">{errors.applianceType}</p>}
                        </div>
                </div>

                <div className="field">
                        <label className="label">Brand</label>
                    <input type="text" className="input" value={brand} onChange={(e) => setBrand(e.target.value)} />
                    {errors.brand && <p className="error">{errors.brand}</p>}
                </div>

                <div className="field">
                    <label className="label">Model Number</label>
                    <input type="text" className="input" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} placeholder="000-000-0000" />
                    {errors.modelNumber && <p className="error">{errors.modelNumber}</p>}
                </div>

                <div className="field">
                    <label className="label">Serial Number</label>
                    <input type="text" className="input" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="0000-0000-0000" />
                    {errors.serialNumber && <p className="error">{errors.serialNumber}</p>}
                </div>

                <div className="field">
                    <label className="label">Purchase Date</label>
                    <input type="date" className="input" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} placeholder="DD/MM/YYYY" />
                    {errors.purchaseDate && <p className="error">{errors.purchaseDate}</p>}
                </div>

                <div className="field">
                    <label className="label">Warranty Expiration Date</label>
                    <input type="date" className="input" value={warrantyExpirationDate} onChange={(e) => setWarrantyExpirationDate(e.target.value)} placeholder="DD/MM/YYYY" />
                    {errors.warrantyExpirationDate && <p className="error">{errors.warrantyExpirationDate}</p>}
                </div>

                <button type="submit" className="button" >Add to Inventory</button>

                {errors.general && <p className="error">{errors.general}</p>}
                {confirmed && 
                    <p className="confirmation">Appliance added to inventory successfully!</p>
                }

                <div className="inventoryList">
                    <h2 className="inventory-heading">Registered Items:</h2>
                    {inventory.length === 0 ? (
                        <p className="">No appliances registered yet.</p>
                    ) : ( 
                        <ul className="inventory-ul">
                            {inventory.map((item, index) => (
                                <li key={index} className="inventory-li">
                                    <span className="">{item.applianceType}</span> <br />
                                    Brand: {item.brand} | Model: {item.modelNumber} | Serial: {item.serialNumber}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
        </form>
    )
}
