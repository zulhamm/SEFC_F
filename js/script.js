// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const luasCalculator = document.getElementById('luas-calculator');
const kelilingCalculator = document.getElementById('keliling-calculator');
const historySection = document.getElementById('history-section');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show relevant section
        const tab = btn.dataset.tab;
        if (tab === 'luas') {
            luasCalculator.style.display = 'block';
            kelilingCalculator.style.display = 'none';
            historySection.classList.remove('active');
        } else if (tab === 'keliling') {
            luasCalculator.style.display = 'none';
            kelilingCalculator.style.display = 'block';
            historySection.classList.remove('active');
        } else if (tab === 'history') {
            luasCalculator.style.display = 'none';
            kelilingCalculator.style.display = 'none';
            historySection.classList.add('active');
            loadHistory();
        }
    });
});

// Initialize history array
let calculationHistory = JSON.parse(localStorage.getItem('triangleCalculations')) || [];

// Area Calculation
document.getElementById('hitungLuas').addEventListener('click', function() {
    const alas = parseFloat(document.getElementById('alas').value);
    const tinggi = parseFloat(document.getElementById('tinggi').value);
    const alasError = document.getElementById('alas-error');
    const tinggiError = document.getElementById('tinggi-error');
    let valid = true;
    
    // Reset errors
    alasError.style.display = 'none';
    tinggiError.style.display = 'none';
    document.getElementById('alas').classList.remove('input-error');
    document.getElementById('tinggi').classList.remove('input-error');
    
    // Validate inputs
    if (isNaN(alas) || alas <= 0) {
        alasError.style.display = 'block';
        document.getElementById('alas').classList.add('input-error');
        valid = false;
    }
    
    if (isNaN(tinggi) || tinggi <= 0) {
        tinggiError.style.display = 'block';
        document.getElementById('tinggi').classList.add('input-error');
        valid = false;
    }
    
    if (!valid) return;
    
    // Calculate area
    const luas = 0.5 * alas * tinggi;
    const resultElement = document.getElementById('resultLuas');
    
    // Update result display
    document.getElementById('alas-value').textContent = alas;
    document.getElementById('tinggi-value').textContent = tinggi;
    document.getElementById('luas-result').textContent = luas.toFixed(2);
    resultElement.classList.add('active');
    
    // Add to history
    const calculation = {
        type: 'Luas',
        inputs: { alas, tinggi },
        result: luas,
        timestamp: new Date().toISOString()
    };
    calculationHistory.push(calculation);
    localStorage.setItem('triangleCalculations', JSON.stringify(calculationHistory));
});

// Perimeter Calculation
document.getElementById('hitungKeliling').addEventListener('click', function() {
    const sisiA = parseFloat(document.getElementById('sisiA').value);
    const sisiB = parseFloat(document.getElementById('sisiB').value);
    const sisiC = parseFloat(document.getElementById('sisiC').value);
    const sisiAError = document.getElementById('sisiA-error');
    const sisiBError = document.getElementById('sisiB-error');
    const sisiCError = document.getElementById('sisiC-error');
    let valid = true;
    
    // Reset errors
    sisiAError.style.display = 'none';
    sisiBError.style.display = 'none';
    sisiCError.style.display = 'none';
    document.getElementById('sisiA').classList.remove('input-error');
    document.getElementById('sisiB').classList.remove('input-error');
    document.getElementById('sisiC').classList.remove('input-error');
    
    // Validate inputs
    if (isNaN(sisiA) || sisiA <= 0) {
        sisiAError.style.display = 'block';
        document.getElementById('sisiA').classList.add('input-error');
        valid = false;
    }
    
    if (isNaN(sisiB) || sisiB <= 0) {
        sisiBError.style.display = 'block';
        document.getElementById('sisiB').classList.add('input-error');
        valid = false;
    }
    
    if (isNaN(sisiC) || sisiC <= 0) {
        sisiCError.style.display = 'block';
        document.getElementById('sisiC').classList.add('input-error');
        valid = false;
    }
    
    // Triangle inequality validation
    if (valid) {
        if (sisiA + sisiB <= sisiC || 
            sisiA + sisiC <= sisiB || 
            sisiB + sisiC <= sisiA) {
            alert('Panjang sisi tidak memenuhi ketidaksamaan segitiga! Jumlah dua sisi harus lebih besar dari sisi ketiga.');
            valid = false;
        }
    }
    
    if (!valid) return;
    
    // Calculate perimeter
    const keliling = sisiA + sisiB + sisiC;
    const resultElement = document.getElementById('resultKeliling');
    
    // Update result display
    document.getElementById('sisiA-value').textContent = sisiA;
    document.getElementById('sisiB-value').textContent = sisiB;
    document.getElementById('sisiC-value').textContent = sisiC;
    document.getElementById('keliling-result').textContent = keliling.toFixed(2);
    resultElement.classList.add('active');
    
    // Add to history
    const calculation = {
        type: 'Keliling',
        inputs: { sisiA, sisiB, sisiC },
        result: keliling,
        timestamp: new Date().toISOString()
    };
    calculationHistory.push(calculation);
    localStorage.setItem('triangleCalculations', JSON.stringify(calculationHistory));
});

