import React, { useContext } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DataContext } from '../store/GlobalState';
import Cookie from 'js-cookie';

const Nav = () => {
    const router = useRouter();
    const pathName = router.pathname;

    const { state, dispatch } = useContext(DataContext);
    const { auth, cart } = state;

    const isActive = (path) => {
        if (pathName === path) return "active";
        return "";
    }

    const cartStyle = {
        background: "#ed143dc2",
        borderRadius: "50%",
        padding: "3px 6px",
        top: "-10px",
        right: "-10px",
        color: "#fff",
        fontSize: "14px"
    }

    const logoutHandler = () => {
        Cookie.remove("refreshToken", { path: "api/auth/refreshToken" });
        localStorage.removeItem("firstLogin");
        dispatch({ type: "AUTH", payload: {} });
        dispatch({ type: "NOTIFY", payload: { success: "Logout Success!" } });
        return router.push("/signin")
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/users">
                    <a className="dropdown-item">Users</a>
                </Link>
                <Link href="/create">
                    <a className="dropdown-item">Products</a>
                </Link>
                <Link href="/categories">
                    <a className="dropdown-item">Categories</a>
                </Link>
            </>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link href="/">
                    <a className="navbar-brand">E-Commerce</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/cart">
                                <a className={`nav-link ${isActive("/cart")}`} aria-current="page">
                                    <i className="fas fa-shopping-cart position-relative">
                                        <span className="position-absolute"
                                            style={cartStyle}>
                                            {cart.length}
                                        </span>
                                    </i> Cart
                                </a>
                            </Link>
                        </li>
                        {
                            !auth.user ?
                                <li className="nav-item">
                                    <Link href="/signin">
                                        <a className={`nav-link ${isActive("/signin")}`} aria-current="page">
                                            <i className="fas fa-user"></i> Sign in
                                        </a>
                                    </Link>
                                </li>
                                :
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={auth.user.avatar} alt={auth.user.avatar} className="avatar" />
                                        {auth.user.name}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <li>
                                            <Link href="/profile">
                                                <a className="dropdown-item">Profile</a>
                                            </Link>
                                            {
                                                auth.user.role === "admin" && adminRouter()
                                            }
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item" onClick={logoutHandler}>Logout</button>
                                        </li>
                                    </ul>
                                </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav;
