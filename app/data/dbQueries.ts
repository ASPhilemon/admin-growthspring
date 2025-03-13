import { unstable_noStore as noStore } from 'next/cache';
import Deposit from './models/DepositModel'
import dbConnect from './dbConnect';
import User from './models/UserModel';
import CashLocation from './models/CashLocationModel';
import { headers } from 'next/headers';
import Loan from "./models/LoanModel"
import Constants from "./models/Constants"
import CashTransfers from "./models/CashTransfers"
import Earnings from "./models/Earnings"
import FundTransactions from "./models/FundTransactions"
import ClubData from "./models/ClubData"
import LoanModel from "./models/LoanModel";

export type searchFilterDeposit = {
    year? : number | string,
    month? : number | string,
    member? : string,
    page: number,
    sortBy: 'deposit_date' | 'deposit_amount',
    order: number,
    perPage: number
}


export async function addFundTransactions(fundtransactionObject: { transaction_type: string; amount: number; }) {
  noStore();
  await dbConnect();
  
  const newTransaction = await FundTransactions.create(fundtransactionObject);
  const amount = fundtransactionObject.transaction_type == 'Expense'? -1 * fundtransactionObject.amount : fundtransactionObject.amount;
  const newWorth = await ClubData.updateOne({$inc: {clubFundWorth: amount}}) 
  await newTransaction.save();
  
  return { msg: "Transaction added successfully", data: newTransaction };
}


interface CashTransfer {
  amount: number;
  source: string;
  destination: string;
  movedBy: string;
  date?: string;
}

interface CashTransfer {
  amount: number;
  source: string;
  destination: string;
  movedBy: string;
  date?: string;
}

interface TransferResult {
  success: boolean;
  msg: string;
}

export async function addCashTransfers(data: CashTransfer): Promise<TransferResult> {
  try {
    const { amount, source, destination, movedBy, date } = data;

    if (!amount) {
      return { success: false, msg: 'Amount not entered' };
    }

    const locations = await CashLocation.find({});
    const sourceLocation = locations.find(loc => loc.name === source);
    const destinationLocation = locations.find(loc => loc.name === destination);

    if (!sourceLocation) {
      return { success: false, msg: `Source location '${source}' not found` };
    }

    if (!destinationLocation) {
      return { success: false, msg: `Destination location '${destination}' not found` };
    }

    if (sourceLocation.amount < amount) {
      return { success: false, msg: `Not enough money in '${source}'` };
    }

    await updateLocations(amount, destination, source, movedBy, date || new Date().toISOString());

    return { success: true, msg: 'Transfer Complete' };

  } catch (error) {
    console.error(error);
    return { success: false, msg: 'An error occurred' };
  }
}

async function updateLocations(amount: number, recipientLocation: string, sourceLocation: string, admin: string, date: string) {
  try {
    const locations = await CashLocation.find({});
    const foundDestination = locations.find(loc => loc.name === recipientLocation);
    const foundSource = locations.find(loc => loc.name === sourceLocation);

    if (!foundSource || !foundDestination) {
      console.error(`One of the locations not found.`);
      return;
    }

    await CashLocation.updateOne({ name: recipientLocation }, { $inc: { amount } });
    await CashLocation.updateOne({ name: sourceLocation }, { $inc: { amount: -amount } });

    await CashTransfers.create({
      recipient_location_name: recipientLocation,
      transaction_date: date,
      transaction_amount: amount,
      recorded_by: admin,
      other_location_name: sourceLocation,
      balance_before: foundDestination.amount,
    });

  } catch (error) {
    console.error('Error updating locations:', error);
    throw error;
  }
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
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "depositor_name",
        foreignField: "fullName",
        as: "depositor"
      },
    })
    pipeline.push({
      $addFields: {
        depositor: { $arrayElemAt: ["$depositor", 0] }
      }
    })

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
    const deposit_points = Math.floor((deposit.deposit_amount * 3 / 10000))
    user.points += deposit_points
    await user.save()

    //update cash locations
    const cashLocation : any = await CashLocation.findOne({name: deposit.cashLocation})
    cashLocation.amount += deposit.deposit_amount
    await cashLocation.save()

    const names = user.fullName.split(" ")
    const emailName = names[names.length-1]
    return {
        user: emailName,
        email: user.email,
        amount: deposit.deposit_amount,
        date: deposit.deposit_date,
        newWorth: user.investmentAmount,
        points: deposit_points,
        newPoints: user.points
    }

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
    //noStore()
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

