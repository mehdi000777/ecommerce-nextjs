import { createContext, useEffect, useReducer } from "react";
import { getData } from "../utils/fetchData";
import { reducers } from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = { notify: {}, auth: {}, cart: [], modal: {}, orders: [], users: [], categories: [] };
    const [state, dispatch] = useReducer(reducers, initialState)
    const { cart, auth } = state;

    useEffect(() => {
        const firstLogin = localStorage.getItem("firstLogin");

        if (firstLogin) {
            getData("/auth/refreshToken").then(res => {
                if (res.err) return localStorage.removeItem("firstLogin");

                dispatch({
                    type: "AUTH", payload: {
                        token: res.access_token,
                        user: res.user
                    }
                })
            })
        }
    }, [])

    useEffect(() => {
        const __set__cart01__ecommerce = JSON.parse(localStorage.getItem("__set__cart01__ecommerce"));

        if (__set__cart01__ecommerce) dispatch({ type: "ADD_CART", payload: __set__cart01__ecommerce })
    }, [])

    useEffect(() => {
        localStorage.setItem("__set__cart01__ecommerce", JSON.stringify(cart))
    }, [cart])

    useEffect(() => {
        if (auth.token) {
            getData("order", auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } })

                dispatch({ type: "ADD_ORDERS", payload: res.orders })
            })
        }

        if (auth.user && auth.user.role === "admin") {
            getData("user", auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                dispatch({ type: "ADD_USERS", payload: res.users });
            })
        }
        else {
            dispatch({ type: "ADD_ORDERS", payload: [] });
            dispatch({ type: "ADD_USERS", payload: [] });
        }
    }, [auth.token, auth.user])

    useEffect(() => {
        getData("category").then(res => {
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch({ type: "ADD_CATEGORIES", payload: res.categories });
        })
    }, [])

    return (
        < DataContext.Provider value={{ state, dispatch }} >
            {children}
        </DataContext.Provider >
    )
}