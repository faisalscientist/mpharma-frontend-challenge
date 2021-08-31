import {
  EditProductType,
  ProductsState,
  ProductType,
  StoreAction,
} from "../types"
import {
  GET_PRODUCT,
  LOADING,
  PRODUCT_ERROR,
  GET_PRODUCTS,
  EDIT_PRODUCT,
} from "./action"

const initialState: ProductsState = {
  products: [],
  loading: true,
  productError: "",
  product: null,
}

const rootReducer = (
  state: ProductsState = initialState,
  action: StoreAction
): ProductsState => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload as boolean }
    case PRODUCT_ERROR:
      return {
        ...state,
        productError: action.payload as string,
      }
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload as ProductType[],
      }
    case GET_PRODUCT:
      const product = state.products.find(
        (product) => product.id === +(action.payload as string)
      )
      return {
        ...state,
        product: product as ProductType,
      }
    case EDIT_PRODUCT:
      const payload = action.payload as EditProductType
      const productIndex = state.products.findIndex(
        (product) => +product.id === payload.id
      )
      if (productIndex !== -1) {
        const productToEdit = state.products[productIndex]
        const updatedProduct = {
          ...state.products[productIndex],
          name: payload.name,
        }
        if (Number(productToEdit.prices[0].price) !== Number(payload.price)) {
          updatedProduct["prices"] = [
            ...productToEdit.prices,
            {
              id: productToEdit.prices.length,
              price: +payload.price,
              date: new Date().toISOString(),
            },
          ]
        }
        const updatedProducts = [
          ...state.products.slice(0, productIndex),
          updatedProduct,
          ...state.products.slice(productIndex + 1),
        ]
        console.log(updatedProduct)
        updatedProduct.prices.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        return { ...state, products: updatedProducts, product: updatedProduct }
      }
      return state
    default:
      return state
  }
}

export default rootReducer
