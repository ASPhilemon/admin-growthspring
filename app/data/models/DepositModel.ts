import mongoose from "mongoose";

export interface Deposits extends mongoose.Document {
    depositor_name: string,
    deposit_date: Date,
    deposit_amount: number,
    recorded_by: string,
    balance_before: number,
    source: String,
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const DepositSchema = new mongoose.Schema<Deposits>({

  depositor_name: {
    type: String,
    required: [true, "Please select depositor"]
  },
  deposit_date: {
    type: Date,
    required: [true, "Please provide the date deposit was made"]
  },
  deposit_amount: {
    type: Number,
    required: [true, "Please provide the deposit amount"]
  }

});

export default mongoose.models.Deposit || mongoose.model<Deposits>("Deposit", DepositSchema);
