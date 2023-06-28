'use strict';

const express = require('express');

const server = express();

// Einbinden der Middleware, die die statischen Dateien ausliefert
server.use(express.static('public'));

// 80 ist der Standard-Port für HTTP
server.listen(80, err => console.log(err || 'Server läuft'));