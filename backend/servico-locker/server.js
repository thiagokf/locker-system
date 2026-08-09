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
        FOREIGN KEY (locker_id) 
            REFERENCES lockers(id)
            ON DELETE CASCADE)`,
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
                console.log('Locker cadastrado com sucesso!');
                res.status(200).send('Locker cadastrado com sucesso!');
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

// delete locker
app.delete('/locker/:id', (req,res) => {
    const { id } = req.params;
    console.log('na funcao delete')
    db.get(`SELECT * FROM lockers l 
        JOIN compartimentos c 
            ON l.id = c.locker_id 
        WHERE c.status = 'OCUPADO' AND l.id = ?`, [id], (err, result) => {        
        if (err) {
            res.status(500).send('Erro no servidor 1')
        } else if (result) {
            console.log(result)
            res.status(400).send('O locker escolhido possui compartimento ocupado');
        } else {
            console.log("nenhum compartimento ocupado")
            db.run(`DELETE CASCADE FROM lockers WHERE id = ?`, [id], (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).send('Erro no servidor2')
                } else {
                    res.status(200).send('Locker excluido com sucesso')
                }
            })
        }
    })
});

// post compartimenos
app.post('/locker/compartimento/:locker_id', (req, res) => {
    const { tamanho } = req.body;
    const { locker_id } = req.params;
    console.log(locker_id)

    if (!locker_id || !tamanho) {
        console.log("erro 1")
        return res.status(400).json({ erro: 'locker_id e tamanho são obrigatórios' });
    }

    const tamanhoNormalizado = String(tamanho).toUpperCase();

    db.get(`SELECT id FROM lockers WHERE id = ?`, [locker_id], (err, locker) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'erro ao validar locker' });
        }

        if (!locker) {
            return res.status(404).json({ erro: 'locker não encontrado' });
        }

        db.run(`INSERT INTO compartimentos (locker_id, tamanho) VALUES (?, ?)`, [locker_id, tamanhoNormalizado], (insertErr) => {
            if (insertErr) {
                console.log(insertErr);
                return res.status(500).json({ erro: 'erro ao cadastrar compartimento' });
            }

            res.status(200).json({ message: 'compartimento cadastrado!' });
        });
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

// get compartimentos por locker id
app.get('/locker/compartimento/:locker_id', (req, res) => {
    const { locker_id } = req.params;

    console.log("Na api")
    console.log(locker_id);

    db.all(`SELECT * FROM compartimentos WHERE locker_id = ?`, [locker_id], (err, result) => {
        if (err) {
            console.log("erro1")
            res.status(500).json({ 'erro': 'erro ao obter compartimentos' })
        } else if (!result) {
            console.log("erro2")
            res.status(404).send('O locker não possui comparimentos alocados')
        } else {
            res.status(200).json(result)
        }
    })
})
// get compartimento por id
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

// get compartimento de tamanho
app.get('/locker/compartimento/:id/:tamanho', (req, res) => {
    const { id, tamanho } = req.params;
    const tamanhoNormalizado = String(tamanho).toUpperCase();

    db.get(`SELECT * FROM compartimentos WHERE tamanho = ? AND locker_id = ? AND status = "LIVRE" ORDER BY id LIMIT 1`, [tamanhoNormalizado, id], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: 'erro no servidor' });
        }

        if (!result) {
            console.log('nenhum compartimento disponível');
            return res.status(404).json({ erro: 'Nenhum compartimento disponivel' });
        }

        return res.status(200).json(result);
    });
});

let porta = 3002;
app.listen(porta, () => {
    console.log('Servidor em execução na porta: ' + porta);
});