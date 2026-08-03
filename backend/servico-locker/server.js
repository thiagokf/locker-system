const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = new sqlite3.Database('./lockers.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível acessar o banco de dados.');
        throw err;
    }
    db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
        if (pragmaErr) console.log("Erro ao ativar Foreign Keys:", pragmaErr);
        else console.log("Verificação de Chaves Estrangeiras ATIVADA.");
    });
    console.log('Conectado ao SQLite!');
});

db.run(`CREATE TABLE IF NOT EXISTS lockers (
        id INTEGER PRIMARY KEY,
        localizacao TEXT NOT NULL)`,
    [], (err) => {
        if (err) {
            console.log('ERRO: não foi possível criar tabela.');
            throw err;
        }
    }
);

db.run(`CREATE TABLE IF NOT EXISTS compartimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locker_id INTEGER NOT NULL,
        tamanho TEXT NOT NULL CHECK(tamanho IN ('P', 'M', 'G', 'XG')),
        status TEXT NOT NULL DEFAULT 'LIVRE' CHECK(status IN ('LIVRE', 'OCUPADO')),
        FOREIGN KEY (locker_id) REFERENCES lockers(id))`,
    [], (err) => {
        if (err) {
            console.log('ERRO: não foi possível criar tabela.');
            throw err;
        }
    }
);

// cadastrar locker
app.post('/locker', (req, res) => {
    const { localizacao } = req.body

    db.run(`INSERT INTO lockers (localizacao) VALUES (?)`,
        [localizacao], (err) => {
            if (err) {
                console.log(err)
                res.status(500).json({ 'erro': 'Erro ao cadastrar locker' })
            } else {
                console.log('Cliente cadastrado com sucesso!');
                res.status(200).send('Cliente cadastrado com sucesso!');
            }
        }
    )
});

// get todos lockers
app.get('/locker', (req, res, next) => {
    db.all(`SELECT * FROM lockers`, [], (err, result) => {
        if (err) {
            console.log("Erro: " + err);
            res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// post compartimenos
app.post('/locker/compartimento', (req, res) => {
    const { locker_id, tamanho } = req.body
    
    db.run(`INSERT INTO compartimentos (locker_id, tamanho) VALUES (?, ?)`, [locker_id, tamanho.toUpperCase()], (err) => {
        if (err) {
            console.log(err)
            res.status(500).json({ 'erro': 'erro ao cadastrar compartimento' })
        } else {
            res.status(200).json({ 'menssage': 'compartimento cadastrado!' })
        }
    });
});

// get todos compartimentos
app.get('/locker/compartimento', (req, res) => {
    db.all(`SELECT * FROM compartimentos`, [], (err, result) => {
        if (err) {
            res.status(500).json({ 'erro': 'erro ao obter compartimentos' })
        } else if (!result) {
            res.status(404).json({ 'message': 'Nenhum compartimento econtrado' })
        } else {
            res.status(200).json(result)
        }
    });
});

// ge compartimento por id
app.get('/locker/compartimento/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM compartimentos WHERE id = ?`, [id], (err, result) => {
        if (err){
            res.status(500).json({ 'erro': 'erro ao obter compartimento' })
        } else if (!result){
            res.status(404).json({ 'message': 'Nenhum compartimento com esse id foi enconrtado' })
        } else {
            res.status(200).json(result)
        }
    });
});

// put no status do compartimento
app.patch('/locker/compartimento/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    db.run(`UPDATE compartimentos SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            res.status(500).json({ erro: 'erro ao atualizar status' })
        } else if (this.changes == 0) {
            res.status(404).json({ erro: 'id não encontrado'})
        } else {
            res.status(200).json({message: 'status do compartimento alterado'})
        }
    });
});

// Inicia o Servidor HTTP na porta 8090
let porta = 3002;
app.listen(porta, () => {
    console.log('Servidor em execução na porta: ' + porta);
});