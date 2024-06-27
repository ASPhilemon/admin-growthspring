import mongoose from "mongoose";


/* PetSchema will correspond to a collection in your MongoDB database. */
const CashLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

export default mongoose.models.CashLocation || mongoose.model("CashLocation", CashLocationSchema);
