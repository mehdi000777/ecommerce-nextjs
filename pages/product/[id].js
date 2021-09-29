import Head from 'next/head'
import { useContext, useState } from 'react'
import { addToCart } from '../../store/Actions';
import { DataContext } from '../../store/GlobalState';
import { getData } from '../../utils/fetchData'

const ProductDetail = (props) => {
    const [product, setProduct] = useState(props.product);
    const [tab, setTab] = useState(0);

    const { state, dispatch } = useContext(DataContext);
    const { cart } = state;

    const isActive = (index) => {
        if (tab === index) return "active";
        return;
    }

    const addCartHandler = () => {
        dispatch(addToCart(product, cart))
    }

    return (
        <div className="row detail_page">
            <Head>
                <title>Product Detail</title>
            </Head>

            <div className="col-md-6">
                <img src={product.images[tab].url} alt={product.title} className="d-blok img-thumbnail rounded mt-4 w-100"
                    style={{ height: "350px" }} />
                <div className="d-flex" style={{ cursor: "pointer" }}>
                    {
                        product.images.map((image, index) => (
                            <img key={index} src={image.url} alt={image.url} onClick={() => setTab(index)}
                                className={`img-thumbnail rounded ${isActive(index)}`} style={{ width: "20%", height: "80px" }} />
                        ))
                    }
                </div>
            </div>

            <div className="col-md-6 mt-3">
                <h2 className="text-uppercase">{product.title}</h2>
                <h5 className="text-danger">${product.price}</h5>

                <div className="d-flex justify-content-between">
                    {
                        product.inStock > 0
                            ? <h5 className="text-danger">In Stock: {product.inStock}</h5>
                            : <h5 className="text-danger">Out Stock</h5>
                    }
                    <h6 className="text-danger">Sold: {product.sold}</h6>
                </div>
                <p className="my-2">{product.description}</p>
                <p className="my-2">{product.content}</p>

                <button className="btn btn-dark d-block my-3 px-5"
                    onClick={addCartHandler}>
                    Buy
                </button>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ params: { id } }) => {
    const res = await getData(`product/${id}`);

    return {
        props: {
            product: res.product,
        }
    }
}


export default ProductDetail;
