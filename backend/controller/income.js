const IncomeModel = require("../models/income");
const { computeBudgetSummary } = require("./budget");

async function income(req, res) {
  try {
    const { user_id, amount, date, category, description } = req.body;
    if (!user_id) return res.status(400).json({ message: "User ID missing" });
    // create
    const newIncome = await IncomeModel.create({ user_id, amount, date, category, description });

    // compute month/year from provided date or now
    const d = date ? new Date(date) : new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    // return updated budget summary
    const { summary } = await computeBudgetSummary(user_id, year, month);

    res.status(201).json({ message: "Income added", income: newIncome, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function displayincome(req, res) {
  try {
    const { user_id } = req.query;
    let incomes;

    if (user_id) {
      incomes = await IncomeModel.find({ user_id }).sort({ date: -1 }).limit(3);
    }

    res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch incomes" });
  }
}

module.exports = { income, displayincome };
