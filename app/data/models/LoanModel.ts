import mongoose from "mongoose"

const LoanSchema = new mongoose.Schema({
    loan_duration: Number,
    loan_rate: Number,
    earliest_date: Date,
    latest_date: Date,
    loan_status: String,
    initiated_by: String,
    approved_by: String,
    worth_at_loan: Number,
    loan_amount: Number,
    loan_date: Date,
    borrower_name: String,
    points_spent: Number,
    principal_left: Number,
    last_payment_date: Date,
    loan_units: Number,
    rate_after_discount: Number,
    discount: Number,
    points_worth_bought: Number,
    interest_amount: Number,
    installment_amount: {
        type: Number,
        required: false
    },
    payments: [{
        payment_date: Date,
        payment_amount: Number,
        updated_by: String,
    }],
})

export default mongoose.models.loan || mongoose.model("loan", LoanSchema);




