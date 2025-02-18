import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fundtransactionSchema = new Schema({
    transaction_type: String, 
    name: String,
    amount: Number,
    reason: String,
    date: Date
})

export default mongoose.models.fundtransaction || mongoose.model("fundtransaction", fundtransactionSchema);