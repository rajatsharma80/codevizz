import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch diagram types from the database
    const diagramTypes = await prisma.category.findMany({
      where: {
        created_by: { not: undefined } // Exclude NULL values
      }
    });

    console.log('Fetched categories:', diagramTypes);

 
    if (!diagramTypes || diagramTypes.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 }); 
    }

    
    const formattedDiagramTypes = diagramTypes.map(diagram => ({
      ...diagram,
      id: Number(diagram.id), 
    }));

    return NextResponse.json({ data: formattedDiagramTypes }, { status: 200 });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagram types' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
