// frontend/app.js
const API_BASE = "http://localhost:5000"; // change when you deploy

let selectedAccountId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadAccounts();

  const createForm = document.getElementById("createAccountForm");
  createForm.addEventListener("submit", handleCreateAccount);

  const depositForm = document.getElementById("depositForm");
  depositForm.addEventListener("submit", handleDeposit);

  const withdrawForm = document.getElementById("withdrawForm");
  withdrawForm.addEventListener("submit", handleWithdraw);
});

// Load all accounts
async function loadAccounts() {
  try {
    const res = await fetch(`${API_BASE}/api/accounts`);
    const accounts = await res.json();
    renderAccounts(accounts);
  } catch (error) {
    console.error("Error loading accounts", error);
  }
}

// Renders accounts table + overview summary
function renderAccounts(accounts) {
  const tbody = document.getElementById("accountsTableBody");
  tbody.innerHTML = "";

  accounts.forEach((acc) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${acc.holderName}</td>
      <td>${acc.accountNumber}</td>
      <td>$${acc.balance.toFixed(2)}</td>
      <td>
        <button class="btn btn-primary" onclick="viewAccount('${acc._id}')">
          View
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // --- Update overview summary ---
  const summaryAccounts = document.getElementById("summaryAccounts");
  const summaryBalance = document.getElementById("summaryBalance");

  if (summaryAccounts && summaryBalance) {
    // total accounts
    summaryAccounts.textContent = accounts.length;

    // total balance
    const total = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    summaryBalance.textContent = total.toFixed(2);
  }
}

// Create account
async function handleCreateAccount(e) {
  e.preventDefault();
  const holderName = document.getElementById("holderName").value.trim();
  const initialDeposit = document.getElementById("initialDeposit").value;

  if (!holderName) {
    alert("Please enter account holder name");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holderName, initialDeposit }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Error creating account");
      return;
    }

    document.getElementById("createAccountForm").reset();
    await loadAccounts();
  } catch (error) {
    console.error("Error creating account", error);
  }
}

// View one account + its transactions
async function viewAccount(id) {
  try {
    const res = await fetch(`${API_BASE}/api/accounts/${id}`);
    if (!res.ok) {
      alert("Failed to load account");
      return;
    }

    const data = await res.json();
    selectedAccountId = data.account._id;
    renderAccountDetails(data);
  } catch (error) {
    console.error("Error viewing account", error);
  }
}

// Renders account details + transaction table (with colors)
function renderAccountDetails(data) {
  const section = document.getElementById("accountDetailsSection");
  const infoDiv = document.getElementById("accountInfo");
  const txBody = document.getElementById("transactionsTableBody");

  section.style.display = "block";

  const acc = data.account;

  infoDiv.innerHTML = `
    <p><strong>Holder:</strong> ${acc.holderName}</p>
    <p><strong>Account #:</strong> ${acc.accountNumber}</p>
    <p><strong>Balance:</strong> $${acc.balance.toFixed(2)}</p>
  `;

  txBody.innerHTML = "";
  data.transactions.forEach((tx) => {
    const tr = document.createElement("tr");

    // add CSS class for coloring
    if (tx.type === "deposit") {
      tr.classList.add("tx-deposit");
    } else if (tx.type === "withdrawal") {
      tr.classList.add("tx-withdrawal");
    }

    const date = new Date(tx.createdAt).toLocaleString();
    tr.innerHTML = `
      <td>${tx.type}</td>
      <td>$${tx.amount.toFixed(2)}</td>
      <td>${tx.description || ""}</td>
      <td>${date}</td>
    `;
    txBody.appendChild(tr);
  });
}

// Deposit
async function handleDeposit(e) {
  e.preventDefault();
  if (!selectedAccountId) {
    alert("Select an account first");
    return;
  }

  const amount = document.getElementById("depositAmount").value;
  const description = document.getElementById("depositDescription").value;

  try {
    const res = await fetch(
      `${API_BASE}/api/accounts/${selectedAccountId}/deposit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error depositing");
      return;
    }

    document.getElementById("depositForm").reset();
    await loadAccounts();
    renderAccountDetails(data);
  } catch (error) {
    console.error("Error deposit", error);
  }
}

// Withdraw
async function handleWithdraw(e) {
  e.preventDefault();
  if (!selectedAccountId) {
    alert("Select an account first");
    return;
  }

  const amount = document.getElementById("withdrawAmount").value;
  const description = document.getElementById("withdrawDescription").value;

  try {
    const res = await fetch(
      `${API_BASE}/api/accounts/${selectedAccountId}/withdraw`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error withdrawing");
      return;
    }

    document.getElementById("withdrawForm").reset();
    await loadAccounts();
    renderAccountDetails(data);
  } catch (error) {
    console.error("Error withdraw", error);
  }
}
