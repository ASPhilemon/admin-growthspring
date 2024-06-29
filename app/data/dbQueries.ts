import { unstable_noStore as noStore } from 'next/cache';
import Deposit from './models/DepositModel'
import dbConnect from './dbConnect';
import User from './models/UserModel';
import CashLocation from './models/CashLocationModel';
import { headers } from 'next/headers';

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

    // await new Promise(resolve => setTimeout(resolve, 5000));

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
    user.points += Math.floor((deposit.deposit_amount * 3 / 10000))
    await user.save()

    //update cash locations
    const cashLocation : any = await CashLocation.findOne({name: deposit.cashLocation})
    cashLocation.amount += deposit.deposit_amount
    await cashLocation.save()

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
    
    user.investmentAmount =  user.investmentAmount - deposit.deposit_amount + newDeposit.deposit_amount
    user.points += Math.floor((newDeposit.deposit_amount - deposit.deposit_amount) * 3 / 10000)
    

    //update cash locations
    if (deposit.cashLocation && newDeposit.cashLocation){
        const oldCashLocation = await CashLocation.findOne({name: deposit.cashLocation})
        oldCashLocation.amount -= deposit.deposit_amount
        const newCashLocation = await CashLocation.findOne({name: newDeposit.cashLocation})
        newCashLocation.amount += newDeposit.deposit_amount
    }

    //update Deposit
    deposit.depositor_name = newDeposit.depositor_name
    deposit.deposit_date = newDeposit.deposit_date
    deposit.deposit_amount = newDeposit.deposit_amount
    deposit.cashLocation = newDeposit.cashLocation
    deposit.comment= newDeposit.comment

    await Promise.all([
        deposit.save(),
        user.save()
    ])
    
}

//added
export async function getUsers(){
    noStore()
    await dbConnect() //connect to db if not already connected
    const users =  await User.find({}, 'fullName -_id');
    return users.map((user)=>user.fullName).sort()
}

export async function getUsersWithIds(){
    noStore()
    await dbConnect() //connect to db if not already connected
    const users =  await User.find({}, 'fullName');
    const sortedUsers = users.sort((a, b) => {
      if (a.fullName < b.fullName) {
          return -1;
      }
      if (a.fullName > b.fullName) {
          return 1;
      }
        return 0;
    });

    return sortedUsers
}