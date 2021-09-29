import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { registerValidate } from '../utils/valid';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const Register = () => {
    const router = useRouter();

    const initialState = {
        name: "",
        email: "",
        password: "",
        cf_password: ""
    }
    const [user, setUser] = useState(initialState);
    const { name, email, password, cf_password } = user;

    const inputHandler = (e) => {
        const { value, name } = e.target;
        setUser({ ...user, [name]: value });
    }

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const submitHandler = async (e) => {
        e.preventDefault();

        const errMsg = registerValidate(email, name, password, cf_password);
        if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

        dispatch({ type: "NOTIFY", payload: { loading: true } });

        const res = await postData("/auth/register", user);

        if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "NOTIFY", payload: { success: res.msg } });

        dispatch({
            type: "AUTH", payload: {
                token: res.access_token,
                user: res.user
            }
        });

        Cookie.set("refreshToken", res.refresh_token, {
            path: "api/auth/refreshToken",
            expires: 7
        })

        localStorage.setItem("firstLogin", true);
    }

    useEffect(() => {
        if (auth.token) {
            router.push("/");
        }
    }, [auth])

    return (
        <div>
            <Head>
                <title>Register page</title>
            </Head>

            <form className="mx-auto my-4" style={{ maxWidth: "500px" }} onSubmit={submitHandler}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" name="name" className="form-control" id="name"
                        onChange={inputHandler} value={name} />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp"
                        onChange={inputHandler} value={email} />
                    <div id="emailHelp" className="form-text">We`ll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" id="password"
                        onChange={inputHandler} value={password} />
                </div>

                <div className="mb-3">
                    <label htmlFor="cf_password" className="form-label">Confirm Password</label>
                    <input type="password" name="cf_password" className="form-control" id="cf_password"
                        onChange={inputHandler} value={cf_password} />
                </div>

                <button type="submit" className="btn btn-dark w-100">Register</button>

                <p className="my-2">
                    Already have account?
                    <Link href="/signin">
                        <a style={{ color: "crimson" }}> Login Now</a>
                    </Link>
                </p>

            </form>
        </div>
    )
}

export default Register;
