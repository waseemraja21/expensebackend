import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true }
})

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;