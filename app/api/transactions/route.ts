import { NextResponse } from 'next/server';
import { addFundTransactions } from '@/app/data/dbQueries';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await addFundTransactions(body);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error saving transaction:", error);
        return NextResponse.json({ msg: "Error saving transaction" }, { status: 500 });
    }
}
