import axios from 'axios';
import { checkCacheValid } from 'redux-cache';
import {
    ADD_ACCOUNT,
    DELETE_ACCOUNT,
    GET_ACCOUNTS,
    ACCOUNTS_LOADING,
    GET_TRANSACTIONS,
    TRANSACTIONS_LOADING,
    GET_BALANCES,
    UPDATE_BALANCE,
    BALANCES_LOADING,
    GET_LIABILITIES,
    LIABILITIES_LOADING,
    GET_INVESTMENTS,
    INVESTMENTS_LOADING
} from './types';

// Add account
export const addAccount = plaidData => dispatch => {
    const accounts = plaidData.accounts;
    axios
        .post('/api/plaid/accounts/add', plaidData)
        .then(res =>
            dispatch({
                type: ADD_ACCOUNT,
                payload: res.data
            })
        )
        .then(data =>
            accounts
                ? dispatch(getLiabilities(accounts.concat(data.payload)), getInvestments(accounts.concat(data.payload)), getTransactions(accounts.concat(data.payload)))
                : null
        )
        .catch(err => console.log(err));
};

// Delete account
export const deleteAccount = plaidData => dispatch => {
    //if (window.confirm('Are you sure you want to remove this account?')) {
    const id = plaidData;

    axios
        .delete(`/api/plaid/accounts/${id}`)
        .then(res =>
            dispatch({
                type: DELETE_ACCOUNT,
                payload: id
            })
        )
        //.then(dispatch(getAccounts()))
        //.then(newAccounts ? dispatch(getTransactions(newAccounts)) : null)
        .catch(err => console.log(err));
    //}
};

// Get all accounts for specific user
export const getAccounts = () => (dispatch, getState) => {
    /* const isCacheValid = checkCacheValid(getState, 'plaid');
    if (isCacheValid) {
        return null;
    } */

    dispatch(setAccountsLoading());

    axios
        .get('/api/plaid/accounts')
        .then(res =>
            dispatch({
                type: GET_ACCOUNTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ACCOUNTS,
                payload: null
            })
        );
};

// Accounts loading
export const setAccountsLoading = () => {
    return {
        type: ACCOUNTS_LOADING
    };
};

// Get Transactions
export const getTransactions = plaidData => (dispatch, getState) => {
    // const isCacheValid = checkCacheValid(getState, 'transactions');
    // if (isCacheValid) {
    //     return null;
    // }

    dispatch(setTransactionsLoading());

    axios
        .post('/api/plaid/accounts/transactions', plaidData)
        .then(res =>
            dispatch({
                type: GET_TRANSACTIONS,
                payload: res.data
            })
           // console.log('transaction res: ',res))
        )
        .catch(err =>
            dispatch({
                type: GET_TRANSACTIONS,
                payload: null
            })
        );
};

// Transactions loading
export const setTransactionsLoading = () => {
    return {
        type: TRANSACTIONS_LOADING
    };
};

// Get Liablities
export const getLiabilities = plaidData => (dispatch, getState) => {
    // const isCacheValid = checkCacheValid(getState, 'liabilities');
    // if (isCacheValid) {
    //     return null;
    // }

    dispatch(setLiabilitiesLoading());

    axios
        .post('/api/plaid/accounts/liabilities', plaidData)
        .then(res =>
            dispatch({
                type: GET_LIABILITIES,
                payload: res.data
            })
          //  console.log('liablities res: ',res))
        )
        .catch(err =>
            dispatch({
                type: GET_LIABILITIES,
                payload: null
            })
        );
};

// Liablities loading
export const setLiabilitiesLoading = () => {
    return {
        type: LIABILITIES_LOADING
    };
};


// Get Investments
export const getInvestments = plaidData => (dispatch, getState) => {
    // const isCacheValid = checkCacheValid(getState, 'liabilities');
    // if (isCacheValid) {
    //     return null;
    // }

    dispatch(setInvestmentsLoading());

    axios
        .post('/api/plaid/accounts/investments', plaidData)
        .then(res =>
            dispatch({
                type: GET_INVESTMENTS,
                payload: res.data
            })
          //  console.log('investments res: ',res))
        )
        .catch(err =>
            dispatch({
                type: GET_INVESTMENTS,
                payload: null
            })
        );
};

// Investments loading
export const setInvestmentsLoading = () => {
    return {
        type: INVESTMENTS_LOADING
    };
};

// Get all account balances for a user
export const getBalances = plaidData => (dispatch, getState) => {
    /* const isCacheValid = checkCacheValid(getState, 'balance');
    if (isCacheValid) {
        return null;
    } */

    dispatch(setBalancesLoading());

    axios
        .post('/api/plaid/accounts/balance', plaidData)
        .then(res =>
            dispatch({
                type: GET_BALANCES,
                payload: res.data
            })
        )
        .catch(err => {
            console.error(err);
            dispatch({
                type: GET_BALANCES,
                payload: null
            });
        });
};

// Balances loading
export const setBalancesLoading = () => {
    return {
        type: BALANCES_LOADING
    };
};

// Get a specific account balance based on Account _id
export const getBalance = plaidData => dispatch => {
    dispatch(setBalancesLoading());

    axios
        .get('/api/plaid/accounts/balance/' + plaidData)
        .then(res => {
            dispatch({
                type: UPDATE_BALANCE,
                payload: res.data,
                _id: plaidData
            });
        })
        .catch(err => {
            console.error(err);
            dispatch({
                type: UPDATE_BALANCE,
                payload: null
            });
        });
};
