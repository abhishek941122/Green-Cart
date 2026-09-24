import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    // fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.post('/api/seller/is-auth');
            setIsSeller(!!data.success)
        } catch (error) {
            setIsSeller(false)
        }
    }

    // user data and cart items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartItems || {})
            }
        } catch (error) {
            setUser(null)
        }
    }

    // fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // add product to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const id in cartItems) {
            const itemInfo = products.find((product) => product._id === id);
            if (itemInfo && cartItems[id] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[id];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    // update cart item quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("cart updated")
    }

    // remove product from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from cart");
    };

    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts()
    }, [])

    // drop cart entries whose product no longer exists
    useEffect(() => {
        if (products.length === 0) return;
        const ids = new Set(products.map((p) => p._id));
        const cleaned = Object.fromEntries(
            Object.entries(cartItems).filter(([id]) => ids.has(id))
        );
        if (Object.keys(cleaned).length !== Object.keys(cartItems).length) {
            setCartItems(cleaned);
        }
    }, [products]);

    // update database cart items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', { cartItems })
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if (user) {
            updateCart()
        }
    }, [cartItems])

    const value = {
        user, setUser, isSeller, setIsSeller, navigate,
        showUserLogin, setShowUserLogin, products, currency,
        addToCart, updateCartItem, removeFromCart,
        cartItems, searchQuery, setSearchQuery,
        getCartAmount, getCartCount, axios, fetchProducts,setCartItems
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}