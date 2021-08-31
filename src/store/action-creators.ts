import store from "."
import {
  DispatchType,
  EditProductType,
  ProductType,
  StoreAction,
} from "../types"
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  EDIT_PRODUCT,
  LOADING,
  PRODUCT_ERROR,
  GET_PRODUCTS,
  GET_PRODUCT,
} from "./action"

export const setLoading = (payload: boolean): StoreAction => {
  return { type: LOADING, payload }
}

export const getProducts = (payload: ProductType[]): StoreAction => {
  return { type: GET_PRODUCTS, payload }
}

export const addProduct = (payload: ProductType): StoreAction => {
  return { type: ADD_PRODUCT, payload }
}

export const editProduct = (payload: EditProductType): StoreAction => {
  return { type: EDIT_PRODUCT, payload }
}

export const deleteProduct = (payload: ProductType): StoreAction => {
  return { type: DELETE_PRODUCT, payload }
}

export const productError = (payload: string): StoreAction => {
  return { type: PRODUCT_ERROR, payload }
}

export const getProduct = (payload: string): StoreAction => {
  return { type: GET_PRODUCT, payload }
}

export const fetchProducts = () => async (dispatch: DispatchType) => {
  if (store.getState().products.length > 0) {
    return
  }
  try {
    console.log(process.env.REACT_APP_API_URL)
    const response = await fetch(process.env.REACT_APP_API_URL as string)
    let { products } = await response.json()
    dispatch(setLoading(false))
    dispatch(getProducts(products))
    dispatch(productError(""))
  } catch (error) {
    dispatch(setLoading(false))
    dispatch(getProducts([]))
    dispatch(productError((error as Error).message))
  }
}
