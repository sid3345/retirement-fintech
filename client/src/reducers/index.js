import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import sidebarReducer from './sidebarReducer';
import accountReducer from './accountReducer';
import balanceReducer from './balanceReducer';
import transactionsReducer from './transactionsReducer';
import liabilitiesReducer from './liabilitiesReducer';
import investmentsReducer from './investmentsReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    sidebar: sidebarReducer,
    plaid: accountReducer,
    balance: balanceReducer,
    transactions: transactionsReducer,
    liabilities: liabilitiesReducer,
    investments: investmentsReducer
});
