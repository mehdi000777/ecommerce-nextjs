import { useRouter } from 'next/router'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState';
import OrderDtails from '../../components/OrderDtails';


const OrderDetail = () => {

    const { state, dispatch } = useContext(DataContext);
    const { orders, auth } = state;

    const router = useRouter();

    const [details, setDetails] = useState([]);

    useEffect(() => {
        const order = orders.filter(item => item._id === router.query.id);

        setDetails(order);
    }, [orders])

    if (!auth.user) return null;
    return (
        <div className="my-3">
            <Head>
                <title>Order Details</title>
            </Head>

            <div>
                <button className="btn btn-dark" onClick={() => router.back()}>
                    <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            </div>
            <OrderDtails details={details} state={state} dispatch={dispatch} />
        </div>
    )
}

export default OrderDetail;
