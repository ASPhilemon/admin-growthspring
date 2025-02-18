import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    pending_profits: [{
        year: String,
        pending_profits_amount: Number
    }],
    clubFundWorth: Number,
    clubInvestments: [{
        investment_name: String,
        investment_amount: Number,
        added_by: String,
        investment_date: Date,
        details: String,
        capitalLeft: Number,
        status: String, 
        paymentsHistory: [{
            date: Date,
            amount: Number,
            recorded_by: String
        }]
    }],
    });

export default mongoose.models.clubdata || mongoose.model("clubdata", clubSchema);