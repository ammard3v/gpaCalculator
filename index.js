import { defaultSubjects, defaultCredits, gradeOptions } from './data.js';

const gradePointMapping = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

function displaySemester(semesterNumber) {
  const semesterForms = document.querySelectorAll(".semesterForm");
  semesterForms.forEach((form) => {
    form.style.display = "none";
  });

  if (semesterNumber) {
    const selectedForm = document.querySelector(`.semesterForm:nth-of-type(${semesterNumber})`);
    if (selectedForm) {
      selectedForm.style.display = "block";
    }
  }
}

function generateOverallCGPAForm() {
  const overallInputsContainer = document.getElementById("overallInputsContainer");
  overallInputsContainer.innerHTML = '';

  for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber++) {
    const semesterDiv = document.createElement("div");
    semesterDiv.classList.add("semesterInput");
    semesterDiv.innerHTML = `
      Sem ${semesterNumber}
      <input type="text" id="credits${semesterNumber}"/>
    `;
    overallInputsContainer.appendChild(semesterDiv);
  }
}

function calculateOverallCGPA() {
  const overallResults = document.getElementById("overallResults");
  let totalCredits = 0;
  for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber++) {
    const input = document.getElementById(`credits${semesterNumber}`);
    const creditValue = parseFloat(input.value);

    if (!isNaN(creditValue) && creditValue > 0) {
      totalCredits += creditValue;
    }
  }
  const averageCredits = totalCredits / 8;
  overallResults.innerHTML = `<br>
    <strong>cGPA:<span class="gpa-value">${averageCredits.toFixed(2)}</span></strong>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const semesterSelect = document.getElementById("semesterSelect");
  const overallCGPASection = document.getElementById("overallCGPASection");

  for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber++) {
    const semesterDiv = document.createElement("div");
    semesterDiv.classList.add("semesterForm");
    semesterDiv.style.display = "none";

    const totalCredits = defaultCredits[semesterNumber].reduce((acc, credit) => acc + credit, 0);

    let formHtml = `
      <h3>Sem ${semesterNumber}</h3>
      <table>
        <thead>
          <tr><th>Subject</th><th>Credit</th><th>Grade</th></tr>
        </thead>
        <tbody>
    `;

    defaultSubjects[semesterNumber].forEach((subject, index) => {
      formHtml += `
        <tr>
          <td>${subject}</td>
          <td>${defaultCredits[semesterNumber][index]}</td>
          <td>
            <select name="grade${semesterNumber}-${index + 1}" required>
              ${gradeOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
          </td>
        </tr>
      `;
    });

    formHtml += `
        </tbody>
      </table>
      <div class="sem-credits"><br>Sem Credits: ${totalCredits}</div>
      <button class="submit-button" type="button" onclick="calculateGPA(${semesterNumber}, this)">
        <strong>Calculate GPA</strong>
      </button>
      <div class="gpaDisplay"></div>
    `;
    semesterDiv.innerHTML = formHtml;
    resultsContainer.appendChild(semesterDiv);
  }

  semesterSelect.addEventListener("change", function() {
    const selectedSemester = this.value;
    if (selectedSemester === "overall") {
      overallCGPASection.style.display = "block";
      generateOverallCGPAForm();
      document.querySelectorAll(".semesterForm").forEach((form) => form.style.display = "none");
    } else {
      overallCGPASection.style.display = "none";
      displaySemester(selectedSemester);
    }
  });

  document.getElementById("calculateOverallCGPA").addEventListener("click", calculateOverallCGPA);

  semesterSelect.value = "";
  displaySemester(semesterSelect.value);
});

window.calculateGPA = function (semesterNumber, button) {
  let formContainer = button.parentElement;
  let tableRows = formContainer.querySelectorAll("tbody tr");
  let totalCredits = 0;
  let totalWeightedGradePoints = 0;

  tableRows.forEach((row, index) => {
    let grade = row.querySelector(`select[name=grade${semesterNumber}-${index + 1}]`).value.toUpperCase();
    let credit = defaultCredits[semesterNumber][index];

    if (grade in gradePointMapping && !isNaN(credit) && credit > 0) {
      let gradePoint = gradePointMapping[grade];
      totalWeightedGradePoints += gradePoint * credit;
      totalCredits += credit;
    }
  });

  if (totalCredits > 0) {
    let gpa = totalWeightedGradePoints / totalCredits;
    let gpaDisplay = `
      <br><strong>GPA: <span class="gpa-value ${gpa >= 3.0 ? 'green' : 'red'}">${gpa.toFixed(2)}</span></strong>
    `;
    formContainer.querySelector(".gpaDisplay").innerHTML = gpaDisplay;
  } else {
    showError("No valid credits entered to calculate GPA.");
  }
};