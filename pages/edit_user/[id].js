import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState';
import Spiner from '../../components/Spiner';
import { patchData } from '../../utils/fetchData';
import { updateItem } from '../../store/Actions';

const EditUser = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth, users } = state;

    const router = useRouter();
    const { id } = router.query;

    const [editUser, setEditUser] = useState();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = users.find(user => user._id === id);
        if (!user) return;

        setEditUser(user);
        setIsAdmin(user.role === "admin" ? true : false)
    }, [users])

    const updateHandler = () => {
        let role = isAdmin ? "admin" : "user";
        if (role === editUser.role) return;

        dispatch({ type: "NOTIFY", payload: { loading: true } });

        patchData(`user/${id}`, { role }, auth.token).then(res => {
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch(updateItem(users, id, { ...editUser, role }, "ADD_USERS"));

            dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        })
    }


    if (!editUser) return <Spiner />
    return (
        <div className="profile_page edit_user my-3">
            <Head>
                <title>Edit User</title>
            </Head>

            <div>
                <button className="btn btn-dark" onClick={() => router.back()}>
                    <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            </div>

            <div className="col-md-4 mx-auto my-4">
                <h3 className="text-uppercase text-secondary">Edit User</h3>

                <div className="form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" className="form-control" defaultValue={editUser.name}
                        disabled />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-control" defaultValue={editUser.email}
                        disabled />
                </div>

                <div className="form-check mb-3">
                    <label htmlFor="isAdmin" className="form-check-label" >IsAdmin</label>
                    <input type="checkbox" id="isAdmin" className="form-check-input" checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)} />
                </div>

                <button className="btn btn-dark" onClick={updateHandler}>
                    Update
                </button>
            </div>
        </div>
    )
}

export default EditUser;
