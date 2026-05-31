import { NextResponse } from 'next/server'
import { dbService } from '@/utils/db'

export async function GET() {
  try {
    const events = await dbService.getEvents()
    
    // Fetch details for each event (activations & gifts)
    const detailedEvents = await Promise.all(
      events.map(async (e) => {
        const details = await dbService.getEventWithDetails(e.id)
        return details
      })
    )

    return NextResponse.json({
      success: true,
      events: detailedEvents
    }, { status: 200 })

  } catch (error: any) {
    console.error('API GET events error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao buscar eventos' 
    }, { status: 500 })
  }
}
