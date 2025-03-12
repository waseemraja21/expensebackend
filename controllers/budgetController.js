import Budget from "../models/Budget.js";



//set budget
export const setBudget = async (req, res) => {
    try {
        const { month, year, amount } = req.body;
        console.log(req.body);

        const existingBudget = await Budget.findOne({ userId: req.user._id, month, year });

        if (existingBudget) {
            return res.status(400).json({ message: 'Budget for this month already exists' })
        }

        const newBudget = new Budget({ userId: req.user._id, month, year, amount });
        console.log(newBudget);;

        await newBudget.save();
        res.status(201).json({ message: "Budget Set Successfully", newBudget });
    } catch (error) {
        res.status(500).json({ message: 'Error setting budget', error });
    }
};

//Get Budget

export const getBudget = async (req, res) => {
    try {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
        const currentYear = new Date().getFullYear();
        const budget = await Budget.findOne({ userId: req.user._id, month: currentMonth, year: currentYear });


        if (!budget) {
            return res.status(404).json({ message: 'No budget set for this month' });
        }

        res.status(200).json(budget);

    } catch (error) {
        console.log("error fetching budget ", error);

        res.status(500).json({ message: 'Error fetching budget', error });
    }
}

//update budget

export const updateBudget = async (req, res) => {
    try {
        const { amount } = req.body;
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
        const currentYear = new Date().getFullYear();
        const userId = req.user._id;
        // Ensure amount is valid
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Please enter a valid budget amount." });
        }

        // Find the existing budget for the current user and month
        const budget = await Budget.findOne({
            userId: userId,
            month: currentMonth,
            year: currentYear
        });

        console.log(budget);

        if (!budget) {
            return res.status(404).json({ message: "No budget set for this month. Please set a budget first." });
        }

        // Update the budget amount
        budget.amount = amount;
        await budget.save();

        res.status(200).json({ message: "Budget updated successfully!", budget });

    } catch (error) {
        console.error("Error updating budget", error);
        res.status(500).json({ message: "Error updating budget", error });
    }
};
