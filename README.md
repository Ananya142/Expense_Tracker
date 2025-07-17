# 💸 Expense Tracker App

A responsive and user-friendly web application for tracking income and expenses. Built with vanilla HTML, CSS, and JavaScript, it helps users manage their budget, view transaction history, and stay financially organized—without relying on frameworks.

---

## ✨ Features

- ✅ Add transactions as **Income** or **Expense**
- 📅 Record **Date**, **Description**, **Amount**, and **Type**
- 🗂️ Categorize entries to simplify review
- 🔀 **Sort** transactions by date
- 🧹 **Clear All** entries with one click
- 🗑️ Delete individual transactions dynamically
- 📊 Real-time **balance calculation**

---

## 💡 How It Works

Transactions are stored in an array within the browser session. The UI updates dynamically using DOM manipulation and reflects the current state:
- Expenses subtract from total
- Incomes add to total
- Deletion updates balance instantly
- Sorting helps analyze spending flow

---

## 🛠️ Technologies Used

| Technology | Purpose               |
|------------|------------------------|
| HTML       | Structure & input fields |
| CSS        | Styling & layout       |
| JavaScript | Logic & interaction    |

No external libraries or dependencies required.

---

## 🚀 Getting Started

To run this app locally:

```bash
git clone https://github.com/Ananya142/Expense_tracker.git
