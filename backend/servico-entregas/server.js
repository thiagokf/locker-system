const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const axios = require('axios');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = new sqlite3.Database('./entregas.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível acessar o banco de dados.');
        throw err;
    }
    console.log("conectado ao SQLite3")
});

db.run(`CREATE TABLE IF NOT EXISTS entregas (
        id INTEGER PRIMARY KEY,
        locker_id INTEGER NOT NULL,
        compartimento_id INTEGER NOT NULL,
        tamanho_pedido TEXT NOT NULL,
        codigo_retirada TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK(status IN ('PENDENTE', 'RETIRADA'))
    )`
);

// get entregas
app.get('/entregas', (req, res) => {
    db.all(`SELECT * FROM entregas`, [], (err, result) => {
        if (err) {
            res.status(500).json({ erro: 'erro ao buscar entregas' })
        } else {
            res.status(200).json(result)
        }
    });
});

// post depositar entregas
app.post('/entregas/depositar', async (req, res) => {
    try {
        const { locker_id, tamanho_pedido } = req.body;

        if (!locker_id || !tamanho_pedido) {
            return res.status(400).json({ erro: 'locker_id e tamanho_pedido são obrigatórios' });
        }

        //achar compartimento livre
        const resCompartimentos = await axios.get(`http://localhost:3002/locker/compartimento/${locker_id}/${tamanho_pedido}`)
        const compartimentoDisponivel = resCompartimentos.data


        const compartimento_id = compartimentoDisponivel.id
        console.log(compartimentoDisponivel);
        //gerar token de retirada (frufru)
        const tokenRetirada = Math.random().toString(36).substring(2, 6).toUpperCase();

        //response
        db.run(`INSERT INTO entregas (locker_id, compartimento_id, tamanho_pedido, codigo_retirada) VALUES (?, ?, ?, ?)`, [locker_id, compartimento_id, tamanho_pedido, tokenRetirada], async (err) => {
            if (err) {
                console.log(err)
                res.status(500).json({ erro: 'erro ao registrar entrega' })
            } else {
                //depositar entrega (patch no compartimento p/ ocupado)
                const depositar = await axios.patch(`http://localhost:3002/locker/compartimento/${compartimento_id}/status`, {
                    status: 'OCUPADO'
                })
                res.status(200).json({ message: `entrega registrada! codigo para retirada: ${tokenRetirada}` })
            }
        });

    } catch (erro) {
        console.error('Erro em /entregas/depositar:', erro && (erro.message || erro));
        if (erro.response && erro.response.status === 404) {
            return res.status(404).json({ erro: "Dado não cadastrado" });
        }
        return res.status(500).json({ erro: "Serviço fora do ar." });
    }
})

app.post('/entregas/retirada/:codigo_retirada', (req, res) => {
    const { codigo_retirada } = req.params

    db.get(`SELECT * FROM entregas WHERE codigo_retirada = ? and status = "PENDENTE"`, [codigo_retirada], async (err, row) => {
        if (err) {
            res.status(500).json({ erro: 'erro no servidor' })
        } else if (!row) {
            res.status(404).json({ erro: 'entrega não encontrada' })
        } else {
            console.log(row)
            const { id, locker_id, compartimento_id } = row

            const dados_comp = {
                locker_id: locker_id,
                compartimento_id: compartimento_id
            }

            // notifica foi compartimento aberto
            const abrir_comprtimento = await axios.post('http://localhost:3005/abrir-compartimento', dados_comp)

            // liberar o compartimento (ocupado --> livre)
            const liberar_compartimento = await axios.patch(`http://localhost:3002/locker/compartimento/${compartimento_id}/status`, {
                status: 'LIVRE'
            });

            // criar log
            const dados_log = {
                entrega_id: id,
                compartimento_id: compartimento_id
            }
            const log = await axios.post(`http://localhost:3004/logs`, dados_log)

            // atualizar status da entrega
            db.run(`UPDATE entregas SET status = 'RETIRADA' WHERE id = ?`, [id], (err) => {
                if (err) {
                    res.status(500).json({ erro: 'erro ao atualizar status da entrega' })
                } else {
                    res.status(200).json({ message: 'Sucesso ao retirar entrega' })
                }
            })
        }
    });
});

porta = 3003
app.listen(porta, () => {
    console.log("Servidor rodando na porta " + porta)
})