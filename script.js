document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    let studentName = '';
    let averageCoro = 0;

    // --- DOM Elements ---
    const coroInputSection = document.getElementById('stage-coro-input');
    const resultsSection = document.getElementById('stage-results');
    const resetBtn = document.getElementById('resetBtn');

    const calculateCoroBtn = document.getElementById('calculateCoroBtn');

    // --- Event Listeners ---
    calculateCoroBtn.addEventListener('click', handleCoroCalculation);
    resetBtn.addEventListener('click', resetCalculator);

    // --- Functions ---
    function handleCoroCalculation() {
        // 1. Get and Validate Inputs
        studentName = document.getElementById('studentName').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const coroInputs = [
            document.getElementById('coro1').value, document.getElementById('coro2').value,
            document.getElementById('coro3').value, document.getElementById('coro4').value
        ];
        
        if (!studentName || !studentId || coroInputs.some(val => val === '')) {
            alert('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }

        const coroGrades = coroInputs.map(val => parseFloat(val));
        if (coroGrades.some(isNaN) || coroGrades.some(g => g < 0 || g > 100)) {
            alert('الرجاء إدخال درجات صحيحة بين 0 و 100.');
            return;
        }

        // 2. Calculate and Display
        averageCoro = coroGrades.reduce((sum, grade) => sum + grade, 0) / coroGrades.length;

        coroInputSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resetBtn.classList.remove('hidden');

        if (averageCoro >= 80) {
            // Success case
            resultsSection.innerHTML = `
                <div class="card">
                    <div class="card-header">النتيجة النهائية</div>
                    <div class="card-body">
                        <div class="result-message success">
                            <p>تهانينا يا <strong>${studentName}</strong>، لقد نجحت.</p>
                            <p>معدلك النهائي هو: <strong>${averageCoro.toFixed(2)}</strong></p>
                            <p>لست بحاجة لدخول الامتحان النهائي.</p>
                        </div>
                    </div>
                </div>`;
        } else {
            // Needs Final exam
            const minFinalGrade = Math.max(0, (60 - (0.60 * averageCoro)) / 0.40);
            
            let message;
            if (minFinalGrade > 100) {
                message = `<div class="result-message danger">
                                <p>للأسف يا <strong>${studentName}</strong>، لا يمكنك النجاح حتى لو حصلت على علامة كاملة في الفاينال.</p>
                                <p>متوسط الكورولات: <strong>${averageCoro.toFixed(2)}</strong></p>
                           </div>`;
            } else {
                message = `<div class="result-message warning">
                                <p>لا بأس يا <strong>${studentName}</strong>، لديك فرصة أخرى.</p>
                                <p>متوسط الكورولات: <strong>${averageCoro.toFixed(2)}</strong></p>
                                <p>أنت بحاجة لدخول الامتحان النهائي، وأقل درجة مطلوبة للنجاح هي: <strong>${minFinalGrade.toFixed(2)}</strong></p>
                           </div>
                           <hr>
                           <div class="input-group">
                                <label for="finalGrade">أدخل درجة الفاينال المتوقعة:</label>
                                <input type="number" id="finalGrade" min="0" max="100" placeholder="درجة الفاينال">
                           </div>
                           <button id="calculateFinalBtn" class="btn btn-primary">احسب نتيجة الفاينال</button>`;
            }
            resultsSection.innerHTML = `<div class="card"><div class="card-body">${message}</div></div>`;

            if (minFinalGrade <= 100) {
                document.getElementById('calculateFinalBtn').addEventListener('click', handleFinalCalculation);
            }
        }
    }

    function handleFinalCalculation() {
        const finalGrade = parseFloat(document.getElementById('finalGrade').value);
        if (isNaN(finalGrade) || finalGrade < 0 || finalGrade > 100) {
            alert('الرجاء إدخال درجة فاينال صحيحة.');
            return;
        }
        
        const finalCombined = (0.60 * averageCoro) + (0.40 * finalGrade);
        
        if (finalCombined >= 60) {
            resultsSection.innerHTML = `
                <div class="card">
                    <div class="card-header">النتيجة النهائية</div>
                    <div class="card-body">
                        <div class="result-message success">
                            <p>ممتاز يا <strong>${studentName}</strong>، لقد نجحت بعد الفاينال!</p>
                            <p>معدلك النهائي هو: <strong>${finalCombined.toFixed(2)}</strong></p>
                        </div>
                    </div>
                </div>`;
        } else {
            const minButtonlemaGrade = Math.max(0, (60 - (0.60 * averageCoro)) / 0.40);
            let message = `<div class="result-message danger">
                                <p>معدلك بعد الفاينال هو: <strong>${finalCombined.toFixed(2)}</strong></p>
                                <p>للأسف لم تنجح، ولكن ما زالت هناك فرصة أخيرة في البوتونليما.</p>
                                <p>أقل درجة مطلوبة للنجاح هي: <strong>${minButtonlemaGrade.toFixed(2)}</strong></p>
                           </div>
                           <hr>
                           <div class="input-group">
                                <label for="buttonlemaGrade">أدخل درجة البوتونليما المتوقعة:</label>
                                <input type="number" id="buttonlemaGrade" min="0" max="100" placeholder="درجة البوتونليما">
                           </div>
                           <button id="calculateButtonlemaBtn" class="btn btn-primary">احسب النتيجة النهائية</button>`;
                           
            resultsSection.innerHTML = `<div class="card"><div class="card-body">${message}</div></div>`;
            document.getElementById('calculateButtonlemaBtn').addEventListener('click', handleButtonlemaCalculation);
        }
    }

    function handleButtonlemaCalculation() {
        const buttonlemaGrade = parseFloat(document.getElementById('buttonlemaGrade').value);
        if (isNaN(buttonlemaGrade) || buttonlemaGrade < 0 || buttonlemaGrade > 100) {
            alert('الرجاء إدخال درجة بوتونليما صحيحة.');
            return;
        }

        const buttonlemaCombined = (0.60 * averageCoro) + (0.40 * buttonlemaGrade);

        let finalMessage;
        if (buttonlemaCombined >= 60) {
            finalMessage = `<div class="result-message success">
                                <p>ألف مبروك يا <strong>${studentName}</strong>، لقد نجحت!</p>
                                <p>معدلك النهائي هو: <strong>${buttonlemaCombined.toFixed(2)}</strong></p>
                            </div>`;
        } else {
            finalMessage = `<div class="result-message danger">
                                <p>للأسف يا <strong>${studentName}</strong>، لم يحالفك الحظ هذه المرة.</p>
                                <p>معدلك النهائي هو: <strong>${buttonlemaCombined.toFixed(2)}</strong></p>
                                <p>نتمنى لك حظًا أفضل في المستقبل.</p>
                            </div>`;
        }
        resultsSection.innerHTML = `<div class="card"><div class="card-header">النتيجة النهائية</div><div class="card-body">${finalMessage}</div></div>`;
    }

    function resetCalculator() {
        studentName = '';
        averageCoro = 0;
        
        // Reset all input fields in the form
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        
        // Hide results and show initial form
        resultsSection.innerHTML = '';
        resultsSection.classList.add('hidden');
        resetBtn.classList.add('hidden');
        coroInputSection.classList.remove('hidden');
    }
});
