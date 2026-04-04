import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const ALLOWED_ACTIONS = ['start', 'stop', 'restart'] as const
type Action = typeof ALLOWED_ACTIONS[number]

export async function POST(request: NextRequest) {
  const { containerName, action } = await request.json()

  if (!ALLOWED_ACTIONS.includes(action as Action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  // Sanitize — only allow alphanumeric, hyphens, underscores
  if (!containerName || !/^[a-zA-Z0-9_-]+$/.test(containerName)) {
    return NextResponse.json({ error: 'Invalid container name' }, { status: 400 })
  }

  try {
    const { stdout, stderr } = await execAsync(`docker ${action} ${containerName}`)
    return NextResponse.json({ success: true, output: stdout || stderr })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}