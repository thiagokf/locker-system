const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

function selectProxyHost(req) {
    if (req.path.startsWith('/condominos'))
        return 'http://localhost:3001/';
    else if (req.path.startsWith('/locker'))
        return 'http://localhost:3002/';
    else if (req.path.startsWith('/entregas'))
        return 'http://localhost:3003/';
    else if (req.path.startsWith('/logs'))
        return 'http://localhost:3004/';
    else if (req.path.startsWith('/abrir-compartimento'))
        return 'http://localhost:3005/';
    else return null;
}

app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null)
        res.status(404).send('Not found');
    else
        httpProxy(proxyHost)(req, res, next);
});

app.listen(3000, () => {
    console.log('API Gateway iniciado!');
});