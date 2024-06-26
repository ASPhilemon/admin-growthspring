import mongoose from "mongoose";

export interface Deposits extends mongoose.Document {
    depositor_name: string,
    deposit_date: Date,
    deposit_amount: number,
    recorded_by: string,
    balance_before: number,
    source: String,
    cashLocation: string,
    comment: string
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
    min: 10000,
    required: [true, "Please provide the deposit amount"]
  },
  recorded_by: {
    type: String,
    required: [true, "Please provide the admin who recorded the deposit"]
  },
  source: {
    type: String,
    required: [true, "The source of deposit is required"]
  },
  balance_before: {
    type: Number,
    required: [true, "Please provide depositor worth before deposit"]
  },
  cashLocation: {
    type: String,
    required: false
  },
  comment:{
    type: String,
    required: false
  }

});

export default mongoose.models.Deposit || mongoose.model<Deposits>("Deposit", DepositSchema);
