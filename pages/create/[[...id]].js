import { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { uploadImage } from '../../utils/uploadImage';
import { getData, postData, putData } from '../../utils/fetchData';
import { useRouter } from 'next/router';

const ProductsManager = () => {
    const { state, dispatch } = useContext(DataContext);
    const { categories, auth } = state;

    const initialState = {
        title: "",
        price: 0,
        inStock: 0,
        description: "",
        content: "",
        category: "all",
    }

    const [images, setImages] = useState([]);

    const [productData, setProductData] = useState(initialState);
    const { title, price, inStock, description, content, category } = productData;

    const [onEdit, setOnEdit] = useState(false);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            setOnEdit(true);

            getData(`product/${id}`).then(res => {
                if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

                setProductData(res.product);
                setImages(res.product.images)
            })
        }
        else {
            setOnEdit(false);
            setProductData(initialState);
            setImages([]);
        }
    }, [id])

    const inputHandler = (e) => {
        const { name, value } = e.target;

        setProductData({ ...productData, [name]: value });
    }

    const imageHanlder = (e) => {
        const files = [...e.target.files];

        let img = [];
        let num = 0;
        let err = "";

        if (!files) return dispatch({ type: "NOTIFY", payload: { error: "file does not exist." } })

        files.forEach(file => {
            if (file.size > 1024 * 1024)
                return err = "The largest image size is 1m."

            if (file.type !== "image/jpeg" && file.type !== "image/png")
                return err = "Image format is inccorect."

            num += 1;
            if (num <= 5) img.push(file);
        })

        if (err) return dispatch({ type: "NOTIFY", payload: { error: err } });

        if (images.length + img.length > 5)
            return dispatch({ type: "NOTIFY", payload: { error: "Select up to 5 images." } })

        setImages([...images, ...img]);
    }

    const deleteImage = (index) => {
        const newImages = [...images];

        newImages.splice(index, 1);

        setImages(newImages);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (auth.user.role !== "admin")
            return dispatch({ type: "NOTIFY", payload: { error: "Invalid Authenticaion." } });

        if (!title || !price || !inStock || !description || !content || category === "all" || images.length === 0)
            return dispatch({ type: "NOTIFY", payload: { error: "Please add all fields." } });

        dispatch({ type: "NOTIFY", payload: { loading: true } });

        let media = [];
        const newUrlImages = images.filter(img => !img.url);
        const oldUrlImages = images.filter(img => img.url);

        if (newUrlImages.length > 0) media = await uploadImage(newUrlImages);

        let res;
        if (onEdit) {
            res = await putData(`product/${id}`, { ...productData, images: [...oldUrlImages, ...media] }, auth.token);
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        }
        else {
            res = await postData("product", { ...productData, images: [...oldUrlImages, ...media] }, auth.token);
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        }

        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    }

    return (
        <div className="products_manager my-4">
            <Head>
                <title>Products Manager</title>
            </Head>

            <form className="row" onSubmit={submitHandler}>
                <div className="col-md-6">
                    <input type="text" className="form-control" name="title" value={title}
                        placeholder="Title" onChange={inputHandler} />

                    <div className="row my-3">
                        <div className="col-sm-6">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" className="form-control" name="price" value={price}
                                placeholder="Price" onChange={inputHandler} />
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="inStock">In Stock</label>
                            <input type="number" id="inStock" className="form-control" name="inStock" value={inStock}
                                placeholder="inStock" onChange={inputHandler} />
                        </div>
                    </div>

                    <textarea name="description" cols="30" rows="4" placeholder="Description"
                        className="form-control my-4" onChange={inputHandler} value={description} />

                    <textarea name="content" cols="30" rows="6" placeholder="Content"
                        className="form-control my-4" onChange={inputHandler} value={content} />

                    <div className="input-group-prepend px-0 my-2">
                        <select className="form-select text-capitalize" name="category" value={category} onChange={inputHandler}>
                            <option value="all">All Products</option>
                            {
                                categories.map(item => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <button type="submit" className="btn btn-info text-light my-4 px-4">
                        {onEdit ? "Update" : "Create"}
                    </button>
                </div>

                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <input type="file" multiple className="form-control" id="file" onChange={imageHanlder}
                            accept="image/*" />
                    </div>

                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file_img">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)} className="img-thumbnail rounded" />
                                    <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProductsManager;
