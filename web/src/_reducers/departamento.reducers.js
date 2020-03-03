import { DepartamentoConstants } from '../_constants/index';
import Funciones from '../_helpers/Funciones';

export default function _departamentos(state = {}, action) {
    switch (action.type) {
        case DepartamentoConstants.DPRT_REQUEST:
            return {
                ...state
            };
        case DepartamentoConstants.DPRT_FAILURE:
            Funciones.message("error", action.err.toString());
            return {
                ...state
            };
        case DepartamentoConstants.DPRT_SUCCESS:
            Funciones.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case DepartamentoConstants.GET_DPRTS:
            return {
                ...state,
                departamentos: action.departamentos
            };
        case DepartamentoConstants.GET_ASGN_DPRT:
            return {
                ...state,
                asignaciones_departamento: action.asignaciones_departamento
            };
        case DepartamentoConstants.GET_DPRTS_ACTIVOS:
            return {
                ...state,
                departamentos_activos: action.departamentos_activos
            };
        default:
            return state
    }
}