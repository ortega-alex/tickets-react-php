import { UsuarioConstants } from '../_constants/index';
import Funciones from '../_helpers/Funciones';

export default function _usuarios(state = {}, action) {
    switch (action.type) {
        case UsuarioConstants.REQUEST:
            return {
                ...state
            };
        case UsuarioConstants.FAILURE:
            Funciones.message("error", action.err.toString());
            return {
                ...state
            };
        case UsuarioConstants.SUCCESS:
            Funciones.message(action.tipo, action.msj.toString());
            return {
                ...state,
                usuario: action.usuario
            };
        case UsuarioConstants.GET_USUARIOS_SUCCESS:
            return {
                ...state,
                usuarios: action.usuarios
            };
        case UsuarioConstants.GET_ROL_AC_SUCCESS:
            return {
                ...state,
                roles_activos: action.roles_activos
            };
        case UsuarioConstants.GET_PRF_AC_SUCCESS:
            return {
                ...state,
                perfiles_activos: action.perfiles_activos
            };
        case UsuarioConstants.GET_FICHA_USER_SUCCESS:
            return {
                ...state,
                tickets_usuario: action.data.tickets_usuario,
                tk_asignados: action.data.tk_asignados,
                historial_usuario: action.data.historial_usuario,
                permisos_usuario: action.data.permisos_usuario,
                pr_asignados: action.data.pr_asignados,
                departamentos_usuario: action.data.departamentos_usuario,
                dp_asignados: action.data.dp_asignados
            };
        case UsuarioConstants.GET_USRS_ACTIVOS:
            return {
                ...state,
                usuarios_activos: action.usuarios_activos
            };
        default:
            return state
    }
}