import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Call the selfbot API server
    const response = await fetch(`http://localhost:3001/api/search-members?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from selfbot API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search users error:', error);
    return NextResponse.json(
      { results: [], error: 'Failed to search users' },
      { status: 500 }
    );
  }
}



