import React, { useContext } from 'react'
import Link from 'next/link'
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';

const ProductItem = ({ product, checkHandler }) => {
    const { state, dispatch } = useContext(DataContext);
    const { cart, auth } = state;

    const addCartHandler = () => {
        dispatch(addToCart(product, cart))
    }

    const deleteHandler = () => {
        dispatch({ type: "MODAL", payload: { type: "DELETE_PRODUCT", title: product.title, id: product._id } })
    }

    const userLinks = () => {
        return (
            <>
                <Link href={`/product/${product._id}`}>
                    <a className="btn btn-info flex-fill me-2 text-light">Viwe</a>
                </Link>
                <button className="btn btn-success flex-fill ms-2" onClick={addCartHandler}
                    disabled={product.inStock === 0}>
                    Bay
                </button>
            </>
        )
    }

    const addminLinks = () => {
        return (
            <>
                <Link href={`/create/${product._id}`}>
                    <a className="btn btn-info flex-fill me-2 text-light">Edit</a>
                </Link>
                <button className="btn btn-danger flex-fill ms-2" data-bs-toggle="modal"
                    data-bs-target="#exampleModal" aria-hidden="true" onClick={deleteHandler}>
                    Delete
                </button>
            </>
        )
    }

    return (
        <div className="card position-relative" style={{ width: "20rem" }}>
            {
                auth.user && auth.user.role === "admin" &&
                <input type="checkbox" className="position-absolute" checked={product.checked}
                    style={{ width: "20px", height: "20px" }} onChange={() => checkHandler(product._id)} />
            }
            <img src={product.images[0].url} className="card-img-top" alt={product.title} />
            <div className="card-body">
                <h5 className="card-title text-capitalize" title={product.title}>{product.title}</h5>
                <div className="d-flex justify-content-between">
                    <h6 className="text-danger">${product.price}</h6>
                    {
                        product.inStock > 0
                            ? <h6 className="text-danger">In Stock: {product.inStock}</h6>
                            : <h6 className="text-danger">Out Stock</h6>
                    }
                </div>
                <p className="card-text">{product.description}</p>

                <div className="d-flex justify-content-between">
                    {auth.user && auth.user.role === "admin" ? addminLinks() : userLinks()}
                </div>
            </div>
        </div>
    )
}

export default ProductItem;
