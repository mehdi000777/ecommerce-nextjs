export const Actions = {
    NOTIFY: "NOTIFY",
    AUTH: "AUTH",
    ADD_CART: "ADD_CART",
    UPDATE_CART: "UPDATE_CART",
    MODAL: "MODAL",
    ADD_ORDERS: "ADD_ORDERS",
    ADD_USERS: "ADD_USERS",
    ADD_CATEGORIES: "ADD_CATEGORIES",
}

export const addToCart = (product, cart) => {
    if (product.inStock === 0)
        return ({ type: "NOTIFY", payload: { error: "This product is out of stock." } });

    if (cart.every(item => item._id !== product._id)) {
        return ({ type: "ADD_CART", payload: [...cart, { ...product, quantity: 1 }] })
    }
    else {
        return ({ type: "NOTIFY", payload: { error: "The product has been added to cart." } });
    }
}

export const decrease = (cartItem, cart) => {
    const newCart = [...cart];

    newCart.forEach(item => {
        if (item._id === cartItem._id) item.quantity -= 1
    })

    return ({ type: "UPDATE_CART", payload: newCart })
}

export const increase = (cartItem, cart) => {
    const newCart = [...cart];

    newCart.forEach(item => {
        if (item._id === cartItem._id) item.quantity += 1;
    })

    return ({ type: "UPDATE_CART", payload: newCart });
}

export const deleteItem = (data, id, type) => {
    const newCart = data.filter(item => item._id !== id);

    return ({ type, payload: newCart });
}

export const updateItem = (data, id, post, type) => {
    const newData = data.map(item => item._id === id ? post : item);

    return ({ type, payload: newData });
}