const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const connection = require('./db');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            if (bcrypt.compareSync(password, user.password)) {
                res.json({ success: true, userId: user.id });
            } else {
                res.json({ success: false, message: 'Senha incorreta' });
            }
        } else {
            res.json({ success: false, message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length > 0) {
            const user = rows[0];
            res.json({ user });
        } else {
            res.status(404).send('Aluno não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.get('/courses/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `
            SELECT courses.code, courses.name, courses.professor, courses.schedule, grades.grade
            FROM courses
            JOIN grades ON courses.id = grades.course_id
            WHERE grades.user_id = ?;
        `;
        const [rows] = await connection.query(query, [userId]);
        res.json({ courses: rows });
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
