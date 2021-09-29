import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { filters } from '../utils/filters';

const Filter = ({ state }) => {
    const { categories } = state;

    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");

    const router = useRouter();

    const categoryHandler = (e) => {
        setCategory(e.target.value);
        filters({ router, category: e.target.value });
    }

    const sortHandler = (e) => {
        setSort(e.target.value);
        filters({ router, sort: e.target.value });
    }

    useEffect(() => {
        filters({ router, search: search ? search.toLowerCase() : "all" });
    }, [search])

    return (
        <div className="input-group mt-2">
            <div className="input-group-prepend col-md-2 px-0">
                <select className="form-select text-capitalize" value={category} onChange={categoryHandler}>
                    <option value="all">All Products</option>
                    {
                        categories.map(item => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))
                    }
                </select>
            </div>

            <form autoComplete="off" className="col-md-8 px-0 position-relative">
                <input type="text" className="form-control" list="title_product" value={search.toLowerCase()}
                    onChange={e => setSearch(e.target.value)} />
                <datalist id="title_product">
                    <option value="name">Title name</option>
                </datalist>

                <button type="submit" className="position-absolute btn btn-info"
                    style={{ top: 0, right: 0, visibility: "hidden" }}  >
                    Search
                </button>
            </form>

            <div className="input-group-prepend col-md-2 px-0">
                <select className="form-select text-capitalize" value={sort} onChange={sortHandler}>
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="-sold">Best sales</option>
                    <option value="-price">Price: Hight-Low</option>
                    <option value="price">Price: Low-Hight</option>
                </select>
            </div>

        </div>
    )
}

export default Filter;
