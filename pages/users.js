import { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import Spiner from '../components/Spiner';

const Users = () => {
    const { state, dispatch } = useContext(DataContext);
    const { users, auth } = state;

    if (!auth.user) return <Spiner />;
    return (
        <div className="table-responsive">
            <Head>
                <title>Users</title>
            </Head>

            <table className="table w-100" style={{ cursor: "pointer" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user._id}</td>
                                <td>
                                    <img src={user.avatar} alt={user.name}
                                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }} />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === "admin"
                                        ? user.root
                                            ? <i className="fas fa-check text-success"> Root</i>
                                            : <i className="fas fa-check text-success"></i>
                                        : <i className="fas fa-times text-danger"></i>}
                                </td>
                                <td>
                                    <Link href={auth.user.root && auth.user.email !== user.email
                                        ? `/edit_user/${user._id}`
                                        : "#!"
                                    }>
                                        <a><i className="fas fa-edit text-info me-2" title="Edit"></i></a>
                                    </Link>

                                    {
                                        auth.user.root && auth.user.email !== user.email
                                            ? <i className="fas fa-trash-alt text-danger ms-2" title="Remove"
                                                data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                aria-hidden="true"
                                                onClick={() =>
                                                    dispatch({
                                                        type: "MODAL", payload: {
                                                            type: "ADD_USERS",
                                                            data: users,
                                                            id: user._id,
                                                            title: user.name
                                                        }
                                                    })}></i>
                                            : <i className="fas fa-trash-alt text-danger ms-2" title="Remove"></i>
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Users;
