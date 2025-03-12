import Expense from "../models/Expense.js";

// ✅ Add Expense
export const addExpense = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { category, amount, date, notes } = req.body;
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Category, amount, and date are required." });
        }

        const expense = new Expense({
            userId: req.user._id,
            category,
            amount,
            date,
            notes,
        });

        await expense.save();
        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Error adding expense" });
    }
};

// ✅ Get All Expenses for Logged-in User
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses" });
    }
};

//////////////Get expenses for current month

export const currentMonthExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const expenses = await Expense.find({
            userId: userId,
            date: { $gte: startOfMonth, $lte: endOfMonth } // Filter by current month
        });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this month" });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses" });
    }
};
//////////Get expenses by category

export const getExpensesByCategory = async (req, res) => {
    try {
        const expenses = await Expense.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } }
        ]);

        res.status(200).json(expenses);
    } catch (error) {
        console.log('Error fetching category data: ', error);
        res.status(500).json({ message: "Error fetching category data" });

    }
};;

// For comparing spending across months. 
export const getMonthlyExpenses = async (req, res) => {
    try {
        const expenses = await Expense.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json(expenses);;

    } catch (error) {
        console.log("Error fetching monthly data: ", error);
        res.status(500).json({ message: "Error fetching monthly data" });
    }
}



// ✅ Delete Expense (Only if it belongs to the user)
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Error deleting expense" });
    }
};

// ✅ Update Expense (Only if it belongs to the user)
export const updateExpense = async (req, res) => {
    try {
        const { category, amount, date, notes } = req.body;

        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        expense.category = category || expense.category;
        expense.amount = amount || expense.amount;
        expense.date = date || expense.date;
        expense.notes = notes || expense.notes;

        const updatedExpense = await expense.save();

        res.json({ message: "Expense updated successfully", updatedExpense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Error updating expense" });
    }
};
