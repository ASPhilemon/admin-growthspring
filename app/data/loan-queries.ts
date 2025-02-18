import { unstable_noStore as noStore } from "next/cache";
import dbConnect from "./dbConnect"
import Loan from "./models/LoanModel"
import LoanModel from "./models/LoanModel";


export async function loanCount( {member, year, loan_status } : any) {
  noStore()
  await dbConnect() // Connect to the database if not already connected

  const pipeline = [];

  // Match stage to filter documents based on all provided criteria
  const matchStage: any = {};

  const matchCriteria = [];
  if (year) matchCriteria.push({ $expr: { $eq: [{$year: "$loan_date"}, year] } });
  if (!loan_status) matchCriteria.push({ loan_status: { $in: ["Ended", "Ongoing"] } }); else matchCriteria.push({ loan_status})
  if (member) matchCriteria.push({ borrower_name: member });

  if (matchCriteria.length > 0) matchStage.$and = matchCriteria

  pipeline.push({ $match: matchStage });

  // Count stage to calculate the total number of matching loans
  pipeline.push({ $count: "count" });

  const result = await Loan.aggregate(pipeline);
  return result.length > 0 ? result[0].count : 0;
}

export async function getLoans({ member, year, loan_status, page, month, order, perPage, sortBy }: any) {
  noStore();
  await dbConnect(); // Connect to the database if not already connected

  const pipeline = [];

  // Match stage to filter documents based on all provided criteria
  const matchStage: any = {};

  const matchCriteria = [];
  if (year) matchCriteria.push({ $expr: { $eq: [{ $year: "$loan_date" }, year] } });
  if (month) matchCriteria.push({ $expr: { $eq: [{ $month: "$loan_date" }, month] } });
  if (!loan_status || loan_status !== "Overdue") {
    matchCriteria.push({ loan_status: { $in: ["Ended", "Ongoing"] } });
  }
  if (member) matchCriteria.push({ borrower_name: member });

  if (matchCriteria.length > 0) matchStage.$and = matchCriteria;

  pipeline.push({ $match: matchStage });

  // Sort stage to sort the matching deposits by date
  pipeline.push({ $sort: { [sortBy]: order } });

  // Skip and Limit stages for pagination
  pipeline.push({ $skip: (page - 1) * perPage });
  pipeline.push({ $limit: perPage });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "borrower_name",
      foreignField: "fullName",
      as: "borrower",
    },
  });
  pipeline.push({
    $addFields: {
      borrower: { $arrayElemAt: ["$borrower", 0] },
    },
  });

  const loans = await Loan.aggregate(pipeline);

  // Post-query filter for overdue loans if the status is "Overdue"
  if (loan_status === "Overdue") {
    const currentDate = new Date();

    return loans.filter((loan) => {
      const loanEndDate = new Date(loan.loan_date);
      loanEndDate.setMonth(loanEndDate.getMonth() + loan.loan_duration);

      return loanEndDate < currentDate && loan.loan_status === "Ongoing";
    });
  }

  return loans;
}


export async function getLoan(id:string){
  noStore()
  await dbConnect() // Connect to the database if not already connected
  return LoanModel.findById(id)
}