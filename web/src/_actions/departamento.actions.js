import { DepartamentoConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: DepartamentoConstants.DPRT_REQUEST } }
function failure(err) { return { type: DepartamentoConstants.DPRT_FAILURE, err } }
function success(tipo, msj) { return { type: DepartamentoConstants.DPRT_SUCCESS, tipo, msj } }
function getDepartamentosSuccess(departamentos) { return { type: DepartamentoConstants.GET_DPRTS, departamentos } }
function getDepartamentosActivosSuccess(departamentos_activos) { return { type: DepartamentoConstants.GET_DPRTS_ACTIVOS, departamentos_activos } }
function getAsignacionesDepartamentoSucces(asignaciones_departamento) { return { type: DepartamentoConstants.GET_ASGN_DPRT, asignaciones_departamento } }

function getDepartamentos() {
    return dispatch => {
        dispatch(request());
        http._GET("departamento/departamento.php?get=true").then(res => {
            dispatch(getDepartamentosSuccess(res.departamentos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getDepartamentosActivos() {
    return dispatch => {
        dispatch(request());
        http._GET("departamento/departamento.php?get_activos=true").then(res => {
            dispatch(getDepartamentosActivosSuccess(res.departamentos_activos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addDepartemanto(data) {
    return dispatch => {
        dispatch(request());
        http._POST("departamento/departamento.php?add=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success('warning', res.msj));
            } else {
                dispatch(getDepartamentos());
                dispatch(success('success', res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getAsignacionesDepartamento(data) {
    return dispatch => {
        dispatch(request());
        http._POST("departamento/departamento.php?get_asignaciones_departamento=true", data).then(res => {
            dispatch(getAsignacionesDepartamentoSucces(res.asignaciones_departamento));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function cambiarEstadoDepartamento(data) {    
    return dispatch => {
        dispatch(request());
        http._POST("departamento/departamento.php?cambiar_estado_departamento=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success('warning', res.msj));
            } else {
                dispatch(getDepartamentos());
                dispatch(success('success', res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addAsignacion(data) {    
    return dispatch => {
        dispatch(request());
        http._POST("departamento/departamento.php?add_asignacion=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success('warning', res.msj));
            } else {
                dispatch(getAsignacionesDepartamento(data));
                dispatch(success('success', res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function cambiarEstadoAsignacion(data) {    
    return dispatch => {
        dispatch(request());
        http._POST("departamento/departamento.php?cambiar_estado_asignacion=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success('warning', res.msj));
            } else {
                dispatch(getAsignacionesDepartamento(data));
                dispatch(success('success', res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    getDepartamentos,
    getDepartamentosActivos,
    addDepartemanto,
    getAsignacionesDepartamento,
    cambiarEstadoDepartamento,
    addAsignacion,
    cambiarEstadoAsignacion
};