import pool from '../../../lib/db'

// regex: serial number format 0000-0000-0000
const serialNumberPattern = /^\d{4}-\d{4}-\d{4}$/

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

        // validate serial number format
        if (!serialNumberPattern.test(body.serialNumber)) {
            return Response.json({ success: false, error: "Invalid serial number." }, { status: 400 })
        }

        const serialNumber = sanitize(body.serialNumber)

        // check if appliance exists before deleting
        const [rows] = await pool.query(
            'SELECT ApplianceID FROM appliances WHERE SerialNumber = ?',
            [serialNumber]
        )

        if (rows.length === 0) {
            return Response.json({ success: false, error: "Appliance not found." }, { status: 404 })
        }

        // delete the appliance record
        await pool.query(
            'DELETE FROM appliances WHERE SerialNumber = ?',
            [serialNumber]
        )

        return Response.json({ message: "Appliance deleted." })

    } catch (error) {
        console.error("Delete error:", error)
        return Response.json({ message: "Something went wrong." }, { status: 500 })
    }
}
