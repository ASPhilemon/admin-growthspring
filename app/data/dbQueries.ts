import { unstable_noStore as noStore } from 'next/cache';
import Deposit from './models/DepositModel'
import dbConnect from './dbConnect';

export type searchFilterDeposit = {
    year? : number | string,
    month? : number | string,
    member? : string,
    page: number,
    sortBy: 'deposit_date' | 'deposit_amount',
    order: number,
    perPage: number
}

export async function getTotalDepositsCount( {year, month, member} : searchFilterDeposit) {
    noStore()
    await dbConnect() // Connect to the database if not already connected

    const pipeline = [];

    // Match stage to filter documents based on all provided criteria
    const matchStage: any = {};
    
    const matchCriteria = [];
    if (year !== 'all') matchCriteria.push({ $expr: { $eq: [{ $year: "$deposit_date" }, year] } });
    if (month !=='all') matchCriteria.push({ $expr: { $eq: [{ $month: "$deposit_date" }, month] } });
    if (member !== 'all') matchCriteria.push({ depositor_name: member });

    if (matchCriteria.length > 0) matchStage.$and = matchCriteria
    
    pipeline.push({ $match: matchStage });

    // Count stage to calculate the total number of matching deposits
    pipeline.push({ $count: "totalDeposits" });

    const result = await Deposit.aggregate(pipeline);
    return result.length > 0 ? result[0].totalDeposits : 0;
}

export async function getDepositsByPage({year, month, member, page, order, perPage, sortBy} : searchFilterDeposit) {
    noStore()
    await dbConnect() // Connect to the database if not already connected

    const pipeline : any = [];
    // Match stage to filter documents based on all provided criteria
    const matchStage: any = {};
    const matchCriteria = [];
    
    if (year !== 'all') matchCriteria.push({ $expr: { $eq: [{ $year: "$deposit_date" }, year] } });
    if (month !=='all') matchCriteria.push({ $expr: { $eq: [{ $month: "$deposit_date" }, month] } });
    if (member !== 'all') matchCriteria.push({ depositor_name: member });

    if (matchCriteria.length > 0) matchStage.$and = matchCriteria
    pipeline.push({ $match: matchStage });

    // Sort stage to sort the matching deposits by date
    pipeline.push({ $sort: { [sortBy]: order } });

    // Skip and Limit stages for pagination
    pipeline.push({ $skip: (page - 1) * perPage });
    pipeline.push({ $limit: perPage });

    const deposits = await Deposit.aggregate(pipeline);
    return deposits;
}