let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let lastDeletedTransaction = null;
let editIndex = -1; // Stores the index of the transaction being edited

function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    let balance = 0;

    transactions.forEach((transaction, index) => {
        balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
        transactionsList.innerHTML += `
            <li class="transaction">
                <span>${transaction.date} - ${transaction.description} (${transaction.category}) - ₹${transaction.amount.toFixed(2)}</span>
                <div>
                    <button onclick="editTransaction(${index})">✏️</button>
                    <button onclick="deleteTransaction(${index})">🗑</button>
                </div>
            </li>`;
    });

    document.getElementById('balance').innerText = `₹${balance.toFixed(2)}`;
}

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    if (!description || isNaN(amount) || !date) return showToast('Please fill all fields correctly!');

    const transaction = { description, amount, date, category, type };

    if (editIndex === -1) {
        transactions.push(transaction);
        showToast('Transaction added successfully!');
    } else {
        transactions[editIndex] = transaction;
        showToast('Transaction updated successfully!');
        editIndex = -1;
        document.getElementById('update-btn').style.display = 'none';
        document.getElementById('add-btn').style.display = 'inline-block';
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
    clearInputFields();
}

function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('date').value = transaction.date;
    document.getElementById('category').value = transaction.category;
    document.getElementById('type').value = transaction.type;

    editIndex = index;
    document.getElementById('update-btn').style.display = 'inline-block';
    document.getElementById('add-btn').style.display = 'none';
}

function deleteTransaction(index) {
    lastDeletedTransaction = transactions.splice(index, 1)[0];
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
    showToast('Transaction deleted successfully!');
}

function exportTransactions() {
    let csvContent = "Date,Description,Category,Type,Amount\n" + 
                     transactions.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Transactions exported successfully!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.onload = function () {
    loadTransactions();
};
