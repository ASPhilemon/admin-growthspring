import mongoose from "mongoose";
const Schema = mongoose.Schema;

const constantsSchema = new Schema({
one_point_value: Number,
max_lending_rate: Number,
min_lending_rate: Number,
annual_tax_rate: Number,
max_credits: Number,
min_discount: Number,
discount_profit_percentage: Number,
monthly_lending_rate: Number,
loan_risk: Number,
members_served_percentage: Number,
loan_multiple: Number

});

export default mongoose.models.constant || mongoose.model("constant", constantsSchema);

