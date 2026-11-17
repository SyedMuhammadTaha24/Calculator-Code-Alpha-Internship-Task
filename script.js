// 1. Select Elements
const previousOperandText = document.getElementById('previous-operand');
const currentOperandText = document.getElementById('current-operand');

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="equals"]');

// 2. Calculator State Variables
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// 3. Update Display Function
function updateDisplay() {
    currentOperandText.textContent = currentOperand;
    if (operation != null) {
        previousOperandText.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandText.textContent = '';
    }
}

// 4. Append Number or Decimal
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    // Prevent multiple decimals
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace initial '0' unless typing a decimal
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
}

// 5. Choose Operator (+, −, ×, ÷)
function chooseOperation(selectedOperation) {
    if (currentOperand === '' && previousOperand === '') return;

    // If user changes operator before typing next number
    if (currentOperand === '' && previousOperand !== '') {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousOperand !== '') {
        compute();
    }

    operation = selectedOperation;
    previousOperand = currentOperand;
    currentOperand = '';
}

// 6. Perform Calculation
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '−':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearAll();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Fix floating point precision issues (e.g., 0.1 + 0.2 = 0.30000000000000004)
    currentOperand = Math.round(computation * 100000000) / 100000000;
    currentOperand = currentOperand.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
}

// 7. Clear & Delete Functions
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
}

function deleteLast() {
    if (shouldResetScreen) return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// 8. Button Click Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.getAttribute('data-operator'));
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clearAll();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteLast();
    updateDisplay();
});

// 9. Bonus: Keyboard Support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
        updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        chooseOperation(opMap[e.key]);
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        compute();
        updateDisplay();
    } else if (e.key === 'Backspace') {
        deleteLast();
        updateDisplay();
    } else if (e.key === 'Escape') {
        clearAll();
        updateDisplay();
    }
});