async function getOneUser(id:string){
  //noStore()
  await dbConnect() //connect to db if not already connected
  const user =  await User.findById(id);
}

export async function getLocationRecords() {
  await dbConnect(); // Connect to DB if not already connected

  type TransferRecord = {
    amount: number;
    date: string | Date;
    destination: string;
    balance: number;
    recorder: string;
    source: string;
  };
  
  type MonthlyRecords = {
    [key: string]: { records: TransferRecord[] };
  };

  const ongoingLoans = await Loan.find({ loan_status: "Ongoing" }); 
  const endedLoans = await Loan.find({ loan_status: "Ended" });
  const endedLoansThisYear = endedLoans.filter(loan => {
    const date = new Date(loan.loan_date);
    return date.getUTCFullYear() === 2025;
  });
  
  const club = await User.find({});
  
  const cashLocation: any = await CashLocation.find({});
  const cashTransfers: any = await CashTransfers.find({});

  const clubWorth = club.reduce((total: number, member: any) => total + member.investmentAmount, 0);
  const moneyInLoans = ongoingLoans.reduce((total: number, loan: any) => total + loan.principal_left, 0);
  let profitsSoFar = endedLoansThisYear.reduce((total: number, loan: any) => total + loan.interest_amount, 0);

  ongoingLoans.forEach((loan: any) => {
    let totalLoanPayments = 0;
    if (loan.payments) {
      totalLoanPayments = loan.payments.reduce((total: number, payment: any) => total + payment.payment_amount, 0);
    }
    profitsSoFar += loan.principal_left + totalLoanPayments - loan.loan_amount;
  });

  let transferRecords: TransferRecord[] = [];

  cashTransfers.forEach((transfer: any) => {
    transferRecords.push({
      amount: transfer.transaction_amount,
      date: transfer.transaction_date,
      destination: transfer.recipient_location_name,
      balance: transfer.balance_before - transfer.transaction_amount,
      recorder: transfer.recorded_by,
      source: transfer.other_location_name,
    });
  });

  // Sort records by date
  transferRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    groupedRecords: groupRecordsByMonth(transferRecords),
    profitsSoFar,
    clubWorth,
    cashLocation,
    moneyInLoans,
    cashTransfers,
    
  };

  function groupRecordsByMonth(records: TransferRecord[]): MonthlyRecords {
    return records.reduce((acc: MonthlyRecords, record: TransferRecord) => {
      const month = new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { records: [] };
      }
      acc[month].records.push(record);
      return acc;
    }, {});
  }
}


export async function getAllFinancialRecords(){
  await dbConnect(); // Connect to DB if not already connected
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const deposits = await Deposit.find().lean(); // Fetch deposits
  const loans = await Loan.find().lean(); // Fetch loans

  interface DepositRecord {
  type: 'Deposit';
  amount: number;
  date: string | Date;
  name: string;
  destination: string;
}

interface LoanRecord {
  type: 'Loan';
  amount: number;
  date: string | Date;
  name: string;
  source: string;
  isOutflow: boolean;
}

interface LoanPaymentRecord {
  type: 'Loan Payment';
  amount: number;
  date: string | Date;
  name: string;
  destination: string;
}

type FinancialRecord = DepositRecord | LoanRecord | LoanPaymentRecord;

interface MonthlySummary {
  records: FinancialRecord[];
  totalInflow: number;
  totalOutflow: number;
  totalDeposits: number;
  totalLoans: number;
  totalLoanPayments: number;
}

type MonthlyRecords = {
  [month: string]: MonthlySummary;
};


  const allRecords: FinancialRecord[] = [];

  deposits.forEach(deposit => {
    allRecords.push({
      type: 'Deposit',
      amount: deposit.deposit_amount,
      date: deposit.deposit_date,
      name: deposit.depositor_name,
      destination: deposit.cashLocation || 'Not Available',
    });
  });

  loans.forEach(loan => {
    allRecords.push({
      type: 'Loan',
      amount: loan.loan_amount,
      date: loan.loan_date,
      name: loan.borrower_name,
      source: loan.sources && loan.sources.length > 0 ? loan.sources.filter((source: { amount: number }) => source.amount > 0).map((source: { location: any; })  => source.location).join(', ') : 'Not Available',
      isOutflow: true,
    });

    if (loan.payments) {
      loan.payments.forEach((payment: { payment_amount: any; payment_date: any; payment_location: any; }) => {
        allRecords.push({
          type: 'Loan Payment',
          amount: payment.payment_amount,
          date: payment.payment_date,
          name: loan.borrower_name,
          destination: payment.payment_location || 'Not Available',
        });
      });
    }
  });

  // Sort records by date
  allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return groupRecordsByMonth(allRecords);

  function groupRecordsByMonth(records: FinancialRecord[]): MonthlyRecords {
    return records.reduce((acc: MonthlyRecords, record: FinancialRecord) => {
      const month = new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { records: [], totalInflow: 0, totalOutflow: 0, totalDeposits: 0, totalLoans: 0, totalLoanPayments: 0 };
      }
      acc[month].records.push(record);
      if ('isOutflow' in record && record.isOutflow) {
        acc[month].totalOutflow += record.amount;
      } else {
        acc[month].totalInflow += record.amount;
      }
      if (record.type === 'Loan Payment') {
        acc[month].totalLoanPayments += record.amount;
      } else if (record.type === 'Loan') {
        acc[month].totalLoans += record.amount;
      } else {
        acc[month].totalDeposits += record.amount;
      }
      return acc;
    }, {});
  }
  
}


