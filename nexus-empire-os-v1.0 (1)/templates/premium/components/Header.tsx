'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-white">{domain_name}</div>

          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
            <a href="#about" className="text-slate-300 hover:text-white transition">About</a>
          </div>

          <div className="hidden md:flex space-x-4">
            <button className="text-slate-300 hover:text-white">Sign In</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
              Get Started
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#features" className="block text-slate-300 py-2">Features</a>
            <a href="#pricing" className="block text-slate-300 py-2">Pricing</a>
            <button className="w-full bg-blue-600 text-white py-2 rounded-full mt-4">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
