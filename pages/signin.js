import Cookie from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';

const Signin = () => {
    const router = useRouter();

    const initialState = {
        email: "",
        password: "",
    }
    const [user, setUser] = useState(initialState);
    const { email, password } = user;

    const inputHandler = (e) => {
        const { value, name } = e.target;
        setUser({ ...user, [name]: value });
    }

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const submitHandler = async (e) => {
        e.preventDefault();

        dispatch({ type: "NOTIFY", payload: { loading: true } });

        const res = await postData("/auth/login", user);

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
                <title>Sign in page</title>
            </Head>

            <form className="mx-auto my-4" style={{ maxWidth: "500px" }} onSubmit={submitHandler}>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        onChange={inputHandler} value={email} />
                    <div id="emailHelp" className="form-text">We`ll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" id="exampleInputPassword1"
                        onChange={inputHandler} value={password} />
                </div>

                <button type="submit" className="btn btn-dark w-100">Login</button>

                <p className="my-2">
                    You don`t have account?
                    <Link href="/register">
                        <a style={{ color: "crimson" }}> Register Now</a>
                    </Link>
                </p>

            </form>
        </div>
    )
}

export default Signin;
