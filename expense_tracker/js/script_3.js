const transactionForm = document.getElementById("transactionForm");
const transactionsSection = document.querySelector("section:first-of-type");
const totalBalance = document.getElementById("total");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = transactionForm.querySelector('input[name="name"]').value;
  const amount = parseFloat(
    transactionForm.querySelector('input[name="amount"]').value
  );
  const date = transactionForm.querySelector('input[name="date"]').value;

  if (name && !isNaN(amount) && date) {
    const transaction = {
      id: Date.now(),
      name,
      amount,
      date,
    };

    transactions.push(transaction);
    saveTransactions();
    updateTransactionsList();
    updateBalance();
    clearInputs();
  } else {
    alert("Please enter valid transaction details.");
  }
});

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateTransactionsList() {
  transactionsSection.innerHTML = "<h3>Transactions</h3>";

  transactions.forEach((transaction) => {
    const transactionItem = document.createElement("div");
    transactionItem.classList.add("transaction");
    transactionItem.innerHTML = `
      <p>${transaction.name}</p>
      <p>${transaction.date}</p>
      <p>TK.${transaction.amount.toFixed(2)}</p>
      <button class="delete" data-id="${transaction.id}">Delete</button>
    `;
    transactionsSection.appendChild(transactionItem);
  });

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const id = parseInt(button.getAttribute("data-id"));
      transactions = transactions.filter(
        (transaction) => transaction.id !== id
      );
      saveTransactions();
      updateTransactionsList();
      updateBalance();
    });
  });
}

function updateBalance() {
  const income = transactions.reduce((total, transaction) => {
    return transaction.amount > 0 ? total + transaction.amount : total;
  }, 0);

  const expenses = transactions.reduce((total, transaction) => {
    return transaction.amount < 0 ? total - transaction.amount : total;
  }, 0);

  const balance = income - expenses;

  totalBalance.textContent = `TK.${balance.toFixed(2)}`;
  incomeDisplay.textContent = `TK.${income.toFixed(2)}`;
  expenseDisplay.textContent = `TK.${expenses.toFixed(2)}`;
}

function clearInputs() {
  transactionForm.querySelector('input[name="name"]').value = "";
  transactionForm.querySelector('input[name="amount"]').value = "0";
  transactionForm.querySelector('input[name="date"]').value = "";
}

updateTransactionsList();
updateBalance();
