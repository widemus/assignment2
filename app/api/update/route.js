import pool from '../../../lib/db'

// regex patterns
const eircodePattern = /^[D]\d{2}\s[A-Z0-9]{4}$/
const modelNumberPattern = /^\d{3}-\d{3}-\d{4}$/
const serialNumberPattern = /^\d{4}-\d{4}-\d{4}$/
const namePattern = /^[A-Za-z\s'-]{2,50}$/
const addressPattern = /^[A-Za-z0-9\s,.\-'#/]{5,200}$/
const mobilePattern = /^08[3-9]\d{7}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const costPattern = /^\d+(\.\d{1,2})?$/

// helper function to prevent XSS attacks
function sanitize(str) {
    if (typeof str !== 'string') return ""
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
}

// api route handler for POST requests 
export async function POST(req) {
    try {
        const body = await req.json()
        const errors = {}

        // validate serial number used to find the appliance
        if (!serialNumberPattern.test(body.serialNumber)) {
            return Response.json({ success: false, error: "Invalid serial number." }, { status: 400 })
        }

        // validate user fields
        if (!namePattern.test(body.firstName)) errors.firstName = "First name must be 2-50 letters."
        if (!namePattern.test(body.lastName)) errors.lastName = "Last name must be 2-50 letters."
        if (!addressPattern.test(body.address)) errors.address = "Please enter a valid address."
        if (!mobilePattern.test(body.mobile)) errors.mobile = "Please enter a valid mobile number."
        if (!emailPattern.test(body.email)) errors.email = "Please enter a valid email."
        if (!eircodePattern.test(body.eircode)) errors.eircode = "Please enter a valid Eircode."

        // validate appliance fields
        if (!body.applianceType) errors.applianceType = "Please select an appliance type."
        if (!body.brand || body.brand.trim().length < 1) errors.brand = "Brand is required."
        if (!modelNumberPattern.test(body.modelNumber)) errors.modelNumber = "Invalid model number."
        if (!body.purchaseDate) errors.purchaseDate = "Purchase date is required."
        if (!body.warrantyExpirationDate) errors.warrantyExpirationDate = "Warranty date is required."
        if (body.warrantyExpirationDate && body.purchaseDate && body.warrantyExpirationDate < body.purchaseDate) {
            errors.warrantyExpirationDate = "Warranty date cannot be earlier than purchase date."
        }
        if (!costPattern.test(body.costOfAppliance)) errors.costOfAppliance = "Please enter a valid cost."

        if (Object.keys(errors).length > 0) {
            return Response.json({ success: false, errors }, { status: 400 })
        }

        // sanitize all inputs
        const serialNumber = sanitize(body.serialNumber)
        const firstName = sanitize(body.firstName)
        const lastName = sanitize(body.lastName)
        const address = sanitize(body.address)
        const mobile = sanitize(body.mobile)
        const email = sanitize(body.email)
        const eircode = sanitize(body.eircode)
        const applianceType = sanitize(body.applianceType)
        const brand = sanitize(body.brand)
        const modelNumber = sanitize(body.modelNumber)
        const purchaseDate = sanitize(body.purchaseDate)
        const warrantyExpirationDate = sanitize(body.warrantyExpirationDate)
        const costOfAppliance = parseFloat(body.costOfAppliance)

        // find the appliance and its linked user
        const [rows] = await pool.query(
            'SELECT a.ApplianceID, a.UserID FROM appliances a WHERE a.SerialNumber = ?',
            [serialNumber]
        )

        if (rows.length === 0) {
            return Response.json({ success: false, error: "Appliance not found." }, { status: 404 })
        }

        const { ApplianceID, UserID } = rows[0]

        // update the appliance record
        await pool.query(
            'UPDATE appliances SET ApplianceType = ?, Brand = ?, ModelNumber = ?, PurchaseDate = ?, WarrantyExpirationDate = ?, CostOfAppliance = ? WHERE ApplianceID = ?',
            [applianceType, brand, modelNumber, purchaseDate, warrantyExpirationDate, costOfAppliance, ApplianceID]
        )

        // update the user record
        await pool.query(
            'UPDATE users SET FirstName = ?, LastName = ?, Address = ?, Mobile = ?, Email = ?, Eircode = ? WHERE UserID = ?',
            [firstName, lastName, address, mobile, email, eircode, UserID]
        )

        return Response.json({ message: "Appliance has been updated." })

    } catch (error) {
        console.error("Update error:", error)
        return Response.json({ message: "Something went wrong." }, { status: 500 })
    }
}
