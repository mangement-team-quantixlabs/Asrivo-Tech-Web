import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { User, Linkedin, Github, Twitter } from 'lucide-react'

export default async function TeamPage() {
  const supabase = await createClient()

  // Fetch active team members
  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="relative isolate overflow-hidden bg-black text-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-[#4fd1ed] uppercase tracking-wider">Our Team</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Meet our engineers and designers</p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            A diverse group of technologists and consultants committed to building intelligent software solutions.
          </p>
        </div>

        {/* Members Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {error && <p className="text-red-400 text-sm">Error: {error.message}</p>}
          
          {!error && (!members || members.length === 0) ? (
            <div className="col-span-3 text-center py-12 text-zinc-550 text-sm bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <User className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
              <p className="font-semibold">No team profiles posted yet.</p>
            </div>
          ) : (
            members?.map((member) => (
              <div key={member.id} className="bg-zinc-900/30 border border-zinc-850 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all group">
                <div className="space-y-4">
                  {/* Photo */}
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-24 h-24 rounded-full object-cover border border-zinc-800 transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <User className="w-8 h-8 text-zinc-500" />
                    </div>
                  )}
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{member.position}</p>
                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{member.bio || '—'}</p>
                  </div>
                </div>

                {/* Social Links & Skills */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-4">
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill: string, index: number) => (
                        <span key={index} className="text-[9px] bg-zinc-950 border border-zinc-800 text-zinc-450 px-2 py-0.5 rounded-md font-mono">{skill}</span>
                      ))}
                    </div>
                  )}

                  {member.social_links && typeof member.social_links === 'object' && (
                    <div className="flex gap-3 text-zinc-400">
                      {member.social_links.linkedin && (
                        <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.social_links.github && (
                        <a href={member.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {member.social_links.twitter && (
                        <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
