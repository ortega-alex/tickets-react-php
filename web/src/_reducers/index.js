import { combineReducers } from 'redux';

import _usuarios from './usuario.reducers';
import _tickets from './ticket.reducers';

export default combineReducers({
    _usuarios,
    _tickets
});