import React, { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState';
import Head from 'next/head';
import { postData, putData } from '../utils/fetchData';
import { updateItem } from '../store/Actions';

const Categories = () => {
    const { state, dispatch } = useContext(DataContext);
    const { categories, auth } = state;

    const [category, setCategory] = useState("");
    const [id, setId] = useState("");
    const [name, setName] = useState("");

    const createCategory = async () => {
        if (auth.user.role !== "admin") return dispatch({ type: "NOTIFY", payload: { error: "Invalid Authentication." } });

        if (!category) return dispatch({ type: "NOTIFY", payload: { error: "Please enter a category." } });

        dispatch({ type: "NOTIFY", payload: { loading: true } });

        if (id) {
            if (name === category) return dispatch({ type: "NOTIFY", payload: { error: "Please change category." } });

            const res = await putData(`category/${id}`, { name: category }, auth.token);
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));

            dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        }
        else {
            const res = await postData("category", { name: category }, auth.token);
            if (res.err) return dispatch({ type: "NOTIFY", payload: { error: res.err } });

            dispatch({ type: "ADD_CATEGORIES", payload: [...categories, res.newCategory] })

            dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        }

        setCategory("");
        setName("");
        setId("");
    }

    const updateHandler = async (category) => {
        setCategory(category.name);
        setName(category.name);
        setId(category._id);
    }

    const deleteHandler = (category) => {
        dispatch({
            type: "MODAL",
            payload: {
                type: "ADD_CATEGORIES",
                title: category.name,
                id: category._id,
                data: categories
            }
        })
    }

    return (
        <div className="col-md-6 mx-auto my-3">
            <Head>
                <title>Categories</title>
            </Head>

            <div className="input-group mb-3">
                <input type="text" id="category" className="form-control" placeholder="add a category"
                    value={category} onChange={e => setCategory(e.target.value)} />

                <button className="btn btn-dark" disabled={!category} onClick={createCategory}>
                    {id ? "Update" : "Create"}
                </button>
            </div>

            {
                categories.map(item => (
                    <div key={item._id} className="card my-2 text-capitalize">
                        <div className="card-body d-flex justify-content-between">
                            {item.name}

                            <div style={{ cursor: "pointer" }}>
                                <i className="fas fa-edit text-info me-2" onClick={() => updateHandler(item)}></i>
                                <i className="fas fa-trash-alt text-danger ms-2"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                                    aria-hidden="true" onClick={() => deleteHandler(item)}></i>
                            </div>

                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Categories;