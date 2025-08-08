document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const studentIdInput = document.getElementById('studentId');
    const gradeInputs = document.querySelectorAll('.grade-input');
    const resetBtn = document.getElementById('resetBtn');
    const loadBtn = document.getElementById('loadBtn');

    const coroResultEl = document.getElementById('coroResult');
    const finalResultEl = document.getElementById('finalResult');
    const buttonlemaResultEl = document.getElementById('buttonlemaResult');
    
    const finalExamSection = document.getElementById('finalExamSection');
    const buttonlemaExamSection = document.getElementById('buttonlemaExamSection');

    // --- Local Storage Functions ---
    const saveGrades = () => {
        const studentId = studentIdInput.value;
        if (!studentId) return;

        const grades = {};
        gradeInputs.forEach(input => {
            if (input.id.startsWith('coro')) {
                grades[input.id] = input.value;
            }
        });
        localStorage.setItem(`grades_${studentId}`, JSON.stringify(grades));
    };

    const loadGrades = () => {
        const studentId = studentIdInput.value;
        if (!studentId) return;

        const savedGrades = localStorage.getItem(`grades_${studentId}`);
        if (savedGrades) {
            const grades = JSON.parse(savedGrades);
            for (const coroId in grades) {
                const input = document.getElementById(coroId);
                if (input) {
                    input.value = grades[coroId];
                }
            }
            calculateResults();
        }
    };

    // --- Main Calculation Function ---
    const calculateResults = () => {
        resetResultSections();
        
        const coroInputs = [
            document.getElementById('coro1'), document.getElementById('coro2'),
            document.getElementById('coro3'), document.getElementById('coro4'),
            document.getElementById('coro5'), document.getElementById('coro6')
        ];
        const coroGrades = coroInputs.map(input => parseFloat(input.value));
        if (coroGrades.some(isNaN) || coroGrades.length < 6) return;

        const averageCoro = coroGrades.reduce((sum, grade) => sum + grade, 0) / coroGrades.length;
        coroResultEl.style.display = 'block';
        coroResultEl.className = 'result-section info';
        coroResultEl.innerHTML = `متوسط الكورولات: <strong>${averageCoro.toFixed(2)}</strong>`;
        
        if (averageCoro >= 80) {
            coroResultEl.className = 'result-section success';
            coroResultEl.innerHTML += `<br><strong>النتيجة: ناجح</strong> (لا تحتاج لفاينال).`;
            return;
        }

        finalExamSection.classList.remove('hidden');
        const minFinalGrade = (60 - (0.60 * averageCoro)) / 0.40;
        
        if (minFinalGrade > 100) {
            coroResultEl.className = 'result-section fail';
            coroResultEl.innerHTML += `<br>تحتاج لدرجة ${minFinalGrade.toFixed(2)} في الفاينال، وهذا غير ممكن. <strong>النتيجة: راسب</strong>.`;
            return;
        }

        coroResultEl.innerHTML += `<br>أنت بحاجة لفاينال. أقل درجة مطلوبة للنجاح هي: <strong>${minFinalGrade.toFixed(2)}</strong>`;

        const finalGrade = parseFloat(document.getElementById('finalGrade').value);
        if (isNaN(finalGrade)) return;

        const finalCombined = (0.60 * averageCoro) + (0.40 * finalGrade);
        finalResultEl.style.display = 'block';

        if (finalCombined >= 60) {
            finalResultEl.className = 'result-section success';
            finalResultEl.innerHTML = `معدلك النهائي هو: <strong>${finalCombined.toFixed(2)}</strong><br><strong>النتيجة: ناجح</strong>.`;
            return;
        }

        finalResultEl.className = 'result-section fail';
        finalResultEl.innerHTML = `معدلك بعد الفاينال هو: <strong>${finalCombined.toFixed(2)}</strong>. للأسف لم تنجح.`;
        
        buttonlemaExamSection.classList.remove('hidden');
        const minButtonlemaGrade = minFinalGrade;
        finalResultEl.innerHTML += `<br>أنت بحاجة لبوتونليما. أقل درجة مطلوبة للنجاح هي: <strong>${minButtonlemaGrade.toFixed(2)}</strong>`;

        const buttonlemaGrade = parseFloat(document.getElementById('buttonlemaGrade').value);
        if (isNaN(buttonlemaGrade)) return;

        const buttonlemaCombined = (0.60 * averageCoro) + (0.40 * buttonlemaGrade);
        buttonlemaResultEl.style.display = 'block';

        if (buttonlemaCombined >= 60) {
            buttonlemaResultEl.className = 'result-section success';
            buttonlemaResultEl.innerHTML = `معدلك النهائي بعد البوتونليما هو: <strong>${buttonlemaCombined.toFixed(2)}</strong><br><strong>النتيجة: ناجح</strong>.`;
        } else {
            buttonlemaResultEl.className = 'result-section fail';
            buttonlemaResultEl.innerHTML = `معدلك النهائي بعد البوتونليما هو: <strong>${buttonlemaCombined.toFixed(2)}</strong><br><strong>النتيجة: راسب</strong>.`;
        }
    };

    // --- Helper Functions ---
    const resetResultSections = () => {
        [coroResultEl, finalResultEl, buttonlemaResultEl].forEach(el => {
            el.style.display = 'none';
            el.innerHTML = '';
        });
        finalExamSection.classList.add('hidden');
        buttonlemaExamSection.classList.add('hidden');
    };

    const resetAll = () => {
        gradeInputs.forEach(input => input.value = '');
        studentIdInput.value = '';
        resetResultSections();
    };

    // --- Event Listeners ---
    gradeInputs.forEach(input => input.addEventListener('input', () => {
        calculateResults();
        saveGrades(); // Save grades every time an input changes
    }));
    studentIdInput.addEventListener('input', () => {
        // Option to auto-load when student ID is entered
        // loadGrades();
    });
    loadBtn.addEventListener('click', loadGrades);
    resetBtn.addEventListener('click', resetAll);
});
