import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CashHistoriesSchema = new Schema({
    recipient_location_name: String,
    transaction_date: Date,
    transaction_amount: Number,
    recorded_by: String,
    other_location_name: String,
    balance_before: Number,
    category: String,
})


export default mongoose.models.CashHistories || mongoose.model("CashHistories", CashHistoriesSchema);