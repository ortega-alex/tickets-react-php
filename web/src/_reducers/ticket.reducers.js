import { TicketConstants } from '../_constants/index';
import Funciones from '../_helpers/Funciones';

export default function _tickets(state = {}, action) {
    switch (action.type) {
        case TicketConstants.TCKT_REQUEST:
            return {
                ...state
            };
        case TicketConstants.TCKT_FAILURE:
            Funciones.message("error", action.err.toString());
            return {
                ...state
            };
        case TicketConstants.TCKT_SUCCESS:
            Funciones.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case TicketConstants.GET_CTGR_TCKT_SUCCESS:
            return {
                ...state,
                categorias: action.categorias
            };
        case TicketConstants.GET_TCKT_CTGR_SUCCESS:
            return {
                ...state,
                tickets_categoria: action.tickets_categoria
            };
        case TicketConstants.GET_PTGS_SUCCESS:
            return {
                ...state,
                preguntas: action.preguntas
            };
        case TicketConstants.GET_PTGS_ACT_SUCCESS:
            return {
                ...state,
                preguntas_activas: action.data.preguntas_activas,
                total_calificacion: action.data.total,
                _ids_preguntas: action.data.ids_preguntas
            };
        default:
            return state
    }
}