import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
}, {
    timestamps: true
});

export default mongoose.model("Expense", ExpenseSchema);

