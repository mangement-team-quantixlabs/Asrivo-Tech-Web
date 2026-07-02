import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/supabase/admin-actions'
import { Plus, Pencil, Trash2, Star, User } from 'lucide-react'
import Link from 'next/link'

export default async function AdminTeamPage() {
  const supabase = await createClient()
  const adminResult = await getCurrentAdmin()
  const isHigh = adminResult.user?.role === 'high'

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Members</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your team profiles.</p>
        </div>
        {isHigh && (
          <Link href="/admin/team/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" />
            Add Member
          </Link>
        )}
      </div>

      {!isHigh && (
        <div className="border border-blue-900/40 bg-blue-950/30 rounded-xl px-5 py-4 text-sm text-blue-300 flex items-center gap-3">
          <span className="text-lg">ℹ️</span>
          You have <strong>Editor</strong> access. You can edit member profiles but cannot create or delete them.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error && <p className="text-red-400 text-sm col-span-3">Error: {error.message}</p>}
        {!error && (!members || members.length === 0) && (
          <div className="col-span-3 p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <User className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="font-semibold">No team members yet.</p>
          </div>
        )}
        {members?.map((member) => (
          <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-700" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-slate-100 truncate">{member.name}</p>
                <p className="text-xs text-indigo-400 font-medium">{member.position}</p>
                <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${member.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                  {member.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {member.bio && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{member.bio}</p>
            )}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
              <Link href={`/admin/team/${member.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Link>
              {isHigh && (
                <Link href={`/admin/team/${member.id}/delete`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
