import { TicketConstants } from '../_constants/index';
import http from '../_services/http.services';
import Funciones from '../_helpers/Funciones';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

function request() {
    Funciones.validarTiempoSession();
    return { type: TicketConstants.TCKT_REQUEST }
}
function failure(err) { return { type: TicketConstants.TCKT_FAILURE, err } }
function success(tipo, msj) { return { type: TicketConstants.TCKT_SUCCESS, tipo, msj } }
function getCategoriasSuccess(categorias) { return { type: TicketConstants.GET_CTGR_TCKT_SUCCESS, categorias } }
function getTicketsCategoriasSuccess(tickets_categoria) { return { type: TicketConstants.GET_TCKT_CTGR_SUCCESS, tickets_categoria } }
function getPreguntasSuccess(preguntas) { return { type: TicketConstants.GET_PTGS_SUCCESS, preguntas } }
function getPreguntasActivasSuccess(data) { return { type: TicketConstants.GET_PTGS_ACT_SUCCESS, data } }

function getCategorias() {
    return dispatch => {
        dispatch(request());
        http._GET("ticket/ticket.php?get_categorias=true").then(res => {
            dispatch(getCategoriasSuccess(res.categorias));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getTicketsCategorias(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?get_tickets_categorias=true", data).then(res => {
            dispatch(getTicketsCategoriasSuccess(res.tickets_categoria));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getPreguntas() {
    return dispatch => {
        dispatch(request());
        http._GET("ticket/ticket.php?get_preguntas=true").then(res => {
            dispatch(getPreguntasSuccess(res.preguntas));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getPreguntasActivas() {
    return dispatch => {
        dispatch(request());
        http._GET("ticket/ticket.php?get_preguntas_activas=true").then(res => {
            dispatch(getPreguntasActivasSuccess(res));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function addCategoria(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?add_categoria=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(getCategorias());
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getPreguntasCategoria(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?get_preguntas_categoria=true", data).then(res => {
            dispatch(getPreguntasActivasSuccess(res));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function cambioEstadoCategoria(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?cambio_estado_categoria=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(getTicketsCategorias(data));
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function addTicket(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?add_ticket=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(getTicketsCategorias(data));
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function addPregunta(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?add_pregunta=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(getPreguntas());
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function cambioEstadoPregunta(data) {
    return dispatch => {
        dispatch(request());
        http._POST("ticket/ticket.php?cambio_estado_pregunta=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(getPreguntas());
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

export default {
    getCategorias,
    getTicketsCategorias,
    getPreguntas,
    addCategoria,
    getPreguntasCategoria,
    cambioEstadoCategoria,
    addTicket,
    getPreguntasActivas,
    addPregunta,
    cambioEstadoPregunta
};