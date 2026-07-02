import React from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Star, Sparkles, Code, Cpu, Globe, Cloud, Briefcase, Zap, Shield, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch Services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
    .limit(6)

  // Fetch Projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'completed')
    .order('display_order', { ascending: true })
    .limit(3)

  // Fetch Testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('verified', true)
    .order('display_order', { ascending: true })
    .limit(3)

  return (
    <div className="relative isolate overflow-hidden bg-black text-white">
      {/* Background Decorative Glows */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80eeff] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-5xl py-24 sm:py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4fd1ed]/30 bg-[#4fd1ed]/10 text-[#4fd1ed] text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Engineering Digital Innovation
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            We build scalable solutions for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4fd1ed] to-[#2b6cb0]">modern enterprises</span>
          </h1>
          
          <p className="mt-8 text-lg leading-8 text-zinc-400 max-w-3xl mx-auto">
            Asrivo Tech turns complex ideas into intelligent solutions. We deliver custom software development, modern web & mobile apps, cloud computing, and AI-driven systems tailored for your growth.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-[#2b6cb0] hover:bg-[#4fd1ed] text-white shadow-xl shadow-blue-500/10 px-8 py-6 rounded-xl text-md font-semibold transition-all group" asChild>
              <Link href="/contact" className="gap-2">
                Get Started 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Link href="/services" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors">
              Our Services <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics / Features Grid */}
      <section className="border-y border-white/10 bg-zinc-950/50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
              <Zap className="w-8 h-8 text-[#4fd1ed] shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-white">Ultra-Performance</h3>
                <p className="text-zinc-400 text-sm mt-2">Engineered for lightweight execution, speed, and real-time user experiences.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
              <Shield className="w-8 h-8 text-[#4fd1ed] shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-white">Enterprise Security</h3>
                <p className="text-zinc-400 text-sm mt-2">Enterprise-grade cloud architectures backed by RLS and secure API protocols.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
              <Code className="w-8 h-8 text-[#4fd1ed] shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-white">Full-Stack Experts</h3>
                <p className="text-zinc-400 text-sm mt-2">Cross-functional team specializing in Next.js, React Native, Python, and cloud services.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">Services</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">What we specialize in</p>
            <p className="mt-4 text-zinc-400 text-sm">Tailored IT solutions crafted to address complex operational and platform engineering tasks.</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:border-[#4fd1ed]/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl w-fit text-[#4fd1ed] mb-4 group-hover:scale-110 transition-transform">
                      <Code className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-white">{service.title}</h3>
                    <p className="text-zinc-400 text-xs mt-2 line-clamp-3">{service.description}</p>
                    {service.pricing && (
                      <p className="text-[#4fd1ed] text-xs font-semibold mt-3">{service.pricing}</p>
                    )}
                  </div>
                  <Link href={`/services#${service.slug}`} className="mt-6 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              // Fallback default services
              ['Software Development', 'Web Applications', 'Mobile Applications', 'Cloud & DevOps', 'AI & Automation', 'IT Consulting'].map((title, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:border-[#4fd1ed]/50 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl w-fit text-[#4fd1ed] mb-4 group-hover:scale-110 transition-transform">
                      <Code className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    <p className="text-zinc-400 text-xs mt-2">Comprehensive lifecycle design, deployment, integration, and platform scaling services.</p>
                  </div>
                  <Link href="/services" className="mt-6 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-24 bg-zinc-950/40 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">Portfolio</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Featured Client Projects</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition-all">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover border-b border-zinc-850" />
                  )}
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">{project.category}</span>
                    <h3 className="font-bold text-lg text-white mt-3">{project.title}</h3>
                    <p className="text-zinc-400 text-xs mt-2 line-clamp-2">{project.description}</p>
                    <Link href="/projects" className="inline-block mt-4 text-xs font-semibold text-white hover:underline">View Project Details →</Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback
              <div className="col-span-3 text-center py-8 text-zinc-500 text-sm">
                No featured projects listed yet. Visually audit our admin panel to add them.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">What our clients say</p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-zinc-300 text-xs italic">"{testimonial.content}"</p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    {testimonial.client_image_url ? (
                      <img src={testimonial.client_image_url} alt={testimonial.client_name} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <User className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-xs">{testimonial.client_name}</p>
                      <p className="text-zinc-550 text-[10px]">{testimonial.client_title}, {testimonial.client_company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Decorative background bottom glow */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3b82f6] to-[#80eeff] opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  )
}
