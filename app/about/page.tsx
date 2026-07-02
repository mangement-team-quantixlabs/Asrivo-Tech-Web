import React from 'react'
import { CheckCircle2, Shield, Users, Target, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="relative isolate overflow-hidden bg-black text-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">About Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Our Mission & Culture</p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            We are a group of dedicated software engineers, designers, and consultants building intelligent software products. We help companies design, build, and deploy custom tools at scale.
          </p>
        </div>

        {/* Core Values grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col bg-zinc-900/40 border border-zinc-805 p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-white">
                <Target className="h-6 w-6 text-[#4fd1ed]" aria-hidden="true" />
                Customer First
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto text-sm">
                  We align our deliverables closely with our client needs, offering continuous deployment metrics and rapid feedback loop operations.
                </p>
              </dd>
            </div>
            
            <div className="flex flex-col bg-zinc-900/40 border border-zinc-805 p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-white">
                <Shield className="h-6 w-6 text-[#4fd1ed]" aria-hidden="true" />
                Security & Reliability
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto text-sm">
                  Security isn't a feature; it's our foundation. Every line of code is reviewed, tested, and optimized for maximum threat resistance.
                </p>
              </dd>
            </div>
            
            <div className="flex flex-col bg-zinc-900/40 border border-zinc-805 p-8 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-white">
                <Rocket className="h-6 w-6 text-[#4fd1ed]" aria-hidden="true" />
                Continuous Innovation
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto text-sm">
                  We stay at the forefront of digital engineering, constantly adapting, utilizing AI-driven tools, and implementing modern architectures.
                </p>
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </div>
  )
}
