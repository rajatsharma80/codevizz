import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);

    // Create module
    const savedModule = await prisma.module.create({
      data: {
        project_id: BigInt(body.project_id),
        title: body.title,
        user_prompt: body.user_prompt,
        system_prompt: body.system_prompt, 
        category_id: BigInt(body.category_id),
        sub_category_id: BigInt(body.sub_category_id),
        
        created_by: body.created_by,
        created_ts: new Date(),
        modified_ts: new Date()
      }
    });

    // Convert BigInt fields to strings before returning
    const savedModuleJson = JSON.parse(JSON.stringify(savedModule, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ data: savedModuleJson }, { status: 201 });

  } catch (error) {
    console.error('Error saving module:', error);
    return NextResponse.json({ 
      error: 'Failed to save module'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
