import pool from '../../../lib/db'

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
        const serialNumber = sanitize(body.serialNumber)

        // validate serial number format
        if (!serialNumberPattern.test(body.serialNumber)) {
            return Response.json({ success: false, error: "Please enter a valid serial number (0000-0000-0000)." }, { status: 400 })
        }

        // join appliances with users to get full details
        const [rows] = await pool.query(
            'SELECT a.*, u.FirstName, u.LastName, u.Address, u.Mobile, u.Email, u.Eircode FROM appliances a JOIN users u ON a.UserID = u.UserID WHERE a.SerialNumber = ?',
            [serialNumber]
        )

        // check if any result was found
        if (rows.length === 0) {
            return Response.json({ success: false, error: "No matching appliance found!" }, { status: 404 })
        }

        return Response.json({ success: true, data: rows[0] })

    } catch (error) {
        console.error("Search error:", error)
        return Response.json({ message: "Something went wrong." }, { status: 500 })
    }
}
