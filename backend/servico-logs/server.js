
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = new sqlite3.Database('./logs.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível acessar o banco de dados.');
        throw err;
    }
    console.log("conectado ao SQLite3")
});

db.run(`CREATE TABLE IF NOT EXISTS logs_entregas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entrega_id INTEGER NOT NULL,
        compartimento_id INTEGER NOT NULL,
        condomino_id INTEGER NOT NULL,
        data_registro TEXT NOT NULL 
    )`,
    [], (err) => {
        if (err) console.log('Erro ao criar tabela de logs:', err);
    }
);

// post do log
app.post('/logs', (req, res) => {
    const { entrega_id, compartimento_id, condomino_id } = req.body

    db.run(`INSERT INTO logs_entregas (entrega_id, compartimento_id, condomino_id, data_registro) VALUES (?, ? ,? ,?)`, [entrega_id, compartimento_id, condomino_id, new Date().toISOString()], (err) => {
        if (err) {
            res.status(500).json({ 'erro': 'erro ao regisrtar log da entrega' });
        } else {
            res.status(200).json({ 'message': 'Log registrado!' })
        }
    });
});

// get de todos os logs
app.get('/logs', (req, res) => {
    db.all(`SELECT * FROM logs_entregas`, [], (err, result) => {
        if (err) {
            res.status(500).json({ 'erro': 'erro ao pegar dados dos logs de entrega' });
        } else if (!result) {
            res.status(404).json({ 'message': 'Nenhum log foi registrado' })
        } else {
            res.status(200).json(result)
        }
    });
});

porta = 3004;
app.listen(porta, () => {
    console.log("Servidor rodando na porta", porta);
});