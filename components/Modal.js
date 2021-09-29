import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import { deleteItem } from '../store/Actions';
import { DataContext } from '../store/GlobalState';
import { deleteData } from '../utils/fetchData';

const Modal = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth, modal } = state;

    const router = useRouter();

    const deleteHandler = () => {
        if (modal.type === "ADD_USERS") {
            dispatch({ type: "NOTIFY", payload: { loading: true } });
            deleteData(`user/${modal.id}`, null, auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                dispatch({ type: "NOTIFY", payload: { success: res.msg } });
            })
        }

        if (modal.type === "DELETE_PRODUCT") {
            dispatch({ type: "NOTIFY", payload: { loading: true } });
            deleteData(`product/${modal.id}`, null, auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                dispatch({ type: "NOTIFY", payload: { success: res.msg } });
            })
            router.push("/")
        }

        if (modal.type === "DELETE_ALL_PRODUCTS") {
            dispatch({ type: "NOTIFY", payload: { loading: true } });
            deleteData('product', { ids: modal.data }, auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                dispatch({ type: "NOTIFY", payload: { success: res.msg } });
            })
            router.push("/")
        }

        if (modal.type === "ADD_CATEGORIES") {
            dispatch({ type: "NOTIFY", payload: { loading: true } });
            deleteData(`category/${modal.id}`, null, auth.token).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                dispatch(deleteItem(modal.data, modal.id, modal.type));

                dispatch({ type: "NOTIFY", payload: { success: res.msg } });
            })
        }

        if (modal.type === "DELETE_PRODUCT" || modal.type === "ADD_CATEGORIES") return;

        dispatch(deleteItem(modal.data, modal.id, modal.type));
        dispatch({ type: "MODAL", payload: {} });
    }

    const closeHandler = () => {
        dispatch({ type: "MODAL", payload: {} });
    }

    return (
        <div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
                onClick={closeHandler}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-capitalize" id="exampleModalLabel">{modal.title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Do you want delete this item?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                onClick={deleteHandler}>Yes</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                onClick={closeHandler}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;
