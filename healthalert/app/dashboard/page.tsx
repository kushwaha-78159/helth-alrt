'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Alert {
  id: string; name: string; problem: string; summary: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'; city: string
  lat: number; lng: number; timestamp: string
  status: 'pending' | 'accepted' | 'resolved'
  txHash?: string
}

export default function DashboardPage() {
  const [alerts, setAlerts]   = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all' | 'pending' | 'accepted'>('all')

  const fetchAlerts = async () => {
    try { const res = await axios.get('/api/alert'); setAlerts(res.data.alerts || []) }
    catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchAlerts() }, [])
  useEffect(() => { const t = setInterval(fetchAlerts, 10000); return () => clearInterval(t) }, [])

  const updateStatus = async (id: string, status: 'accepted' | 'resolved') => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    await axios.patch('/api/alert', { id, status })
  }

  const filtered = alerts.filter((a) => filter === 'all' ? true : a.status === filter)
  const counts = { all: alerts.length, pending: alerts.filter((a) => a.status === 'pending').length, accepted: alerts.filter((a) => a.status === 'accepted').length }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl hover:scale-110 transition-transform">🚨</Link>
            <div>
              <p className="font-bold text-gray-800">HealthAlert Web3 Dashboard</p>
              <p className="text-xs text-gray-400 font-mono">Hospital Emergency Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {counts.pending > 0 && (
              <div className="flex items-center gap-2 bg-error-500 text-white px-3 py-1.5 rounded-full text-xs font-medium animate-pulse">
                <span>🔴</span>
                <span>{counts.pending} New Emergency{alerts.length !== 1 && 'ies'}</span>
              </div>
            )}
            <button 
              onClick={fetchAlerts} 
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-full hover:bg-white/50 hover:border-web3-purple transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Alerts" value={counts.all} color="web3-purple" icon="📊" />
          <StatsCard title="Pending Response" value={counts.pending} color="error" icon="🆘" />
          <StatsCard title="In Progress" value={counts.accepted} color="accent" icon="⚙️" />
          <StatsCard title="Resolved" value={alerts.filter(a => a.status === 'resolved').length} color="green" icon="✅" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['all', 'pending', 'accepted'] as const).map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-5 py-2 text-sm font-medium transition-all relative ${
                filter === f 
                  ? 'text-web3-purple border-b-2 border-web3-purple' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'All Alerts' : f === 'pending' ? 'Pending 🆘' : 'In Progress ⚙️'}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-2 text-gray-400">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading emergency alerts...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-400 text-sm">No pending alerts at the moment</p>
            <p className="text-xs text-gray-300 mt-2">System monitoring active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function StatsCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  const colorMap = {
    'web3-purple': 'from-web3-purple/10 to-web3-purple/5 border-web3-purple/20',
    'error': 'from-error-500/10 to-error-500/5 border-error-500/20',
    'accent': 'from-accent-500/10 to-accent-500/5 border-accent-500/20',
    'green': 'from-green-500/10 to-green-500/5 border-green-500/20',
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} rounded-2xl p-5 border`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function AlertCard({ alert, onUpdate }: { alert: Alert; onUpdate: (id: string, status: 'accepted' | 'resolved') => void }) {
  const severityStyle = { 
    HIGH: 'bg-error-50 border-error-200 text-error-700',
    MEDIUM: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    LOW: 'bg-green-50 border-green-200 text-green-700'
  }[alert.severity]
  
  const statusBadge = { 
    pending: { text: 'Pending Response', color: 'bg-error-100 text-error-700', icon: '🔴' },
    accepted: { text: 'In Progress', color: 'bg-accent-100 text-accent-700', icon: '🟡' },
    resolved: { text: 'Resolved', color: 'bg-green-100 text-green-700', icon: '✅' }
  }[alert.status]
  
  const mapsUrl = `https://www.google.com/maps?q=${alert.lat},${alert.lng}`

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border-l-4 ${
      alert.status === 'pending' ? 'border-error-500' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h3 className="font-bold text-gray-800">{alert.name || 'Anonymous Patient'}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${severityStyle}`}>
              {alert.severity} Severity
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${statusBadge.color}`}>
              <span>{statusBadge.icon}</span>
              <span>{statusBadge.text}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>📍 {alert.city}</span>
            <span>🕐 {new Date(alert.timestamp).toLocaleString()}</span>
            {alert.txHash && <span className="font-mono">🔗 {alert.txHash.slice(0, 8)}...{alert.txHash.slice(-6)}</span>}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-2">
          <span>📝</span> Patient Message
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{alert.problem}</p>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-yellow-700 mb-2 flex items-center gap-2">
          <span>🤖</span> AI Analysis
        </p>
        <p className="text-sm text-yellow-800 leading-relaxed">{alert.summary}</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="text-xs border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 hover:border-web3-purple transition-all flex items-center gap-2"
        >
          <span>📍</span> View Location
        </a>
        {alert.status === 'pending' && (
          <button 
            onClick={() => onUpdate(alert.id, 'accepted')} 
            className="text-xs bg-gradient-to-r from-web3-purple to-primary-500 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>✅</span> Accept & Respond
          </button>
        )}
        {alert.status === 'accepted' && (
          <button 
            onClick={() => onUpdate(alert.id, 'resolved')} 
            className="text-xs bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <span>✔️</span> Mark as Resolved
          </button>
        )}
      </div>
    </div>
  )
}