import { getData } from '../utils/fetchData'
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../store/GlobalState';
import { filters } from '../utils/filters';
import { useRouter } from 'next/router';
import Filter from '../components/Filter';

const Home = (props) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isCheck, setIsCheck] = useState(false);

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter()

  useEffect(() => {
    setProducts(props.products)
  }, [props.products])

  useEffect(() => {
    if (!router.query.page) {
      setPage(1)
    }
    else {
      setPage(Number(router.query.page));
    }
  }, [router.query])

  const checkHandler = (id) => {
    products.forEach(item => {
      if (item._id === id) item.checked = !item.checked
    })

    setProducts([...products]);
  }

  const checkAllHandler = () => {
    products.forEach(item => {
      item.checked = !isCheck;
    })

    setProducts([...products]);
    setIsCheck(!isCheck);
  }

  const deleteHandler = () => {
    const data = products.filter(item => item.checked)
    let ids = [];
    data.forEach(item => {
      ids.push(item._id);
    })

    dispatch({ type: "MODAL", payload: { type: "DELETE_ALL_PRODUCTS", title: "Delete Products", data: ids } });
  }

  const paginationHandler = () => {
    setPage(page + 1);
    filters({ router, page: page + 1 });
  }

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>

      <Filter state={state} />

      {
        auth.user && auth.user.role === "admin" &&
        <div className="delete_all btn btn-danger mt-2">
          <input type="checkbox" checked={isCheck} style={{ width: "25px", height: "25px", transform: "translateY(8px)" }}
            onChange={checkAllHandler} />
          <button className="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal"
            onClick={deleteHandler}>
            Delete All
          </button>
        </div>
      }

      <div className="products">
        {
          products.length === 0
            ? <h2>No Products</h2>
            : products.map(product => (
              <ProductItem key={product._id} product={product} checkHandler={checkHandler} />
            ))
        }
      </div>

      {
        props.result < page * 6 ? ""
          : <button className="btn btn-outline-info d-block mx-auto mb-3" onClick={paginationHandler}>
            Load More
          </button>
      }

    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(`product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`);

  return {
    props: {
      products: res.products,
      result: res.result
    }
  }
}

export default Home;
