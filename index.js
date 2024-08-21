const defaultSubjects = {
  1: [
    "English",
    "Mathematics I",
    "Digital Logic Systems",
    "Computer Fundamentals and Application",
    "Programming Logic and Techniques",
  ],
  2: [
    "Business Communication",
    "Mathematics II",
    "Financial Accounting I",
    "Programming Language in C",
    "Fundamentals of Electrical and Electronics",
    "Project I",
  ],
  3: [
    "Object Oriented Programming in C++",
    "Data Structure and Algorithms",
    "System Analysis and Design",
    "Financial Accounting II",
    "Microprocessor",
  ],
  4: [
    "Numerical Methods",
    "Visual Programming",
    "Operating Systems",
    "Database Management System",
    "Computer Graphics and Multimedia Technology",
    "Project II",
  ],
  5: [
    "Computer Architecture",
    "Java Programming",
    "Web Technology I",
    "Mathematical Foundation and Computer Science",
    "Software Engineering",
  ],
  6: [
    "Data Communication and Computer Network",
    "Fundamentals of Probability and Statistics",
    "Applied Economics",
    "Organization and Management",
    "Web Technology II",
    "Project III",
  ],
  7: [
    "E-Business",
    "Simulation and Modeling",
    "Linux",
    "Internship",
    "Elective I(.NET Programming)",
  ],
  8: [
    "Mobile Application and Development Technology",
    "Management Information System",
    "Elective II",
    "Project IV",
  ],
};
const defaultCredits = {
  1: [3, 3, 3, 3, 3],
  2: [3, 3, 3, 3, 3, 1],
  3: [3, 3, 3, 3, 3],
  4: [3, 3, 3, 3, 4, 2],
  5: [3, 3, 3, 3, 3],
  6: [3, 3, 3, 3, 3, 3],
  7: [3, 3, 3, 3, 3],
  8: [3, 3, 3, 4],
};
const gradeOptions = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "F",
];
document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber++) {
    const semesterDiv = document.createElement("div");
    semesterDiv.classList.add("semesterForm");
    const totalCredits = defaultCredits[semesterNumber].reduce(
      (acc, credit) => acc + credit,
      0
    );
    let formHtml = `<h3 style="text-align:center;padding-bottom:10px;">SEM ${semesterNumber}</h3>`;
    formHtml += "<table>";
    formHtml +=
      '<thead><tr><th style="text-align:left;">SUBJECT</th><th>CREDIT</th><th>GRADE</th></tr></thead>';
    formHtml += "<tbody>";
    defaultSubjects[semesterNumber].forEach((subject, index) => {
      formHtml += `<tr>`;
      formHtml += `<td>${subject}</td>`;
      formHtml += `<td>${defaultCredits[semesterNumber][index]}</td>`;
      formHtml += `<td><select name="grade${semesterNumber}-${
        index + 1
      }" required>`;
      gradeOptions.forEach((option) => {
        formHtml += `<option value="${option}">${option}</option>`;
      });
      formHtml += `</select></td>`;
      formHtml += `</tr>`;
    });
    formHtml += "</tbody>";
    formHtml += "</table>";
    formHtml += `<button class="submit-button" type="button" onclick="toggleButtonAndCalculateGPA(${semesterNumber}, this)"><strong>Calculate CGPA</strong></button>`;
    formHtml += `<div class="sem-credits">Sem Credits: ${totalCredits}</div>`;     
    formHtml += `<div class="gpaDisplay"></div>`;
    semesterDiv.innerHTML = formHtml;
    resultsContainer.appendChild(semesterDiv);
  }
  const summaryContainer = document.createElement("div");
  summaryContainer.id = "summaryContainer";
  summaryContainer.innerHTML = `
    <h3 style="color:green;">FINAL CERT:</h3>
    <p><strong>Total Cr&nbsp;&nbsp;: 0</strong></p>
    <p><strong>Total SGPA : 0.00</strong></p>
    <p><strong>CGPA: 0.00</strong></p>
    <p>
    <span style="color:green;font-weight:bold">Green:</span> 
    &gt;&nbsp;3 &nbsp;and&nbsp;
    <span style="color:red;font-weight:bold">Red:</span> &lt;&nbsp;3
    </p>
  `;
  resultsContainer.appendChild(summaryContainer);
});
function toggleButtonAndCalculateGPA(semesterNumber, button) {
  button.classList.toggle('clicked');
  calculateGPA(semesterNumber, button);
}
function calculateGPA(semesterNumber, button) {
  let formContainer = button.parentElement;
  let tableRows = formContainer.querySelectorAll("tbody tr");
  let totalCredits = 0;
  let totalWeightedGradePoints = 0;
  tableRows.forEach((row, index) => {
    let grade = row
      .querySelector(`select[name=grade${semesterNumber}-${index + 1}]`)
      .value.toUpperCase();
    let credit = defaultCredits[semesterNumber][index];
    let gradePointMapping = {
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
    if (
      grade in gradePointMapping &&
      !isNaN(credit) &&
      credit >= 1 &&
      credit <= 4
    ) {
      let gradePoint = gradePointMapping[grade];
      totalWeightedGradePoints += gradePoint * credit;
      totalCredits += credit;
    } else {
      alert(
        `Invalid input detected for Subject ${
          index + 1
        }. Please enter valid values.`
      );
      return;
    }
  });
  if (totalCredits > 0) {
    let gpa = totalWeightedGradePoints / totalCredits;
    let gpaDisplay = `<strong>GPA: <span class="gpa-value">${gpa.toFixed(2)}</span></strong>`;
    formContainer.querySelector(".gpaDisplay").innerHTML = gpaDisplay;
    let gpaValueElement = formContainer.querySelector(".gpa-value");
    if (gpa >= 3.0) {
      gpaValueElement.style.color = "green";
    } else {
      gpaValueElement.style.color = "red";
    }
    updateFinalSummary();
  } else {
    alert("No valid credits entered to calculate GPA.");
  }
}
function updateFinalSummary() {
  let totalCredits = 0;
  let totalWeightedGradePoints = 0;
  let totalGPAWeightedSum = 0;
  let semestersCount = 0;
  document.querySelectorAll(".semesterForm").forEach((semesterDiv, index) => {
    let gpaDisplay = semesterDiv.querySelector(".gpaDisplay");
    const gpaText = gpaDisplay.innerText.match(/GPA: (\d+\.\d+)/);
    if (gpaText) {
      const gpa = parseFloat(gpaText[1]);
      const semesterCredits = defaultCredits[index + 1].reduce((acc, credit) => acc + credit, 0);
      totalCredits += semesterCredits;
      totalWeightedGradePoints += gpa * semesterCredits;
      totalGPAWeightedSum += gpa;
      semestersCount++;
    }
  });
  let finalCGPA = totalCredits > 0 ? totalWeightedGradePoints / totalCredits : 0;
  let finalSGPA = semestersCount > 0 ? totalGPAWeightedSum / semestersCount : 0;
  const summaryContainer = document.getElementById("summaryContainer");
  let cgpaColor = finalCGPA >= 3.7 ? "green" : "red";
  summaryContainer.innerHTML = `
  <h3 style="color:green;">FINAL CERT:</h3>
  <p><strong>Total Cr&nbsp;&nbsp;: ${totalCredits}</strong></p>
  <p><strong>Total SGPA: ${finalSGPA.toFixed(2)}</strong></p>
  <p><strong>CGPA: <span class="cgpa-value" style="color: ${cgpaColor};">${finalCGPA.toFixed(2)}</span></strong></p>
  <p>
  <span style="color:green;font-weight:bold">GREEN:</span> 
  &gt;&nbsp;3 &nbsp;and&nbsp;
  <span style="color:red;font-weight:bold">RED:</span> &lt;&nbsp;3
  </p>
  <div>Developed by ammard3v</div>
  `;
}