export async function getFundRecords() {
  await dbConnect(); // Connect to DB if not already connected

  const fundTransactions = await FundTransactions.find().lean(); // Fetch fund records
  const clubdata = await ClubData.findOne();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  let currentAccountBalance = clubdata.clubFundWorth;

  interface IncomeRecord {
    type: 'Income';
    amount: number;
    date: string | Date;
    name: string;
    destination: string;
  }

  interface ExpenseRecord {
    type: 'Expense';
    amount: number;
    date: string | Date;
    name: string;
    destination: string;
    isOutflow: boolean;
  }

  type FinancialRecord = IncomeRecord | ExpenseRecord;

  interface YearlySummary {
    records: FinancialRecord[];
    totalInflow: number;
    totalOutflow: number;
    balance: number;
  }

  type YearlyRecords = {
    [year: string]: YearlySummary;
  };

  const allRecords: FinancialRecord[] = [];


  fundTransactions.forEach(transaction => {
    if (transaction.transaction_type === 'Expense') {
      allRecords.push({
        type: 'Expense',
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        destination: transaction.reason,
        isOutflow: true,
      });
    } else {
      allRecords.push({
        type: 'Income',
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        destination: transaction.reason,
      });
    }
  });


  // Sort records by date
  allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return groupRecordsByYear(allRecords, currentAccountBalance);

  function groupRecordsByYear(records: FinancialRecord[], currentAccountBalance: number): YearlyRecords {
    // Sort records by date descending to facilitate backward calculation
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
    const yearlyRecords = records.reduce((acc: YearlyRecords, record: FinancialRecord) => {
      const year = new Date(record.date).getFullYear().toString();
  
      if (!acc[year]) {
        acc[year] = { records: [], totalInflow: 0, totalOutflow: 0, balance: 0 };
      }
  
      acc[year].records.push(record);
  
      // Update inflows and outflows
      if ('isOutflow' in record && record.isOutflow) {
        acc[year].totalOutflow += record.amount;
      } else {
        acc[year].totalInflow += record.amount;
      }
  
      return acc;
    }, {} as YearlyRecords);
  
    // Calculate balances backward
    let runningBalance = currentAccountBalance;
  
    Object.keys(yearlyRecords)
      .sort((a, b) => parseInt(b) - parseInt(a)) // Ensure years are in descending order
      .forEach((year) => {
        const yearData = yearlyRecords[year];
        yearData.balance = runningBalance;
        runningBalance -= (yearData.totalInflow - yearData.totalOutflow);
      });
  
    return yearlyRecords;
  }
  
}

