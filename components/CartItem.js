import Link from 'next/link';
import { decrease, increase } from '../store/Actions';

const CartItem = ({ cartItem, dispatch, cart }) => {
    return (
        <tr>
            <td style={{ width: "100px" }}>
                <img src={cartItem.images[0].url} alt={cartItem.title} className="img-thumbnail w-100"
                    style={{ minWidth: "80px", height: "80px" }} />
            </td>

            <td style={{ minWidth: "200px" }} className="align-middle">
                <h5 className="text-secondary text-capitalize">
                    <Link href={`/product/${cartItem._id}`}>
                        {cartItem.title}
                    </Link>
                </h5>

                <h6 className="text-danger">${cartItem.quantity * cartItem.price}</h6>

                {
                    cartItem.inStock > 0
                        ? <p className="mb-1 text-danger">In Stock: {cartItem.inStock}</p>
                        : <p className="mb-1 text-danger">Out Stock</p>
                }
            </td>

            <td className="align-middle" style={{ minWidth: "150px" }}>
                <button className="btn btn-outline-secondary" disabled={cartItem.quantity === 1}
                    onClick={() => dispatch(decrease(cartItem, cart))}>
                    -
                </button>
                <span className="px-3">{cartItem.quantity}</span>
                <button className="btn btn-outline-secondary" disabled={cartItem.quantity === cartItem.inStock}
                    onClick={() => dispatch(increase(cartItem, cart))}>
                    +
                </button>
            </td>

            <td className="align-middle" style={{ minWidth: "50px", cursor: "pointer" }}>
                <i className="far fa-trash-alt text-danger" data-bs-toggle="modal" data-bs-target="#exampleModal"
                    aria-hidden="true" style={{ fontSize: "18px" }}
                    onClick={() =>
                        dispatch({ type: "MODAL", payload: { id: cartItem._id, data: cart, title: cartItem.title, type: "UPDATE_CART" } })}></i>
            </td>
        </tr >
    )
}

export default CartItem;
