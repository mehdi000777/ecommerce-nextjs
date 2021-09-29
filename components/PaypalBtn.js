import React, { useContext, useEffect, useRef } from 'react';
import { updateItem } from '../store/Actions';
import { DataContext } from '../store/GlobalState';
import { patchData } from '../utils/fetchData';

const PaypalBtn = ({ order }) => {
    const divRef = useRef();

    const { state, dispatch } = useContext(DataContext);
    const { auth, orders } = state;

    useEffect(() => {
        paypal.Buttons({
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: order.total
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.
                dispatch({ type: "NOTIFY", payload: { loading: true } })

                return actions.order.capture().then(function (details) {

                    patchData(`order/payment/${order._id}`, {
                        paymentId: details.payer.payer_id
                    }, auth.token)
                        .then(res => {
                            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                            dispatch(updateItem(orders, order._id, {
                                ...order,
                                paid: true,
                                dateOfPayment: details.create_time,
                                paymentId: details.payer.payer_id,
                                method: "Paypal"
                            }, "ADD_ORDERS"));

                            dispatch({ type: "NOTIFY", payload: { success: res.msg } });
                        })
                    // This function shows a transaction success message to your buyer.
                });
            }
        }).render(divRef.current);
        //This function displays Smart Payment Buttons on your web page.
    }, [])

    return (
        <div ref={divRef}>

        </div>
    )
}

export default PaypalBtn;
