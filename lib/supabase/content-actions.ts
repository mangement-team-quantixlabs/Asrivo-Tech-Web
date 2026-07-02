'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/supabase/admin-actions'
import { revalidatePath } from 'next/cache'

// Helper function to verify permissions
async function checkAuthAndPermission(requiredRole?: 'high') {
  const authResult = await getCurrentAdmin()
  if (!authResult.success || !authResult.user) {
    throw new Error('Unauthorized: Authentication required')
  }
  
  if (requiredRole === 'high' && authResult.user.role !== 'high') {
    throw new Error('Unauthorized: High clearance level required')
  }
  
  return authResult.user
}

// ==========================================
// PROJECTS CRUD ACTIONS
// ==========================================

export async function createProject(data: {
  title: string
  slug: string
  description: string
  long_description?: string
  category: string
  client_name?: string
  technologies?: string[]
  image_url?: string
  featured_image_url?: string
  live_url?: string
  github_url?: string
  status?: string
  featured?: boolean
  display_order?: number
}) {
  try {
    await checkAuthAndPermission('high') // Only high admins can create
    const supabase = await createClient()

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        ...data,
        technologies: data.technologies || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/projects')
    return { success: true, data: newProject }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProject(id: string | number, data: {
  title?: string
  slug?: string
  description?: string
  long_description?: string
  category?: string
  client_name?: string
  technologies?: string[]
  image_url?: string
  featured_image_url?: string
  live_url?: string
  github_url?: string
  status?: string
  featured?: boolean
  display_order?: number
}) {
  try {
    await checkAuthAndPermission() // Both high and low can update
    const supabase = await createClient()

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/projects')
    return { success: true, data: updatedProject }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProject(id: string | number) {
  try {
    await checkAuthAndPermission('high') // Only high admins can delete
    const supabase = await createClient()

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/projects')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ==========================================
// SERVICES CRUD ACTIONS
// ==========================================

export async function createService(data: {
  title: string
  slug: string
  description: string
  full_description?: string
  icon?: string
  features?: string[]
  technologies?: string[]
  display_order?: number
  active?: boolean
}) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { data: newService, error } = await supabase
      .from('services')
      .insert({
        ...data,
        features: data.features || [],
        technologies: data.technologies || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
    return { success: true, data: newService }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateService(id: string | number, data: {
  title?: string
  slug?: string
  description?: string
  full_description?: string
  icon?: string
  features?: string[]
  technologies?: string[]
  display_order?: number
  active?: boolean
}) {
  try {
    await checkAuthAndPermission()
    const supabase = await createClient()

    const { data: updatedService, error } = await supabase
      .from('services')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
    return { success: true, data: updatedService }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteService(id: string | number) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/services')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ==========================================
// TEAM MEMBERS CRUD ACTIONS
// ==========================================

export async function createTeamMember(data: {
  name: string
  position: string
  email?: string
  bio?: string
  image_url?: string
  expertise?: string[]
  social_links?: { linkedin?: string; github?: string; twitter?: string }
  display_order?: number
  active?: boolean
}) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { data: newMember, error } = await supabase
      .from('team_members')
      .insert({
        ...data,
        expertise: data.expertise || [],
        social_links: data.social_links || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/team')
    return { success: true, data: newMember }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTeamMember(id: string | number, data: {
  name?: string
  position?: string
  email?: string
  bio?: string
  image_url?: string
  expertise?: string[]
  social_links?: { linkedin?: string; github?: string; twitter?: string }
  display_order?: number
  active?: boolean
}) {
  try {
    await checkAuthAndPermission()
    const supabase = await createClient()

    const { data: updatedMember, error } = await supabase
      .from('team_members')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/team')
    return { success: true, data: updatedMember }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTeamMember(id: string | number) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/team')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ==========================================
// JOB POSTINGS CRUD ACTIONS
// ==========================================

export async function createJobPosting(data: {
  title: string
  slug: string
  description: string
  requirements?: string[]
  responsibilities?: string[]
  salary_range?: string
  location?: string
  employment_type?: string
  experience_level?: string
  active?: boolean
}) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { data: newJob, error } = await supabase
      .from('job_postings')
      .insert({
        ...data,
        requirements: data.requirements || [],
        responsibilities: data.responsibilities || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/jobs')
    return { success: true, data: newJob }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateJobPosting(id: string | number, data: {
  title?: string
  slug?: string
  description?: string
  requirements?: string[]
  responsibilities?: string[]
  salary_range?: string
  location?: string
  employment_type?: string
  experience_level?: string
  active?: boolean
}) {
  try {
    await checkAuthAndPermission()
    const supabase = await createClient()

    const { data: updatedJob, error } = await supabase
      .from('job_postings')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/admin/jobs')
    return { success: true, data: updatedJob }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteJobPosting(id: string | number) {
  try {
    await checkAuthAndPermission('high')
    const supabase = await createClient()

    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/jobs')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
