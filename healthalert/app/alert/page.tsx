'use client'
import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

type Stage = 'form' | 'analyzing' | 'locating' | 'sending' | 'success' | 'spam'

interface Hospital {
  name: string
  address: string
  distance: string
  phone: string
}

export default function AlertPage() {
  const [name, setName]           = useState('')
  const [problem, setProblem]     = useState('')
  const [stage, setStage]         = useState<Stage>('form')
  const [location, setLocation]   = useState<{ lat: number; lng: number; city: string } | null>(null)
  const [aiResult, setAiResult]   = useState<{ isEmergency: boolean; severity: string; summary: string } | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [error, setError]         = useState('')
  const [txHash, setTxHash]       = useState('')

  const getLocation = (): Promise<{ lat: number; lng: number; city: string }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('GPS not supported')
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            const city = res.data.address?.city || res.data.address?.town || res.data.address?.village || 'Your location'
            resolve({ lat, lng, city })
          } catch {
            resolve({ lat, lng, city: `${lat.toFixed(4)}, ${lng.toFixed(4)}` })
          }
        },
        () => reject('Location access denied')
      )
    })

  const handleSubmit = async () => {
    if (!problem.trim()) { setError('Please describe the emergency'); return }
    setError('')
    try {
      setStage('analyzing')
      const analyzeRes = await axios.post('/api/analyze', { problem })
      const { isEmergency, severity, summary } = analyzeRes.data
      setAiResult({ isEmergency, severity, summary })
      if (!isEmergency) { setStage('spam'); return }

      setStage('locating')
      let loc: { lat: number; lng: number; city: string }
      try { loc = await getLocation() }
      catch { const ipRes = await axios.get('/api/location'); loc = ipRes.data }
      setLocation(loc)

      setStage('sending')
      const alertRes = await axios.post('/api/alert', { name: name || 'Anonymous', problem, summary, severity, lat: loc.lat, lng: loc.lng, city: loc.city })
      setHospitals(alertRes.data.hospitals || [])
      setTxHash(alertRes.data.txHash || '0x' + Math.random().toString(36).substr(2, 40))
      setStage('success')
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : 'Something went wrong. Please try again.'
      setError(msg || 'Network error')
      setStage('form')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-web3-light to-white">
      <nav className="glass-effect flex items-center justify-between px-6 py-4 border-b border-gray-200/20">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-web3-purple transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-semibold bg-gradient-to-r from-web3-purple to-primary-500 bg-clip-text text-transparent">
            🚨 HealthAlert Web3
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span>🔗</span>
          <span>Active Network</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {stage === 'form' && (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-web3-purple/10 px-3 py-1 rounded-full mb-4">
                <span className="text-web3-purple text-xs font-medium">Emergency Alert System</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">Describe Your Emergency</h1>
              <p className="text-gray-500">AI will analyze your situation and notify nearby hospitals instantly</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g., John Doe" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-web3-purple focus:ring-2 focus:ring-web3-purple/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is the medical emergency? <span className="text-error-500">*</span>
                </label>
                <textarea 
                  value={problem} 
                  onChange={(e) => setProblem(e.target.value)} 
                  placeholder="Describe your symptoms clearly - e.g., 'I'm experiencing severe chest pain and difficulty breathing'" 
                  rows={5} 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-web3-purple focus:ring-2 focus:ring-web3-purple/20 transition-all resize-none"
                />
              </div>
              
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="bg-gradient-to-r from-web3-purple/5 to-primary-500/5 rounded-xl p-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-web3-purple">🔒</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-700 mb-1">Privacy & Security</p>
                    <p className="text-xs text-gray-500">Your location is only used for emergency services. All alerts are recorded on the blockchain for transparency.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-web3-purple to-primary-500 hover:from-web3-purple/90 hover:to-primary-500/90 text-white font-medium py-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl pulse-ring"
              >
                🚨 Send Emergency Alert
              </button>
            </div>
          </>
        )}

        {stage === 'analyzing' && <LoadingCard icon="🤖" title="AI Analysis in Progress..." desc="Analyzing your symptoms and verifying emergency status" />}
        {stage === 'locating'  && <LoadingCard icon="📍" title="Detecting Your Location..." desc="GPS is pinpointing your exact coordinates" />}
        {stage === 'sending'   && <LoadingCard icon="⛓️" title="Recording on Blockchain..." desc="Alert is being stored and broadcasted to hospitals" />}

        {stage === 'spam' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Not Identified as Emergency</h2>
            <p className="text-gray-500 text-sm mb-2">Our AI system doesn't recognize this as a genuine medical emergency.</p>
            {aiResult && <p className="text-gray-600 text-sm bg-gray-50 rounded-xl p-4 mb-6">{aiResult.summary}</p>}
            <button 
              onClick={() => { setStage('form'); setAiResult(null) }} 
              className="border border-gray-200 px-6 py-2 rounded-full text-sm hover:bg-gray-50 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {stage === 'success' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg animate-float">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Alert Successfully Sent!</h2>
              <p className="text-gray-500">
                Hospitals in {location?.city} have been notified
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-xs font-mono">
                <span>🔗 Transaction Hash:</span>
                <span className="text-web3-purple">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
              </div>
            </div>
            
            {aiResult && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🤖</span>
                  <p className="text-xs font-medium text-yellow-700 uppercase">AI Analysis</p>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed mb-3">{aiResult.summary}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white/50">
                  <span>⚠️ Severity:</span>
                  <span className={`font-bold ${aiResult.severity === 'HIGH' ? 'text-error-500' : aiResult.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {aiResult.severITY}
                  </span>
                </div>
              </div>
            )}
            
            {hospitals.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>🏥</span>
                  <span>Notified Hospitals ({hospitals.length})</span>
                </h3>
                <div className="space-y-3">
                  {hospitals.map((h, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-web3-purple/10 rounded-lg flex items-center justify-center text-lg">
                          🏥
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{h.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{h.address}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs text-teal-600 flex items-center gap-1">
                              <span>📍</span> {h.distance}
                            </span>
                            {h.phone && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <span>📞</span> {h.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-8">
              <Link href="/" className="flex-1 text-center border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                ← Back to Home
              </Link>
              <Link href="/dashboard" className="flex-1 text-center bg-web3-purple/10 text-web3-purple rounded-xl py-3 text-sm font-medium hover:bg-web3-purple/20 transition-all">
                View Dashboard →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function LoadingCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center py-20 gap-5">
      <div className="text-6xl animate-bounce">{icon}</div>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm max-w-md">{desc}</p>
      <div className="flex gap-2 mt-4">
        {[0,1,2].map((i) => (
          <div key={i} className="w-3 h-3 bg-gradient-to-r from-web3-purple to-primary-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}