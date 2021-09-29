import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Spiner from '../components/Spiner';
import { DataContext } from '../store/GlobalState';
import { patchData } from '../utils/fetchData';
import { uploadImage } from '../utils/uploadImage';
import { registerValidate as valid } from '../utils/valid'

const Profile = () => {
    const initialState = {
        name: "",
        avatar: "",
        password: "",
        cf_Password: ""
    }
    const [data, setData] = useState(initialState);

    const { name, avatar, password, cf_Password } = data;

    const inputHandler = (e) => {
        const { name, value } = e.target;

        setData({ ...data, [name]: value });
    }

    const { state, dispatch } = useContext(DataContext);
    const { auth, orders } = state;

    useEffect(() => {
        if (auth.user) setData({ ...data, name: auth.user.name })
    }, [auth.user])

    const submitHandler = (e) => {
        e.preventDefault();

        if (password) {
            const errMsg = valid(auth.user.email, name, password, cf_Password);
            if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

            passwordChange()
        }

        if (name !== auth.user.name || avatar) {
            if (!name) return dispatch({ type: "NOTIFY", payload: { error: "Name does not exist." } });

            updateInfo();
        }

    }

    const passwordChange = () => {
        dispatch({ type: "NOTIFY", payload: { loading: true } });
        patchData("user/resetPassword", { password }, auth.token).then(res => {
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        })
    }

    const avatarHandler = (e) => {
        const file = e.target.files[0];

        if (!file)
            return dispatch({ type: "NOTIFY", payload: { error: "File does not exist." } });

        if (file.size > 1024 * 1024)
            return dispatch({ type: "NOTIFY", payload: { error: "This file lorgest 1m" } });

        if (file.type !== "image/jpeg" && file.type !== "image/png")
            return dispatch({ type: "NOTIFY", payload: { error: "File format is inccorect." } });

        setData({ ...data, avatar: file })
    }

    const updateInfo = async () => {
        let media;
        dispatch({ type: "NOTIFY", payload: { loading: true } });

        if (avatar) media = await uploadImage([avatar]);

        patchData("user", {
            avatar: avatar ? media[0].url : auth.user.avatar,
            name
        }, auth.token).then(res => {
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch({
                type: "AUTH", payload: {
                    token: auth.token,
                    user: res.user
                }
            })

            return dispatch({ type: "NOTIFY", payload: { success: res.msg } })
        })
    }

    if (!auth.user) return <Spiner />
    return (
        <div className="profile_page">
            <Head>
                <title>Profile</title>
            </Head>

            <section className="row text-secondary my-3">
                <div className="col-md-4">
                    <h3 className="text-uppercase text-center">
                        {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
                    </h3>

                    <form onSubmit={submitHandler}>
                        <div className="profile_avatar">
                            <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt="avatar" />
                            <span>
                                <i className="fas fa-camera"></i>
                                <p>Change</p>
                                <input type="file" name="file" id="file" accept="image/*" onChange={avatarHandler} />
                            </span>
                        </div>

                        <div className="form-group my-3">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" value={name}
                                onChange={inputHandler} />
                        </div>

                        <div className="form-group my-3">
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" id="email" className="form-control" defaultValue={auth.user.email}
                                disabled />
                        </div>

                        <div className="form-group my-3">
                            <label htmlFor="password">New Password</label>
                            <input type="password" name="password" id="password" className="form-control" value={password}
                                onChange={inputHandler} />
                        </div>

                        <div className="form-group  my-3">
                            <label htmlFor="cf_Password">Confirm New Password</label>
                            <input type="password" name="cf_Password" id="cf_Password" className="form-control" value={cf_Password}
                                onChange={inputHandler} />
                        </div>

                        <button type="submit" className="btn btn-info text-light">Update</button>
                    </form>
                </div>

                <div className="col-md-8">
                    <h3 className="text-uppercase">Orders</h3>
                    <div className="my-3 table-responsive">
                        <table className="table table-bordered table-hover w-100 text-uppercase"
                            style={{ minWidth: "600px", cursor: "pointer" }}>
                            <thead className="bg-light font-weight-bold">
                                <tr>
                                    <th className="py-2">id</th>
                                    <th className="py-2">date</th>
                                    <th className="py-2">total</th>
                                    <th className="py-2">delivered</th>
                                    <th className="py-2">paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map(item => (
                                        <tr key={item._id}>
                                            <td className="py-2">
                                                <Link href={`/order/${item._id}`}>
                                                    {item._id}
                                                </Link>
                                            </td>
                                            <td className="py-2">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-2">${item.total}</td>
                                            <td className="py-2">
                                                {
                                                    item.delivered
                                                        ? <i className="fas fa-check text-success d-block"></i>
                                                        : <i className="fas fa-times text-danger d-block"></i>
                                                }
                                            </td>
                                            <td className="py-2">
                                                {
                                                    item.paid
                                                        ? <i className="fas fa-check text-success d-block"></i>
                                                        : <i className="fas fa-times text-danger d-block"></i>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div >
    )
}

export default Profile;
