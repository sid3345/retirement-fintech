import { DEFAULT_KEY, generateCacheTTL } from 'redux-cache';

import { GET_INVESTMENTS, INVESTMENTS_LOADING } from '../actions/types';

const initialState = {
    [DEFAULT_KEY]: null,
    investmentsLoading: false,
    investments: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case INVESTMENTS_LOADING:
            return {
                ...state,
                investmentsLoading: true
            };
        case GET_INVESTMENTS:
            return {
                ...state,
                [DEFAULT_KEY]: generateCacheTTL(),
                investments: action.payload,
                investmentsLoading: false
            };
        default:
            return state;
    }
}
