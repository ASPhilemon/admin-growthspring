import { NextResponse } from 'next/server';
import { addCashTransfers } from '@/app/data/dbQueries';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await addCashTransfers(body);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error saving transfer:", error);
        return NextResponse.json({ msg: "Error saving transfer" }, { status: 500 });
    }
}
