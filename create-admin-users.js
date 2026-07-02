const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manually parse .env.local to avoid needing the 'dotenv' module dependency
try {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const val = parts.slice(1).join('=').trim()
          process.env[key] = val
        }
      }
    })
  }
} catch (e) {
  console.warn('Warning: Could not read .env.local file.', e.message)
}

async function createAdminUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const usersToCreate = [
    { email: 'pradeepselvi126@gmail.com', role: 'high', password: 'PRk@123456' },
    { email: 'idnumberselect@gmail.com', role: 'low', password: 'IDn@123456' }
  ]

  console.log('Starting admin user creation...')

  for (const item of usersToCreate) {
    console.log(`\nProcessing user: ${item.email} (${item.role} role)`)

    // 1. Try to create the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: item.email,
      password: item.password,
      email_confirm: true
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        console.log(`User ${item.email} already exists. Fetching user profile to update password and profile...`)

        // Find existing user
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) {
          console.error(`Failed to list users: ${listError.message}`)
          continue
        }

        const existingUser = listData.users.find(u => u.email === item.email)
        if (existingUser) {
          // Update existing user password
          const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: item.password
          })
          if (updateError) {
            console.error(`Failed to update password for ${item.email}: ${updateError.message}`)
          } else {
            console.log(`Password updated successfully for ${item.email}`)
          }
          // Link profile
          await upsertProfile(supabase, existingUser.id, item.email, item.role)
        }
      } else {
        console.error(`Failed to create auth user: ${authError.message}`)
      }
    } else if (authData && authData.user) {
      console.log(`Successfully created auth user: ${authData.user.id}`)
      await upsertProfile(supabase, authData.user.id, item.email, item.role)
    }
  }
}

async function upsertProfile(supabase, userId, email, role) {
  const { data, error } = await supabase
    .from('admin_profiles')
    .upsert({
      id: userId,
      email: email,
      role: role
    })
    .select()

  if (error) {
    console.error(`Failed to insert/update admin profile: ${error.message}`)
  } else {
    console.log(`✅ Admin profile upserted successfully: ${email} -> ${role}`)
  }
}

createAdminUsers()
  .then(() => console.log('\nUser seeding complete!'))
  .catch(err => console.error(err))
