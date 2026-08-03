const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// post abrir compartimento
app.post('/abrir-compartimento', (req, res) =>{
    const { locker_id, compartimento_id } = req.body

    if (!locker_id || !compartimento_id){
        res.status(400).json({ 'erro': 'id do locker e id do compartimento são necessários' });
    }
    console.log("---------------------------------------")
    console.log(`Compartimento ${compartimento_id} do locker ${locker_id} foi aberto`)
    console.log("---------------------------------------")

    res.status(200).json({ 'message': `Compartimento ${compartimento_id} do locker ${locker_id} foi aberto`});
});

porta = 3005;
app.listen(porta, () => {
    console.log('Servidor rodando na porta', porta);
});