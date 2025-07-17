let transactions = [];

document.getElementById('type').addEventListener('change', updateButtonLabel);
function updateButtonLabel() {
  const type = document.getElementById('type').value;
  const button = document.querySelector('button[onclick="addTransaction()"]');
  button.textContent = type === 'income' ? 'Add Income' : 'Add Expense';
}

function addTransaction() {
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;
  const desc = document.getElementById('desc').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const error = document.getElementById('error');

  if (!desc || !amount || isNaN(amount) || !date || !type) {
    error.textContent = 'Please enter valid type, description, amount, and date';
    return;
  }

  error.textContent = '';
  const newTxn = {
    id: Date.now(),
    type,
    date,
    desc,
    amount: parseFloat(amount)
  };

  transactions.push(newTxn);
  updateUI();

  // Clear form
  document.getElementById('type').value = 'expense';
  updateButtonLabel();
  document.getElementById('date').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
}

function updateUI() {
  const list = document.getElementById('list');
  const total = document.getElementById('total');
  list.innerHTML = '';
  
  let totalAmount = 0;
  
  transactions.forEach(txn => {
    totalAmount += txn.type === 'expense' ? -txn.amount : txn.amount;

    const li = document.createElement('li');
    li.innerHTML = `<strong>${txn.desc}</strong> - ₹${txn.amount.toFixed(2)} (${txn.type}) on ${txn.date}`;
    list.appendChild(li);
  });

  total.textContent = totalAmount.toFixed(2);
}

function clearAll() {
  transactions = [];
  updateUI();
}

function sortTransactions() {
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  updateUI();
}