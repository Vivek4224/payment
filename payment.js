let selectedAmount = 0;
let customerName = '';
let selectedMethod = '';

function updateAmount() {
    const planSelect = document.getElementById('planSelect');
    const amountSpan = document.getElementById('amount');
    const cashAmount = document.getElementById('cashAmount');
    selectedAmount = parseInt(planSelect.value) || 0;
    amountSpan.textContent = selectedAmount;
    cashAmount.textContent = selectedAmount;
}

function showCreditCard() {
    hideAllForms();
    document.getElementById('credit-card-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showCreditCard"]').classList.add('active');
    selectedMethod = 'Credit Card';
}

function showDebitCard() {
    hideAllForms();
    document.getElementById('debit-card-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showDebitCard"]').classList.add('active');
    selectedMethod = 'Debit Card';
}

function showNetBanking() {
    hideAllForms();
    document.getElementById('net-banking-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showNetBanking"]').classList.add('active');
    selectedMethod = 'Net Banking';
}

function showUPI() {
    hideAllForms();
    document.getElementById('upi-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showUPI"]').classList.add('active');
    selectedMethod = 'UPI';
}

function showCash() {
    hideAllForms();
    const cashForm = document.getElementById('cash-form');
    if (cashForm) {
        cashForm.classList.remove('hidden');
        document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('button[onclick="showCash"]').classList.add('active');
        selectedMethod = 'Cash';
    } else {
        console.error("Error: 'cash-form' element not found.");
    }
}

function hideAllForms() {
    const forms = document.getElementsByClassName('payment-form');
    for (let form of forms) {
        form.classList.add('hidden');
    }
}

function confirmPayment(method) {
    const planSelect = document.getElementById('planSelect');
    const successMessage = document.getElementById('successMessage');
    const successCustomerName = document.getElementById('successCustomerName');
    const successAmount = document.getElementById('successAmount');

    if (planSelect.value === "0") {
        alert("Please select a plan before confirming payment!");
        return;
    }

    let nameInput;
    if (method === 'credit') {
        nameInput = document.getElementById('customerNameCredit').value;
    } else if (method === 'debit') {
        nameInput = document.getElementById('customerNameDebit').value;
    } else if (method === 'netbanking') {
        nameInput = document.getElementById('customerNameNetBanking').value;
    } else if (method === 'upi') {
        nameInput = document.getElementById('customerNameUPI').value;
    }

    if (!nameInput) {
        alert("Please enter your name!");
        return;
    }

    customerName = nameInput;
    selectedAmount = planSelect.value;  // ✅ Ensure the selected amount is stored
    selectedPlanText = planSelect.options[planSelect.selectedIndex].text;  // ✅ Store selected plan text
    selectedMethod = method;

    successAmount.textContent = "₹" + selectedAmount;
    successCustomerName.textContent = customerName;

    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
        successMessage.classList.add('hidden');
    }, 5000);

    hideAllForms();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    downloadReceipt();  // ✅ Call downloadReceipt() after amount is stored properly
}



function confirmCashPayment() {
    const planSelect = document.getElementById('planSelect');
    const successMessage = document.getElementById('successMessage');
    const successCustomerName = document.getElementById('successCustomerName');
    const successAmount = document.getElementById('successAmount');

    if (planSelect.value === "0") {
        alert("Please select a plan before confirming payment!");
        return;
    }

    customerName = "Guest";
    selectedAmount = planSelect.value;  // <-- FIX: Store selected amount for cash payment
    selectedMethod = "Cash";

    successAmount.textContent = "₹" + selectedAmount;
    successCustomerName.textContent = customerName;
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
        successMessage.classList.add('hidden');
    }, 5000);

    planSelect.value = "0";
    updateAmount();
    hideAllForms();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    downloadReceipt();
}


function goBack() {
    hideAllForms();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    alert('Going back to the previous step!');
}

function downloadReceipt() {
    if (window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [150, 200] // Custom receipt size
        });

        // Set solid background color (Blue-Purple)
        doc.setFillColor(30, 58, 138); // Dark Blue color
        doc.rect(0, 0, 150, 200, "F"); // Fill entire background

        // Set font and text color (white)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("MuscleMatrix Gym", 75, 20, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Membership Payment Receipt", 75, 30, { align: "center" });

        // White separator line
        doc.setDrawColor(255, 255, 255);
        doc.line(20, 35, 130, 35);

        // Add Receipt Details
        doc.setFontSize(12);
        let yPosition = 50;
        doc.text("Customer Name: " + customerName, 20, yPosition);
        yPosition += 10;
        doc.text("Selected Plan: " + selectedPlanText, 20, yPosition);
        yPosition += 10;
        doc.text("Amount Paid: ₹" + selectedAmount, 20, yPosition);
        yPosition += 10;
        doc.text("Payment Method: " + selectedMethod, 20, yPosition);
        yPosition += 10;
        doc.text("Date & Time: " + new Date().toLocaleString(), 20, yPosition);
        yPosition += 10;

        // Another separator
        doc.line(20, yPosition, 130, yPosition);
        yPosition += 10;

        // Thank you message
        doc.setFontSize(14);
        doc.setTextColor(255, 215, 0); // Gold Yellow for highlight
        doc.text("Thank you for choosing MuscleMatrix Gym!", 75, yPosition, { align: "center" });

        // Save the PDF
        doc.save(`Payment_Receipt_${customerName}.pdf`);
    } else {
        console.error("jsPDF library is not loaded.");
        alert("PDF library is missing. Please ensure the jsPDF script is included in your HTML.");
    }
}

function getSelectedMethod() {
    return selectedMethod || "Unknown Method";
}