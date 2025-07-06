// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global State ---
    let students = [];

    // --- DOM Elements ---
    const studentNameEl = document.getElementById('studentName');
    const studentIdEl = document.getElementById('studentId');
    const studentIndexEl = document.getElementById('studentIndex'); // For editing
    const coro1El = document.getElementById('coro1');
    const coro2El = document.getElementById('coro2');
    const coro3El = document.getElementById('coro3');
    const coro4El = document.getElementById('coro4');
    const finalGradeEl = document.getElementById('finalGrade');
    const buttonlemaGradeEl = document.getElementById('buttonlemaGrade');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsEl = document.getElementById('results');
    const tableBodyEl = document.getElementById('studentTableBody');

    // --- Main Functions ---

    const calculateAndSave = () => {
        // 1. Get and validate inputs
        const name = studentNameEl.value.trim();
        const id = studentIdEl.value.trim();
        if (!name || !id) {
            alert("الرجاء إدخال اسم الطالب ورقمه.");
            return;
        }

        const coroGrades = [
            parseFloat(coro1El.value), parseFloat(coro2El.value),
            parseFloat(coro3El.value), parseFloat(coro4El.value)
        ];
        if (coroGrades.some(isNaN)) {
            alert("الرجاء إدخال جميع درجات الكورولات بشكل صحيح.");
            return;
        }

        let finalGrade = finalGradeEl.value ? parseFloat(finalGradeEl.value) : null;
        let buttonlemaGrade = buttonlemaGradeEl.value ? parseFloat(buttonlemaGradeEl.value) : null;

        // 2. Perform calculations
        const averageCoro = coroGrades.reduce((sum, grade) => sum + grade, 0) / coroGrades.length;
        
        let studentStatus = "لم يحدد";
        let finalAverage = null;
        let resultText = `اسم الطالب: ${name}\nرقم الطالب: ${id}\nمتوسط الكورولات: ${averageCoro.toFixed(2)}\n\n`;

        if (averageCoro >= 80) {
            studentStatus = "ناجح (الكورولات)";
            finalAverage = averageCoro;
            resultText += "تهانينا! الطالب ناجح بناءً على متوسط الكورولات.";
        } else {
            resultText += "الطالب يحتاج إلى امتحان فاينال.\n";
            if (finalGrade !== null && !isNaN(finalGrade)) {
                const finalCombined = (0.60 * averageCoro) + (0.40 * finalGrade);
                resultText += `الدرجة الموزونة بعد الفاينال: ${finalCombined.toFixed(2)}\n`;
                if (finalCombined >= 60) {
                    studentStatus = "ناجح (الفاينال)";
                    finalAverage = finalCombined;
                    resultText += "تهانينا! الطالب ناجح بعد امتحان الفاينال.";
                } else {
                    resultText += "الطالب يحتاج إلى امتحان بوتونليما.\n";
                    if (buttonlemaGrade !== null && !isNaN(buttonlemaGrade)) {
                        const buttonlemaCombined = (0.60 * averageCoro) + (0.40 * buttonlemaGrade);
                        finalAverage = buttonlemaCombined;
                        resultText += `الدرجة الموزونة بعد البوتونليما: ${buttonlemaCombined.toFixed(2)}\n`;
                        studentStatus = (buttonlemaCombined >= 60) ? "ناجح (البوتونليما)" : "راسب";
                        resultText += `الحالة النهائية: ${studentStatus}.`;
                    }
                }
            }
        }
        
        // 3. Display results
        resultsEl.textContent = resultText;
        
        // 4. Save data if status is final
        if (studentStatus !== "لم يحدد") {
            const studentData = {
                name, id, coroGrades, finalGrade, buttonlemaGrade, studentStatus, finalAverage
            };

            const existingStudentIndex = studentIndexEl.value;
            if (existingStudentIndex) {
                // Update existing student
                students[parseInt(existingStudentIndex)] = studentData;
            } else {
                 // Or add new student (checking for duplicates by ID)
                const duplicateIndex = students.findIndex(s => s.id === id);
                if(duplicateIndex > -1){
                   students[duplicateIndex] = studentData;
                } else {
                   students.push(studentData);
                }
            }
           
            saveDataToLocalStorage();
            renderTable();
            resetForm();
        }
    };

    const resetForm = () => {
        studentNameEl.value = '';
        studentIdEl.value = '';
        studentIndexEl.value = ''; // Clear hidden index for editing
        coro1El.value = '';
        coro2El.value = '';
        coro3El.value = '';
        coro4El.value = '';
        finalGradeEl.value = '';
        buttonlemaGradeEl.value = '';
        resultsEl.textContent = 'النتائج ستظهر هنا...';
        studentNameEl.focus();
    };

    const renderTable = () => {
        tableBodyEl.innerHTML = ''; // Clear existing table
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            const avgCoro = student.coroGrades.reduce((a, b) => a + b, 0) / student.coroGrades.length;

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${avgCoro.toFixed(2)}</td>
                <td>${student.studentStatus}</td>
                <td>${student.finalAverage ? student.finalAverage.toFixed(2) : '---'}</td>
                <td>
                    <button class="btn-edit" data-index="${index}">تعديل</button>
                    <button class="btn-delete" data-index="${index}">حذف</button>
                </td>
            `;
            tableBodyEl.appendChild(row);
        });
    };

    const handleTableClick = (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('btn-delete')) {
            if (confirm(`هل أنت متأكد من حذف الطالب ${students[index].name}؟`)) {
                students.splice(index, 1); // Remove student from array
                saveDataToLocalStorage();
                renderTable();
            }
        } else if (e.target.classList.contains('btn-edit')) {
            const student = students[index];
            studentNameEl.value = student.name;
            studentIdEl.value = student.id;
            studentIndexEl.value = index; // Set hidden index for saving
            [coro1El.value, coro2El.value, coro3El.value, coro4El.value] = student.coroGrades;
            finalGradeEl.value = student.finalGrade || '';
            buttonlemaGradeEl.value = student.buttonlemaGrade || '';
            window.scrollTo(0, 0); // Scroll to top for easy editing
            studentNameEl.focus();
        }
    };
    
    // --- Local Storage Persistence ---
    const saveDataToLocalStorage = () => {
        localStorage.setItem('studentGradesData', JSON.stringify(students));
    };

    const loadDataFromLocalStorage = () => {
        const savedData = localStorage.getItem('studentGradesData');
        if (savedData) {
            students = JSON.parse(savedData);
        }
        renderTable();
    };


    // --- Event Listeners ---
    calculateBtn.addEventListener('click', calculateAndSave);
    resetBtn.addEventListener('click', resetForm);
    tableBodyEl.addEventListener('click', handleTableClick);

    // --- Initial Load ---
    loadDataFromLocalStorage();
});