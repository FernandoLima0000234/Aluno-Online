// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    fetch(`/profile/${userId}`)
        .then(response => response.json())
        .then(data => {
            const studentInfo = document.getElementById('student-info');
            studentInfo.innerHTML = `
                <p><strong>Nome:</strong> ${data.user.name}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Telefone:</strong> ${data.user.phone}</p>
            `;
        });

    fetch(`/courses/${userId}`)
        .then(response => response.json())
        .then(data => {
            const courseList = document.getElementById('course-list');
            data.courses.forEach(course => {
                const row = document.createElement('tr');

                const codeCell = document.createElement('td');
                codeCell.textContent = course.code;
                row.appendChild(codeCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = course.name;
                row.appendChild(nameCell);

                const professorCell = document.createElement('td');
                professorCell.textContent = course.professor;
                row.appendChild(professorCell);

                const scheduleCell = document.createElement('td');
                scheduleCell.textContent = course.schedule;
                row.appendChild(scheduleCell);

                const gradeCell = document.createElement('td');
                gradeCell.textContent = course.grade;
                row.appendChild(gradeCell);

                courseList.appendChild(row);
            });
        });
});
