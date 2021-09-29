import React from 'react'
import Link from 'next/link';
import PaypalBtn from './PaypalBtn';
import { patchData } from '../utils/fetchData';
import { updateItem } from '../store/Actions';

const OrderDtails = ({ details, state, dispatch }) => {

    const { auth, orders } = state;

    const deliveredHandler = (order) => {
        dispatch({ type: "NOTIFY", payload: { loading: true } });
        patchData(`order/delivered/${order._id}`, null, auth.token).then(res => {
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch(updateItem(orders, order._id, { ...res.order, user: order.user }, "ADD_ORDERS"));

            dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        })
    }

    return (
        <>
            {
                details.map(order => (
                    <div key={order._id} style={{ margin: "20px auto" }} className="d-flex justify-content-around">
                        <div className="text-uppercase my-3">
                            <h2 className="text-break">Order {order._id}</h2>
                            <div className="mt-4 text-secondary">
                                <h3>Shipping</h3>
                                <p>Name: {order.user.name}</p>
                                <p>Email: {order.user.email}</p>
                                <p>Address: {order.address}</p>
                                <p>Mobile: {order.mobile}</p>
                            </div>
                            <div className={`alert ${order.delivered ? "alert-success" : "alert-danger"} d-flex 
                                justify-content-between align-items-center`} role="alert">
                                {
                                    order.delivered ? `Delivered on ${order.updatedAt}` : "Not Delivered"
                                }
                                {
                                    auth.user.role === "admin" && !order.delivered &&
                                    <button className="btn btn-dark text-uppercase" onClick={() => deliveredHandler(order)}>
                                        Mark as delivered
                                    </button>
                                }
                            </div>
                            <h3>Payment</h3>
                            {
                                order.method && <h6>Method: <em>{order.method}</em></h6>
                            }

                            {
                                order.paymentId && <p>Payment Id: <em>{order.paymentId}</em></p>
                            }
                            <div className={`alert ${order.paid ? "alert-success" : "alert-danger"} d-flex 
                                justify-content-between align-items-center`} role="alert">
                                {
                                    order.paid ? `Paid on ${order.dateOfPayment}` : "Not Paid"
                                }
                            </div>
                            <div>
                                <h3>Order Items</h3>
                                {
                                    order.cart.map(item => (
                                        <div key={item._id} className="d-flex border-bottom mx-0 p-2 justify-content-between 
                                            align-items-center" style={{ maxWidth: "550px" }}>
                                            <img src={item.images[0].url} alt={item.title}
                                                style={{ width: "50px", height: "45px", objectFit: "cover" }} />

                                            <h5 className="flex-fill p-3 text-secondary">
                                                <Link href={`/product/${item._id}`}>
                                                    <a>{item.title}</a>
                                                </Link>
                                            </h5>

                                            <span className="text-info">
                                                {item.quantity} × {item.price} = {item.quantity * item.price}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {
                            !order.paid && auth.user.role !== "admin" &&
                            <div className="p-3">
                                <h2 className="mb-3 text-uppercase">Total: ${order.total}</h2>
                                <PaypalBtn order={order} />
                            </div>
                        }
                    </div>
                ))
            }
        </>
    )
}

export default OrderDtails
