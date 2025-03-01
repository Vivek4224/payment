let selectedAmount = 0;
let customerName = '';

function updateAmount() {
    const planSelect = document.getElementById('planSelect');
    const amountSpan = document.getElementById('amount');
    const cashAmount = document.getElementById('cashAmount');
    selectedAmount = planSelect.value;
    amountSpan.textContent = selectedAmount;
    cashAmount.textContent = selectedAmount;
}

function showCreditCard() {
    hideAllForms();
    document.getElementById('credit-card-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showCreditCard"]').classList.add('active');
}

function showDebitCard() {
    hideAllForms();
    document.getElementById('debit-card-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showDebitCard"]').classList.add('active');
}

function showNetBanking() {
    hideAllForms();
    document.getElementById('net-banking-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showNetBanking"]').classList.add('active');
}

function showUPI() {
    hideAllForms();
    document.getElementById('upi-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showUPI"]').classList.add('active');
}

function showCash() {
    hideAllForms();
    document.getElementById('cash-form').classList.remove('hidden');
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="showCash"]').classList.add('active');
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
    successAmount.textContent = selectedAmount;
    successCustomerName.textContent = customerName;
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        successMessage.classList.add('hidden');
    }, 5000);

    // Reset the selection and forms
    planSelect.value = "0";
    updateAmount();
    hideAllForms();
    document.getElementById('creditForm').reset();
    document.getElementById('debitForm').reset();
    document.getElementById('netBankingForm').reset();
    document.getElementById('upiForm').reset();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    // Generate and download PDF receipt
    generatePDF();
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

    successAmount.textContent = selectedAmount;
    successCustomerName.textContent = "Guest"; // Default for cash (no name input)
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        successMessage.classList.add('hidden');
    }, 5000);

    // Reset the selection
    planSelect.value = "0";
    updateAmount();
    hideAllForms();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    // Generate and download PDF receipt
    generatePDF();
}

function goBack() {
    hideAllForms();
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    alert('Going back to the previous step!');
}

function downloadReceipt() {
    if (window.jspdf) { // Ensure jsPDF is loaded
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Define colors
        const primaryColor = [0, 102, 204]; // Blue
        const secondaryColor = [255, 69, 0]; // Red (for dividers)
        const textColor = [50, 50, 50]; // Dark gray text

        // Set title style
        doc.setFont("helvetica", "bold");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Blue title
        doc.setFontSize(18);
        doc.text("Gym Membership Payment Receipt", 105, 20, { align: "center" });

        // Draw a red line under title
        doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.setLineWidth(1);
        doc.line(20, 25, 190, 25);

        // Set font for details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        // Ensure selected values are correct
        const selectedPlan = document.getElementById('planSelect');
        const selectedPlanText = selectedPlan.selectedOptions.length > 0 ? selectedPlan.selectedOptions[0].text : "Not Selected";
        const paymentMethod = getSelectedMethod() || "Not Specified";

        // Payment details
        let yPosition = 40;
        doc.text(`🧑 Customer Name: ${customerName || 'Guest'}`, 20, yPosition);
        yPosition += 10;
        doc.text(`📜 Selected Plan: ${selectedPlanText}`, 20, yPosition);
        yPosition += 10;
        doc.text(`💰 Amount Paid: ₹${selectedAmount}`, 20, yPosition);
        yPosition += 10;
        doc.text(`💳 Payment Method: ${paymentMethod}`, 20, yPosition);
        yPosition += 10;
        doc.text(`📅 Date & Time: ${new Date().toLocaleString()}`, 20, yPosition);

        // Add another red separator line
        yPosition += 10;
        doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        // Add a thank-you message
        doc.setFontSize(14);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("🎉 Thank you for choosing our gym! Stay fit & healthy!", 105, yPosition, { align: "center" });

        // Save the PDF
        doc.save(`Gym_Payment_Receipt_${customerName || 'Guest'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } else {
        console.error("jsPDF library is not loaded.");
        alert("PDF library is missing. Please ensure the jsPDF script is included in your HTML.");
    }
}




function getSelectedMethod() {
    const activeBtn = document.querySelector('.payment-btn.active');
    return activeBtn ? activeBtn.textContent : 'Unknown Method';
}