export async function getProfitRecords() {
  await dbConnect(); // Connect to DB if not already connected
  // Data Retrieval
  const members = await User.find();
  const constants = await Constants.findOne();
  const clubEarnings =  await Earnings.find({})
  const thisYear = new Date().getFullYear();
  const clubWorth = members.reduce((total, member) => total + member.investmentAmount, 0);
  let allUnits = 0;
  let people = [];
  const profits = 0.8 * 2418164;
  const allProfits = 0.8 * 5733449;
  const nextProfits = allProfits - profits;

  const someFutureDate = new Date("2025-01-01T00:00:00Z");

  const thisYearLoans = await Loan.find({
    $expr: {
      $gt: ["$loan_date", someFutureDate],
    },
  });

  let loanInterest = 0;
  let loanUnits = 0;

  thisYearLoans.forEach((loan) => {
    if (loan.loan_status === "Ongoing") {
      const loanYear = loan.loan_date.getFullYear();
      let Today = new Date();
      let remainder = getDaysDifference(loan.loan_date, Today);
      let currentLoanDuration = Math.ceil(remainder / 30);
      let pointDays = Math.max(0, Math.min(12, currentLoanDuration) - 6) + Math.max(18, currentLoanDuration) - 18;
      let runningRate = constants.monthly_lending_rate * (currentLoanDuration - pointDays);
      let pendingAmountInterest = (runningRate * loan.principal_left) / 100;
      let paymentInterestAmount = 0;
      let points = (constants.monthly_lending_rate * pointDays * loan.principal_left) / 100000;

      if (loan.payments) {
        loan.payments.forEach((payment: any) => {
          let duration =
            (getDaysDifference(loan.loan_date, payment.payment_date) % 30) / 30 < 0.24
              ? Math.trunc(getDaysDifference(loan.loan_date, payment.payment_date) / 30)
              : Math.ceil(getDaysDifference(loan.loan_date, payment.payment_date) / 30);
          let pointDay = Math.max(0, Math.min(12, duration) - 6) + Math.max(18, duration) - 18;
          let paymentInterest = (constants.monthly_lending_rate * (duration - pointDay) * payment.payment_amount) / 100;
          points += (constants.monthly_lending_rate * pointDay * payment.payment_amount) / 100000;
          paymentInterestAmount += paymentInterest;
        });
      }

      let accruedInterest =
        thisYear === loanYear ? pendingAmountInterest : pendingAmountInterest + paymentInterestAmount;
      accruedInterest =
        accruedInterest === 0 ? (constants.monthly_lending_rate * loan.principal_left) / 100 : accruedInterest;
      let pointsAccrued = points;
      const lastPaymentPeriod = getDaysDifference(loan.last_payment_date);
      let loanUnitsValue = loan.loan_units + loan.principal_left * lastPaymentPeriod;

      loanInterest += accruedInterest;
      loanUnits += loanUnitsValue;
    } else {
      loanInterest += loan.interest_amount;
      loanUnits += loan.loan_units;
    }
  });

  // Calculate Member Profits
  for (const member of members) {
    let totalUnits = 0;
    let perc = 0;
    let yearDeposits = 0;
    const investmentDays = getDaysDifference(member.investmentDate);

    // Fetch member's deposits for the current year
    const allMemberDeposits = await Deposit.find({ depositor_name: member.fullName });
    const depositRecords = allMemberDeposits.filter(
      (deposit) => new Date(deposit.deposit_date).getFullYear() === 2025
    );

    for (const deposit of depositRecords) {
      const depositUnits = deposit.deposit_amount * getDaysDifference(deposit.deposit_date);
      totalUnits += depositUnits;
      yearDeposits += deposit.deposit_amount;
    }
    totalUnits += investmentDays * (member.investmentAmount - yearDeposits);
    allUnits += totalUnits;
    perc = totalUnits / allUnits || 0;
    people.push({ name: member.fullName, units: totalUnits });
  }

  const investment = (allUnits / 365) - 8000000; // Prevent division by zero
  const fullTrustInterest = investment * 0.1;
  let totalIncome = 0;
  let trustIncome = 0;
  let remainderUnits = 0;

  for (const item of people) {
    const perc = item.units / allUnits || 0;
    const memberProfits = Math.round(perc * allProfits);

    remainderUnits = allUnits - loanUnits;
    trustIncome = ((remainderUnits * fullTrustInterest) / allUnits)|| 0;
    totalIncome = trustIncome + loanInterest;

    /*console.log({
      member: item.name,
      profits: memberProfits.toLocaleString(),
      trustIncome: Math.round(trustIncome).toLocaleString(),
      totalIncome: Math.round(totalIncome).toLocaleString(),
    });*/
  }

  type FinancialRecord = {
    date_of_earning: string;
    earnings_amount: number;
    units?: number;
  };
  
  type GroupedEarnings = {
    totalSumAll: Record<string, number>;
    yearsSums: Record<number, Record<string, number>>;
    recordsByYear: Record<number, FinancialRecord[]>;
    monthlySums: Record<number, Record<string, Record<string, number>>>;
    sortedRecords: FinancialRecord[];
  };

  function getTotalSumsAndSort(records: any[], givenDate: string, ...fields: string[]) {
    if (records.length === 0) {
      return {
        totalSumAll: {},
        yearsSums: {},
        recordsByYear: {},
        monthlySums: {},
        sortedRecords: [],
      };
    }
  
    const totalSumAll: Record<string, number> = {};
    const yearsSums: Record<string, Record<string, number>> = {};
    const recordsByYear: Record<string, any[]> = {};
    const monthlySums: Record<string, Record<string, Record<string, number>>> = {};
  
    const validRecords = records.filter(record => {
      const date = new Date(record[givenDate]);
      return date instanceof Date && !isNaN(date.getTime());
    });
  
    const sortedRecords = validRecords.sort(
      (a, b) => new Date(b[givenDate]).getTime() - new Date(a[givenDate]).getTime()
    );
  
    sortedRecords.forEach(record => {
      fields.forEach(field => {
        if (typeof record[field] !== 'number') return;
  
        totalSumAll[field] = (totalSumAll[field] || 0) + record[field];
  
        const year = new Date(record[givenDate]).getFullYear().toString();
        const month = new Date(record[givenDate]).toLocaleString('default', { month: 'long' });
  
        yearsSums[year] = yearsSums[year] || {};
        yearsSums[year][field] = (yearsSums[year][field] || 0) + record[field];
  
        recordsByYear[year] = recordsByYear[year] || [];
        recordsByYear[year].push(record);
  
        monthlySums[year] = monthlySums[year] || {};
        monthlySums[year][month] = monthlySums[year][month] || {};
        monthlySums[year][month][field] = (monthlySums[year][month][field] || 0) + record[field];
      });
    });
  
    return {
      totalSumAll,
      yearsSums,
      recordsByYear,
      monthlySums,
      sortedRecords,
    };
  }
  
  
  
  const clubEarningsRecords = calculateClubEarnings(clubEarnings, new Date().getUTCFullYear());
  function calculateClubEarnings(clubEarnings: FinancialRecord[], currentYear: number) {
    const groupedEarnings = getTotalSumsAndSort(clubEarnings, 'date_of_earning', 'earnings_amount', 'units');
  
    return Object.entries(groupedEarnings.yearsSums)
      .map(([year, record]) => {
        if (parseInt(year) !== currentYear) {
          const actualInvestment = record?.units ? record.units / 365 : 0;
          const total = Math.round(record?.earnings_amount || 0);
          const roi = +year !== currentYear && actualInvestment > 0
            ? Math.round((record.earnings_amount * 100) / actualInvestment)
            : 0;
  
          return [+year, total, roi];
        }
      })
      .filter(Boolean); // Remove undefined values
  }
  
  const currentMonth = new Date().getMonth() + 1;
  const sumOfMonths = sumOfDigitsInRange(currentMonth)
  function sumOfDigitsInRange(n: any) {
    let totalSum = 0;
    
    for (let i = 1; i <= (12-n); i++) {
        totalSum += i;
    }
    
    return totalSum;
}

  const unitIncome = Math.round((remainderUnits * fullTrustInterest/allUnits) + 600000 + 1200000);

  const depositProjection = 2000000 * 0.01 * sumOfMonths;
  //const clubEarningsRecords: [number, ...any[]][] = [...]; // Define it properly

  return {
    fullTrustInterest: Math.round(fullTrustInterest).toLocaleString() + 600000 + 1200000,
    loanInterest: Math.round(loanInterest),
    trustIncome: unitIncome,
    totalIncome: Math.round(loanInterest + unitIncome),
    clubEarningsRecords: (clubEarningsRecords ?? []).sort(
      (a, b) => (b?.[0] ?? 0) - (a?.[0] ?? 0)
    ),    
    totalIncomeWithDeposits: Math.round(loanInterest + depositProjection + unitIncome)
  };
}

// GET_DIFFERENCE_BETWEEN_DATES
function getDaysDifference(earlierDate: string | number | Date, laterDate = new Date()) {
  if (!earlierDate) return 0;
  const firstPeriod = new Date(earlierDate);
  const secondPeriod = new Date(laterDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const timeDifference = secondPeriod.getTime() - firstPeriod.getTime();
  return Math.max(0, Math.floor(timeDifference / millisecondsPerDay));
}


