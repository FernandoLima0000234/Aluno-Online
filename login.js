

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (!username || !password) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    const hashedPassword = hashPassword(password);

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            localStorage.setItem('userId', data.userId);
            window.location.href = 'aluno-online/home.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    });
});


function hashPassword(password) {
   
    return password.split('').reverse().join('');
}
