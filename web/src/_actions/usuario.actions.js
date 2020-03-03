import { AsyncStorage } from 'AsyncStorage';
import { UsuarioConstants } from '../_constants/index';
import http from '../_services/http.services';
import Funciones from '../_helpers/Funciones';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

function request() {
    Funciones.validarTiempoSession();
    return { type: UsuarioConstants.REQUEST }
}
function failure(err) { return { type: UsuarioConstants.FAILURE, err } }
function success(tipo, msj, usuario = {}) { return { type: UsuarioConstants.SUCCESS, tipo, msj, usuario } }
function getUsuariosSuccess(usuarios) { return { type: UsuarioConstants.GET_USUARIOS_SUCCESS, usuarios } }
function getRolesACTSuccess(roles_activos) { return { type: UsuarioConstants.GET_ROL_AC_SUCCESS, roles_activos } }
function getPerfilesACTSuccess(perfiles_activos) { return { type: UsuarioConstants.GET_PRF_AC_SUCCESS, perfiles_activos } }
function successGetFicha(data) { return { type: UsuarioConstants.GET_FICHA_USER_SUCCESS, data } }
function getActivosSuccess(usuarios_activos) { return { type: UsuarioConstants.GET_USRS_ACTIVOS, usuarios_activos } }

function login(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?login=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else if (res.usuario.restablecer == 0) {
                res.usuario.fecha = moment();
                AsyncStorage.setItem('login_tickets', JSON.stringify(res.usuario)).then(() => {
                    window.location.reload(true);
                });
            } else {
                dispatch(success("success", res.msj, res.usuario));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function changePass(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?change_pass=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function logout() {
    AsyncStorage.setItem('login_tickets', undefined).then(() => {
        window.location.reload();
    });
    return { type: UsuarioConstants.LOGIN, tipo: 'success', mjs: 'Se cerro la session exitosamente', usuario: {} };
}

function get() {
    return dispatch => {
        dispatch(request());
        http._GET("usuario/usuario.php?get=true").then(res => {
            dispatch(getUsuariosSuccess(res.usuarios));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getActivos() {
    return dispatch => {
        dispatch(request());
        http._GET("usuario/usuario.php?get_activos=true").then(res => {
            dispatch(getActivosSuccess(res.usuarios_activos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getRolesActivos() {
    return dispatch => {
        dispatch(request());
        http._GET("usuario/usuario.php?get_roles_activos=true").then(res => {
            dispatch(getRolesACTSuccess(res.roles_activos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getPerfilesActivos() {
    return dispatch => {
        dispatch(request());
        http._GET("usuario/usuario.php?get_perfiles_activos=true").then(res => {
            dispatch(getPerfilesACTSuccess(res.perfiles_activos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function save(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?save=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(get());
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function changeEstado(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?change_estado=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(get());
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function getFichaUsuaio(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?get_ficha_usuario=true", data).then(res => {
            dispatch(successGetFicha(res));
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function saveFicha(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?save_ficha=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function masivo(data) {
    return dispatch => {
        dispatch(request());
        http._POST("usuario/usuario.php?masivo=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

export default {
    login,
    changePass,
    logout,
    get,
    getActivos,
    getRolesActivos,
    getPerfilesActivos,
    save,
    changeEstado,
    getFichaUsuaio,
    saveFicha,
    masivo
};