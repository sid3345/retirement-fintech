import { DEFAULT_KEY, generateCacheTTL } from 'redux-cache';

import { GET_LIABILITIES, LIABILITIES_LOADING } from '../actions/types';

const initialState = {
    [DEFAULT_KEY]: null,
    liabilitiesLoading: false,
    liabilities: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LIABILITIES_LOADING:
            return {
                ...state,
                liabilitiesLoading: true
            };
        case GET_LIABILITIES:
            return {
                ...state,
                [DEFAULT_KEY]: generateCacheTTL(),
                liabilities: action.payload,
                liabilitiesLoading: false
            };
        default:
            return state;
    }
}
