import { useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import Loading from './Loading';
import Toast from './Toast';

const Notify = () => {
    const { state, dispatch } = useContext(DataContext);
    const { notify } = state;

    const closeHandler = () => {
        dispatch({ type: "NOTIFY", payload: {} });
    }

    return (
        <>
            {notify.loading && <Loading />}
            {notify.error && <Toast bgColor="bg-danger" title="Error" msg={notify.error} closeHandler={closeHandler} />}
            {notify.success && <Toast bgColor="bg-success" title="Success" msg={notify.success} closeHandler={closeHandler} />}
        </>
    )
}

export default Notify;
