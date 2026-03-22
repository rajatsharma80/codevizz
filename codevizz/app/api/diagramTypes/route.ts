import { NextResponse } from 'next/server';

// Static diagram types — no database needed.
// To restore DB-backed types, see the commented version below.
const DIAGRAM_TYPES = [
  { id: 1, title: 'Flowchart' },
  { id: 2, title: 'Sequence Diagram' },
  { id: 3, title: 'HTML code' },
  { id: 4, title: 'Java code' },
  { id: 5, title: 'JUnit' },
];

export async function GET() {
  return NextResponse.json({ data: DIAGRAM_TYPES }, { status: 200 });
}

/* DB-BACKED VERSION — restore when DATABASE_URL is configured
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    const diagramTypes = await prisma.category.findMany({
      where: {
        created_by: { not: undefined }
      }
    });

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
*/
