import { message as Message } from 'antd';
import { AsyncStorage } from 'AsyncStorage';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

function quitarTildes(val) {
    return val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function remplazarEspacios_(val) {
    return val.replace(/ /g, '_');
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function message(typo, menssage) {
    Message.config({
        top: 50
    });
    Message[typo](menssage);
}

function ordenarArrAcendente(arr) {
    arr.sort(function (a, b) { return a - b; });
    return arr;
}

function tiene_letras(texto) {
    var letras = "abcdefghyjklmnñopqrstuvwxyz";
    texto = texto.toLowerCase();
    for (var i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) !== -1) {
            return true;
        }
    }
    return false;
}

function multiple(valor, multiple) {
    var resto = valor % multiple;
    if (resto == 0)
        return true;
    else
        return false;
}

async function validarTiempoSession() {
    await AsyncStorage.getItem('login_tickets', (err, res) => {
        if (!err && res && res != "undefined") {
            var usuario = JSON.parse(res);
            var actual = moment();
            if (usuario.fecha && actual.diff(usuario.fecha, 'hours') >= 8) {
            //     usuario.fecha = actual;
            //     AsyncStorage.setItem('login_tickets', JSON.stringify(usuario)).then(() => {
            //         return true;
            //     });
            // } else {
                AsyncStorage.setItem('login_tickets', undefined).then(() => {
                    window.location.reload(true);
                });
            }
        }
    });
}

const funciones = {
    quitarTildes,
    remplazarEspacios_,
    commaSeparateNumber,
    message,
    ordenarArrAcendente,
    tiene_letras,
    multiple,
    validarTiempoSession
}

export default funciones;