import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DATA_FILE = path.join(process.cwd(), 'data', 'alerts.json')

function ensureDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function readAlerts(): any[] {
  ensureDir()
  if (!fs.existsSync(DATA_FILE)) return []
  try { 
    const content = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(content) 
  }
  catch { return [] }
}

export function writeAlerts(alerts: any[]) {
  ensureDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(alerts, null, 2))
}

// Simulate blockchain transaction
export function generateBlockchainTransaction(alertData: any): string {
  const hash = crypto.createHash('sha256')
  hash.update(JSON.stringify(alertData) + Date.now())
  return '0x' + hash.digest('hex').slice(0, 40)
}

export async function findNearestHospitals(lat: number, lng: number) {
  // Fallback hospitals if Google Maps API key not available
  return [
    { 
      name: 'City General Hospital', 
      address: `${Math.floor(Math.random() * 5) + 1}km from your location`, 
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`, 
      phone: 'Emergency: 112' 
    },
    { 
      name: 'Government District Hospital', 
      address: 'District headquarters', 
      distance: `${(Math.random() * 4 + 1).toFixed(1)} km`, 
      phone: 'Emergency: 108' 
    },
    { 
      name: 'Community Health Center', 
      address: 'Local health facility', 
      distance: `${(Math.random() * 2 + 0.3).toFixed(1)} km`, 
      phone: 'Emergency: 104' 
    },
  ]
}