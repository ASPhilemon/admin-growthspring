import mongoose from "mongoose";
const Schema = mongoose.Schema;

const earningsSchema = new Schema({
    beneficiary_name: String,
    date_of_earning: Date,
    earnings_amount: Number,
    destination: String,
    source: String,
    status: String,
})

export default mongoose.models.Earning || mongoose.model("Earning", earningsSchema);