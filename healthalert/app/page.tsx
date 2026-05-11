'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-web3-light to-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="text-7xl mb-4 animate-bounce">🚨</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-web3-purple to-primary-500 bg-clip-text text-transparent mb-4">
            HealthAlert Web3
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Decentralized Emergency Response System
          </p>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/alert" 
            className="bg-gradient-to-r from-web3-purple to-primary-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all inline-block"
          >
            🚨 Send Emergency Alert
          </Link>
          <Link 
            href="/dashboard" 
            className="border-2 border-web3-purple text-web3-purple px-8 py-3 rounded-full font-medium hover:bg-web3-purple/10 transition-all inline-block"
          >
            📊 Hospital Dashboard
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">Real-time emergency detection using Claude AI</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="font-semibold mb-2">Blockchain Secure</h3>
            <p className="text-sm text-gray-600">All alerts recorded immutably on-chain</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
            <div className="text-3xl mb-3">🏥</div>
            <h3 className="font-semibold mb-2">Hospital Network</h3>
            <p className="text-sm text-gray-600">Instant notification to nearby hospitals</p>
          </div>
        </div>
      </div>
    </main>
  )
}