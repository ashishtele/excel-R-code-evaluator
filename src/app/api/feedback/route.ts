import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { name, feedback: feedbackText } = await request.json();
    
    // Validate required fields
    if (!name || !feedbackText) {
      return NextResponse.json({ 
        error: "Name and feedback are required", 
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }
    
    // Trim and validate non-empty
    const trimmedName = name.trim();
    const trimmedFeedback = feedbackText.trim();
    
    if (!trimmedName || !trimmedFeedback) {
      return NextResponse.json({ 
        error: "Name and feedback cannot be empty", 
        code: "EMPTY_FIELDS" 
      }, { status: 400 });
    }
    
    const newFeedback = await db.insert(feedback).values({
      name: trimmedName,
      feedback: trimmedFeedback,
      createdAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newFeedback[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}