import { unstable_noStore as noStore } from 'next/cache';
import Deposit from './models/DepositModel'
import dbConnect from './dbConnect';
import User from './models/UserModel';
import CashLocation from './models/CashLocationModel';

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

export async function createDeposit(deposit: any){
    noStore()
    await dbConnect() // Connect to the database if not already connected
    const user = await User.findOne({fullName: deposit.depositor_name})
    if (!user) throw Error('User does not exist')
    await Deposit.create({...deposit, balance_before: user.investmentAmount})
    user.investmentAmount = user.investmentAmount + deposit.deposit_amount
    await user.save()

    //update cash locations

    const [standardCharteredDoc, unitTrustDoc, adminAndrewDoc, adminRogersDoc] : any = await Promise.all([
        CashLocation.findOne({name: "Standard Chartered"}),
        CashLocation.findOne({name: "Unit Trust"}),
        CashLocation.findOne({name: "Admin Andrew"}),
        CashLocation.findOne({name: "Admin Rogers"})
    ])

    standardCharteredDoc.amount += deposit.cashLocations.standardChartered
    unitTrustDoc.amount += deposit.cashLocations.unitTrust
    adminAndrewDoc.amount += deposit.cashLocations.adminAndrew
    adminRogersDoc.amount += deposit.cashLocations.adminRogers

    await Promise.all([
        standardCharteredDoc.save(),
        unitTrustDoc.save(),
        adminAndrewDoc.save(),
        adminRogersDoc.save()
    ])

}

export async function  findDepositById(id:string){
    await dbConnect() //connect to db if not already connected

    try{
        const deposit = await Deposit.findById(id)
        return deposit
    } catch(err: any){
        return null
    }   
}

export async function updateDeposit (deposit_id : any, newDeposit:any){
    await dbConnect() //connect to db if not already connected

    let deposit = await Deposit.findById(deposit_id)    
    
    let user = await User.findOne({fullName: deposit.depositor_name})
    if (!user) throw Error('User does not exist')
    

     //update cash locations
     const [standardCharteredDoc, unitTrustDoc, adminAndrewDoc, adminRogersDoc] : any = await Promise.all([
        CashLocation.findOne({name: "Standard Chartered"}),
        CashLocation.findOne({name: "Unit Trust"}),
        CashLocation.findOne({name: "Admin Andrew"}),
        CashLocation.findOne({name: "Admin Rogers"})
    ])


    if (deposit.cashLocations){
        //update cash locations
        standardCharteredDoc.amount = standardCharteredDoc.amount - deposit.cashLocations.standardChartered  + newDeposit.cashLocations.standardChartered
        unitTrustDoc.amount = unitTrustDoc.amount - deposit.cashLocations.unitTrust + newDeposit.cashLocations.unitTrust
        adminAndrewDoc.amount = adminAndrewDoc.amount - deposit.cashLocations.adminAndrew + newDeposit.cashLocations.adminAndrew
        adminRogersDoc.amount = adminRogersDoc.amount - deposit.cashLocations.adminRogers + newDeposit.cashLocations.adminRogers
        //update deposit
        deposit.cashLocations.standardChartered = newDeposit.cashLocations.standardChartered
        deposit.cashLocations.unitTrust = newDeposit.cashLocations.unitTrust
        deposit.cashLocations.adminAndrew = newDeposit.cashLocations.adminAndrew
        deposit.cashLocations.adminRogers = newDeposit.cashLocations.adminRogers
    }

    user.investmentAmount =  user.investmentAmount - deposit.deposit_amount + newDeposit.deposit_amount
    
    deposit.depositor_name = newDeposit.depositor_name
    deposit.deposit_date = newDeposit.deposit_date
    deposit.deposit_amount = newDeposit.deposit_amount

    user.investmentAmount =  user.investmentAmount - deposit.deposit_amount + newDeposit.deposit_amount
    

    await Promise.all([
        standardCharteredDoc.save(),
        unitTrustDoc.save(),
        adminAndrewDoc.save(),
        adminRogersDoc.save(),
        deposit.save(),
        user.save()
    ])
}