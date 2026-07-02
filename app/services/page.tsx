import React from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ServicesPage() {
  const supabase = await createClient()

  // Fetch Services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="relative isolate overflow-hidden bg-black text-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Our Service Offerings</p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            From modern web design to advanced database tuning, we provide the technical expertise to elevate your software products.
          </p>
        </div>

        {/* List of Services */}
        <div className="mx-auto max-w-5xl space-y-16">
          {services && services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                id={service.slug}
                className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 hover:border-[#4fd1ed]/30 transition-all scroll-mt-24"
              >
                {/* Left Column: Title & Description */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit text-[#4fd1ed]">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  <p className="text-zinc-405 text-sm leading-relaxed">{service.full_description || service.description}</p>
                  
                  {service.pricing && (
                    <div className="pt-2">
                      <span className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Estimated Pricing:</span>
                      <p className="text-lg font-bold text-[#4fd1ed] mt-0.5">{service.pricing}</p>
                    </div>
                  )}
                </div>

                {/* Right Column: Key Features & Action */}
                <div className="border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Key Features</h4>
                    {service.features && service.features.length > 0 ? (
                      <ul className="space-y-2.5">
                        {service.features.map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-350">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">No features specified.</p>
                    )}

                    {service.technologies && service.technologies.length > 0 && (
                      <div className="pt-4 space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Technologies</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {service.technologies.map((tech: string, i: number) => (
                            <span key={i} className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-md">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-8">
                    <Button className="w-full bg-[#2b6cb0] hover:bg-[#4fd1ed] text-white transition-all rounded-xl" asChild>
                      <Link href="/contact">
                        Inquire Now <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              No services found. Visit the admin panel to add services.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
