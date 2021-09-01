import store from "."
import {
  AddProductType,
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
  SET_PRODUCT_ERROR,
  SET_PRODUCTS,
  GET_PRODUCT,
} from "./action"

export const setLoading = (payload: boolean): StoreAction => {
  return { type: LOADING, payload }
}

export const setProducts = (payload: ProductType[]): StoreAction => {
  return { type: SET_PRODUCTS, payload }
}

export const addProduct = (payload: AddProductType): StoreAction => {
  return { type: ADD_PRODUCT, payload }
}

export const editProduct = (payload: EditProductType): StoreAction => {
  return { type: EDIT_PRODUCT, payload }
}

export const deleteProduct = (payload: number): StoreAction => {
  return { type: DELETE_PRODUCT, payload }
}

export const setProductError = (payload: string): StoreAction => {
  return { type: SET_PRODUCT_ERROR, payload }
}

export const getProduct = (payload: string): StoreAction => {
  return { type: GET_PRODUCT, payload }
}

export const fetchProducts = () => async (dispatch: DispatchType) => {
  if (store.getState().products.length > 0) {
    return
  }
  try {
    const response = await fetch(process.env.REACT_APP_API_URL as string)
    let { products } = await response.json()
    dispatch(setLoading(false))
    dispatch(setProducts(products))
    dispatch(setProductError(""))
  } catch (error) {
    dispatch(setLoading(false))
    dispatch(setProducts([]))
    dispatch(setProductError((error as Error).message))
  }
}
