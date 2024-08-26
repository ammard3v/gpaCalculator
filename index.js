document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add('js-enabled');
});
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

function calculateTotalGPA() {
  document.getElementById('box0').style.display = 'none';
  function reloadPage() {
    window.location.reload();
}
  setTimeout(reloadPage, 2000);
  let totalGPA = 0;

  for (let i = 1; i <= 8; i++) {
    let gpaInput = document.getElementById(`gpa${i}`);
    let gpaValue = parseFloat(gpaInput.value);
    if (!isNaN(gpaValue) && gpaValue >= 0) {
      totalGPA += gpaValue;
    }
  }

  let averageGPA=totalGPA / 8;
  document.getElementById('here').innerHTML = "<br>CGPA: " + averageGPA.toFixed(2);
}
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

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const semesterSelect = document.getElementById("semesterSelect");
  const manualIN = document.getElementById("manualIN");

  for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber++) {
    const semesterDiv = document.createElement("div");
    semesterDiv.classList.add("semesterForm");
    semesterDiv.style.display = "none";

    const totalCredits = defaultCredits[semesterNumber].reduce(
      (acc, credit) => acc + credit, 0
    );

    let formHtml = "<h3>Semester " + semesterNumber + "</h3>";
    formHtml += "<table>";
    formHtml += '<thead><tr><td>Subject</td><td>Credit</td><td>Grade</td></tr></thead>';
    formHtml += "<tbody>";

    defaultSubjects[semesterNumber].forEach((subject, index) => {
      formHtml += `<tr>`;
      formHtml += `<td>${subject}</td>`;
      formHtml += `<td>${defaultCredits[semesterNumber][index]}</td>`;
      formHtml += `<td><select name="grade${semesterNumber}-${index + 1}" required>`;
      gradeOptions.forEach((option) => {
        formHtml += `<option value="${option}">${option}</option>`;
      });
      formHtml += `</select></td>`;
      formHtml += `</tr>`;
    });

    formHtml += "</tbody>";
    formHtml += "</table>";
    formHtml += `<div class="sem-credits">Sem Credits: ${totalCredits}</div>`;
    formHtml += `<button class="submit-button" type="button" onclick="calculateGPA(${semesterNumber}, this)"><strong>Calculate GPA</strong></button>`;
    formHtml += `<div class="gpaDisplay"></div>`;
    semesterDiv.innerHTML = formHtml;
    resultsContainer.appendChild(semesterDiv);
  }

  semesterSelect.addEventListener("change", function() {
    displaySemester(this.value);
    if (this.value) {
      manualIN.style.display = "none";
    } else {
      manualIN.style.display = "block";
    }
  });

  semesterSelect.value = "";
  displaySemester(semesterSelect.value);
});

window.calculateGPA = function (semesterNumber, button) {
  document.getElementById('box0').style.display = 'none';
  function reloadPage() {
    window.location.reload();
}
  setTimeout(reloadPage, 2000);
  let formContainer = button.parentElement;
  let tableRows = formContainer.querySelectorAll("tbody tr");
  let totalCredits = 0;
  let totalWeightedGradePoints = 0;

  tableRows.forEach((row, index) => {
    let grade = row.querySelector(`select[name=grade${semesterNumber}-${index + 1}]`).value.toUpperCase();
    let credit = defaultCredits[semesterNumber][index];

    if (grade in gradePointMapping && !isNaN(credit) && credit >= 1 && credit <= 4) {
      let gradePoint = gradePointMapping[grade];
      totalWeightedGradePoints += gradePoint * credit;
      totalCredits += credit;
    } else {
      alert(`Invalid input detected for Subject ${index + 1}. Please enter valid values.`);
      return;
    }
  });

  if (totalCredits > 0) {
    let gpa = totalWeightedGradePoints / totalCredits;
    let gpaDisplay = `<br><strong>GPA: <span class="gpa-value">${gpa.toFixed(2)}</span></strong>`;
    formContainer.querySelector(".gpaDisplay").innerHTML = gpaDisplay;
    let gpaValueElement = formContainer.querySelector(".gpa-value");
    if (gpa >= 3.0) {
      gpaValueElement.style.color = "green";
    } else {
      gpaValueElement.style.color = "red";
    }
  } else {
    alert("No valid credits entered to calculate GPA.");
  }
};

document.querySelector("#gpaInputForm button").addEventListener("click", calculateTotalGPA);
