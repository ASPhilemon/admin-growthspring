import { unstable_noStore as noStore } from "next/cache";
import dbConnect from "./dbConnect"
import Loan from "./models/LoanModel"


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

export async function getLoans( {member, year, loan_status, page, order, perPage, sortBy } : any) {
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

  // Sort stage to sort the matching deposits by date
  pipeline.push({ $sort: { [sortBy]: order } });

  // Skip and Limit stages for pagination
  pipeline.push({ $skip: (page - 1) * perPage });
  pipeline.push({ $limit: perPage });

  const loans = await Loan.aggregate(pipeline);
  return loans;
}