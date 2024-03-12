import Deposit from './models/DepositModel'
import dbConnect from './dbConnect';


// i) Return the total number of deposits that match specified criteria
export async function getTotalDepositsCount( {year, month, depositor_name} : any) {
    await dbConnect() // Connect to the database if not already connected

    const pipeline = [];

    // Match stage to filter documents based on all provided criteria
    const matchStage: any = {};
    if (year || month || depositor_name) {
        const matchCriteria = [];
        if (year) matchCriteria.push({ $expr: { $eq: [{ $year: "$deposit_date" }, year] } });
        if (month) matchCriteria.push({ $expr: { $eq: [{ $month: "$deposit_date" }, month] } });
        if (depositor_name) matchCriteria.push({ depositor_name: depositor_name });
        matchStage.$and = matchCriteria;
    }
    pipeline.push({ $match: matchStage });

    // Count stage to calculate the total number of matching deposits
    pipeline.push({ $count: "totalDeposits" });

    const result = await Deposit.aggregate(pipeline);
    return result.length > 0 ? result[0].totalDeposits : 0;
}

// ii) Given a page number, return a maximum of 15 deposits that match specified criteria in i) sorted by date
export async function getDepositsByPage({year, month, depositor_name, page} : any) {

    await dbConnect() // Connect to the database if not already connected

    const pipeline : any = [];
    // Match stage to filter documents based on all provided criteria
    const matchStage: any = {};
    if (year || month || depositor_name) {
        const matchCriteria = [];
        if (year) matchCriteria.push({ $expr: { $eq: [{ $year: "$deposit_date" }, year] } });
        if (month) matchCriteria.push({ $expr: { $eq: [{ $month: "$deposit_date" }, month] } });
        if (depositor_name) matchCriteria.push({ depositor_name: depositor_name });
        matchStage.$and = matchCriteria;
    }
    pipeline.push({ $match: matchStage });

    // Sort stage to sort the matching deposits by date
    pipeline.push({ $sort: { deposit_date: -1 } });

    // Skip and Limit stages for pagination
    pipeline.push({ $skip: (page - 1) * 50 });
    pipeline.push({ $limit: 50 });

    const deposits = await Deposit.aggregate(pipeline);
    return deposits;
}