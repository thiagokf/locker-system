const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// bd
var db = new sqlite3.Database('./condominos.db', (err) => {
    if (err) {
        console.log("erro ao conectar com sqlite")
        throw err;
    }
    console.log("conectado ao sqlite")
});

db.run(`CREATE TABLE IF NOT EXISTS condominos
    (id INTEGER PRIMARY KEY NOT NULL UNIQUE, nome VARCHAR, locker_id INTEGER)`,
    [], (err) => {
        if (err) {
            console.log("erro eu criar a tabela")
            throw err;
        }
    }
);

// cadastrar condomino
app.post('/condominos', (req, res) => {
    const { nome, locker_id } = req.body;

    if (!nome || !locker_id) {
        return res.status(400).json({ error: 'sem nome ou locker_id' })
    }

    db.run(`INSERT INTO condominos (nome, locker_id) VALUES (?, ?)`,
        [nome, locker_id], function (err) {
            if (err) {
                console.log(err)
                res.status(500).json({ 'erro': 'erro ao cadastrar o condomino' })
            } else {
                console.log("Condomino cadstrado")
                res.status(200).send("Condomino cadastrado com sucesso")
            }
        }
    )
});

// get todos os condominos
app.get('/condominos', (req, res) => {
    db.all(`SELECT * FROM condominos`, [], (err, result) => {
        if (err) {
            res.status(500).json({ 'erro': 'erro ao buscar condominos' })
        } else {
            res.status(200).send(result)
        }
    })
})

// get condominos por id
app.get('/condominos/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM condominos WHERE id = ?`,
        [id], (err, result) => {
            if (err) {
                res.status(500).json({ 'erro': 'erro ao buscar condomino'})
            } else if (!result) {
                res.status(404).json({ 'erro': 'condomino não encontrado'})
            } else {
                res.status(200).json(result)
            }
        }
    )
});

// iniciar serv
porta = 3001
app.listen(porta, () => {
    console.log("servidor rodanding na porta " + porta);
});