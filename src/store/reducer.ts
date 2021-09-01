import {
  AddProductType,
  EditProductType,
  ProductsState,
  ProductType,
  StoreAction,
} from "../types"
import {
  GET_PRODUCT,
  LOADING,
  SET_PRODUCT_ERROR,
  SET_PRODUCTS,
  EDIT_PRODUCT,
  ADD_PRODUCT,
  DELETE_PRODUCT,
} from "./action"

const initialState: ProductsState = {
  products: [],
  loading: false,
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
    case SET_PRODUCT_ERROR:
      return {
        ...state,
        productError: action.payload as string,
      }
    case SET_PRODUCTS:
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
    case ADD_PRODUCT:
      const addProductPayload = action.payload as AddProductType
      const lastProduct = state.products[state.products.length - 1]
      const productToBeAdded: ProductType = {
        id: lastProduct ? lastProduct.id + 1 : 0,
        name: addProductPayload.name,
        prices: [
          {
            id: 0,
            price: +addProductPayload.price,
            date: new Date().toISOString(),
          },
        ],
      }
      return {
        ...state,
        products: [...(state.products as ProductType[]), productToBeAdded],
      }
    case EDIT_PRODUCT:
      const payload = action.payload as EditProductType
      const productIndex = state.products.findIndex(
        (product) => +product.id === payload.id
      )
      console.log("tje index", productIndex)
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
        updatedProduct.prices.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        return { ...state, products: updatedProducts, product: updatedProduct }
      }
      return state
    case DELETE_PRODUCT:
      const products = state.products.filter(
        (product) => product.id !== action.payload
      )
      return { ...state, products }
    default:
      return state
  }
}

export default rootReducer
