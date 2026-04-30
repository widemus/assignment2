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

        // validate user fields
        if (!namePattern.test(body.firstName)) {
            errors.firstName = "First name must be 2-50 letters."
        }
        if (!namePattern.test(body.lastName)) {
            errors.lastName = "Last name must be 2-50 letters."
        }
        if (!addressPattern.test(body.address)) {
            errors.address = "Please enter a valid address (5-200 characters)."
        }
        if (!mobilePattern.test(body.mobile)) {
            errors.mobile = "Please enter a valid Irish mobile number (08X XXXXXXX)."
        }
        if (!emailPattern.test(body.email)) {
            errors.email = "Please enter a valid email address."
        }
        if (!eircodePattern.test(body.eircode)) {
            errors.eircode = "Please enter a valid Eircode (D00 0000)."
        }

        // validate appliance fields
        if (!body.applianceType) {
            errors.applianceType = "Please select an appliance type."
        }
        if (!body.brand || body.brand.trim().length < 1) {
            errors.brand = "Brand is required."
        }
        if (!modelNumberPattern.test(body.modelNumber)) {
            errors.modelNumber = "Please enter a valid model number (000-000-0000)."
        }
        if (!serialNumberPattern.test(body.serialNumber)) {
            errors.serialNumber = "Please enter a valid serial number (0000-0000-0000)."
        }
        if (!body.purchaseDate) {
            errors.purchaseDate = "Purchase date is required."
        }
        if (!body.warrantyExpirationDate) {
            errors.warrantyExpirationDate = "Warranty expiration date is required."
        }
        // ensure warranty expiration is not before purchase date
        if (body.warrantyExpirationDate && body.purchaseDate && body.warrantyExpirationDate < body.purchaseDate) {
            errors.warrantyExpirationDate = "Warranty date cannot be earlier than purchase date."
        }
        if (!costPattern.test(body.costOfAppliance)) {
            errors.costOfAppliance = "Please enter a valid cost (e.g. 299.99)."
        }

        // if any validation errors, return them with a 400 status
        if (Object.keys(errors).length > 0) {
            return Response.json({ success: false, errors }, { status: 400 })
        }

        // sanitize all inputs
        const firstName = sanitize(body.firstName)
        const lastName = sanitize(body.lastName)
        const address = sanitize(body.address)
        const mobile = sanitize(body.mobile)
        const email = sanitize(body.email)
        const eircode = sanitize(body.eircode)
        const applianceType = sanitize(body.applianceType)
        const brand = sanitize(body.brand)
        const modelNumber = sanitize(body.modelNumber)
        const serialNumber = sanitize(body.serialNumber)
        const purchaseDate = sanitize(body.purchaseDate)
        const warrantyExpirationDate = sanitize(body.warrantyExpirationDate)
        const costOfAppliance = parseFloat(body.costOfAppliance)

        // check if appliance with this serial number already exists
        const [existing] = await pool.query(
            'SELECT ApplianceID FROM appliances WHERE SerialNumber = ?',
            [serialNumber]
        )
        if (existing.length > 0) {
            return Response.json({ success: false, errors: { serialNumber: "Appliance already exists." } }, { status: 400 })
        }

        // check if user already exists by email, otherwise create new user
        let userId
        const [existingUser] = await pool.query(
            'SELECT UserID FROM users WHERE Email = ?',
            [email]
        )

        if (existingUser.length > 0) {
            // user already exists, use their id
            userId = existingUser[0].UserID
        } else {
            // insert new user into users table
            const [userResult] = await pool.query(
                'INSERT INTO users (FirstName, LastName, Address, Mobile, Email, Eircode) VALUES (?, ?, ?, ?, ?, ?)',
                [firstName, lastName, address, mobile, email, eircode]
            )
            userId = userResult.insertId
        }

        // insert the new appliance linked to the user
        await pool.query(
            'INSERT INTO appliances (ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, CostOfAppliance, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [applianceType, brand, modelNumber, serialNumber, purchaseDate, warrantyExpirationDate, costOfAppliance, userId]
        )

        return Response.json({ message: "New appliance added successfully." })

    } catch (error) {
        console.error("Add error:", error)
        return Response.json({ message: "Something went wrong." }, { status: 500 })
    }
}
