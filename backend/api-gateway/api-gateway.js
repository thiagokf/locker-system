const cors =  require('cors');
const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));
app.use(cors());

function selectProxyHost(req) {
    if (req.path.startsWith('/locker'))
        return process.env.SERVICO_LOCKER_URL || 'http://localhost:3002/';
    else if (req.path.startsWith('/entregas'))
        return process.env.SERVICO_ENTREGAS_URL || 'http://localhost:3003/';
    else if (req.path.startsWith('/logs'))
        return process.env.SERVICO_LOGS_URL || 'http://localhost:3004/';
    else return null;
}

app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null)
        res.status(404).send('Not found');
    else
        httpProxy(proxyHost)(req, res, next);
});

app.listen(3000, '0.0.0.0', () => {
    console.log('API Gateway iniciado!');
});