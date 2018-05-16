import {createStore, combineReducers,applyMiddleware} from 'redux';
import * as setting from './setting/reducer';
import logger from 'redux-logger'

let store = createStore(combineReducers({...setting}),applyMiddleware(logger));
export default store;
