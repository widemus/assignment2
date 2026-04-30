import { readFileSync } from 'fs'
import { join } from 'path'

// determing the file path to data.json
const filePath = join(process.cwd(), 'data.json')

// api route handler for GET requests to /api/inventory
export async function GET() {
    try {
        // read the file and parse it
        const inventoryData = JSON.parse(readFileSync(filePath, 'utf-8'))
        
        // send the array back to the frontend
        return Response.json(inventoryData, { status: 200 })
        
    } catch (error) {
        console.error("Read error:", error)
        // if error catched, return an empty array fallback
        return Response.json([], { status: 500 })
    }
}