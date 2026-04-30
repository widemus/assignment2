import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// determing the file path to data.json
const filePath = join(process.cwd(), 'data.json')

// regex patterns for backend validation
const eircodePattern = /^[D]\d{2}\s[A-Z0-9]{4}$/
const modelNumberPattern = /^\d{3}-\d{3}-\d{4}$/
const serialNumberPattern = /^\d{4}-\d{4}-\d{4}$/

// helper function to prevent XSS attacks
function sanitize(str) {
    // ensure the input is a string before sanitizing
    if (typeof str !== 'string') return ""
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
}

// api route handler for post requests to /api/register
export async function POST(req) {
    try {
        // parse the json body of the request and apply sanitization 
        const body = await req.json()
        const errors = {}

        // validate formats using regex patterns
        if (!eircodePattern.test(body.eircode)) {
            errors.eircode = "Please enter a valid Eircode (D0 0000)."
        }

        if (!body.applianceType) {
            errors.applianceType = "Please select an appliance type."
        }

        if (!body.brand) {
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
        if (body.warrantyExpirationDate < body.purchaseDate) {
            errors.warrantyExpirationDate = "Warranty expiration date cannot be earlier than the purchase date."
        }

        // if any errors, return them with a 400 status
        if (Object.keys(errors).length > 0) {
            return Response.json({ success: false, errors }, { status: 400 })
        }

        // if validation passes, proceed with sanitization and file operations
        const inventoryData = JSON.parse(readFileSync(filePath, 'utf-8'))
        const cleanEntry = {
            eircode: sanitize(body.eircode),
            applianceType: sanitize(body.applianceType),
            brand: sanitize(body.brand),
            modelNumber: sanitize(body.modelNumber),
            serialNumber: sanitize(body.serialNumber),
            purchaseDate: sanitize(body.purchaseDate),
            warrantyExpirationDate: sanitize(body.warrantyExpirationDate),
        }

        // add the new sanitized entry to the array
        inventoryData.push(cleanEntry)

        // convert the updated array back to a string and overwrite the file
        writeFileSync(filePath, JSON.stringify(inventoryData, null, 2))
        return Response.json({ message: "Registration successful" })
    
    // catch and log any errors that occur during file operations or parsing
    } catch (error) {
        console.error("Register error:", error)
        return Response.json({ message: "Something went wrong." }, { status: 500 })
    }
}