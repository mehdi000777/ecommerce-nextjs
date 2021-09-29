import { Actions } from './Actions';


export const reducers = (state, action) => {
    switch (action.type) {
        case Actions.NOTIFY:
            return {
                ...state,
                notify: action.payload
            }
        case Actions.AUTH:
            return {
                ...state,
                auth: action.payload
            }
        case Actions.ADD_CART:
            return {
                ...state,
                cart: action.payload
            }
        case Actions.UPDATE_CART:
            return {
                ...state,
                cart: action.payload
            }
        case Actions.MODAL:
            return {
                ...state,
                modal: action.payload
            }
        case Actions.ADD_ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        case Actions.ADD_USERS:
            return {
                ...state,
                users: action.payload
            }
        case Actions.ADD_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        default:
            return state;
    }
}