// Reset functions
document.getElementById('resetLuas').addEventListener('click', function() {
    document.getElementById('alas').value = '';
    document.getElementById('tinggi').value = '';
    document.getElementById('resultLuas').classList.remove('active');
    document.getElementById('alas').classList.remove('input-error');
    document.getElementById('tinggi').classList.remove('input-error');
    document.getElementById('alas-error').style.display = 'none';
    document.getElementById('tinggi-error').style.display = 'none';
});

document.getElementById('resetKeliling').addEventListener('click', function() {
    document.getElementById('sisiA').value = '';
    document.getElementById('sisiB').value = '';
    document.getElementById('sisiC').value = '';
    document.getElementById('resultKeliling').classList.remove('active');
    document.getElementById('sisiA').classList.remove('input-error');
    document.getElementById('sisiB').classList.remove('input-error');
    document.getElementById('sisiC').classList.remove('input-error');
    document.getElementById('sisiA-error').style.display = 'none';
    document.getElementById('sisiB-error').style.display = 'none';
    document.getElementById('sisiC-error').style.display = 'none';
});

// History functions
function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="formula">Belum ada riwayat perhitungan</p>';
        return;
    }
    
    // Show latest first
    const reversedHistory = [...calculationHistory].reverse();
    
    reversedHistory.forEach(calc => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        let inputsText = '';
        if (calc.type === 'Luas') {
            inputsText = `Alas: ${calc.inputs.alas}, Tinggi: ${calc.inputs.tinggi}`;
        } else {
            inputsText = `Sisi A: ${calc.inputs.sisiA}, Sisi B: ${calc.inputs.sisiB}, Sisi C: ${calc.inputs.sisiC}`;
        }
        
        const date = new Date(calc.timestamp);
        const formattedDate = date.toLocaleString();
        
        item.innerHTML = `
            <div>
                <strong>${calc.type} Segitiga</strong>
                <div style="font-size: 0.9rem; color: var(--gray);">${inputsText}</div>
                <div style="font-size: 0.8rem; color: var(--gray);">${formattedDate}</div>
            </div>
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">
                ${calc.type === 'Luas' ? calc.result.toFixed(2) + ' satuan²' : calc.result.toFixed(2) + ' satuan'}
            </div>
        `;
        
        historyList.appendChild(item);
    });
}

document.getElementById('clearHistory').addEventListener('click', function() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat perhitungan?')) {
        calculationHistory = [];
        localStorage.setItem('triangleCalculations', JSON.stringify(calculationHistory));
        loadHistory();
    }
});

// Initialize with luas calculator active
kelilingCalculator.style.display = 'none';
historySection.classList.remove('active');