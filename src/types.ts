import rootReducer from "./store/reducer"

export type ProductsState = {
  products: ProductType[]
  loading: boolean
  productError: string
  product: ProductType | null
}

export type AddProductType = {
  name: string
  price: number
}

export type EditProductType = {
  id: number
  name: string
  price: number
}

export type ProductType = {
  id: number
  name: string
  prices: ProductPrice[]
}

export type ProductPrice = {
  id: number
  price: number
  date: string
}

export type StoreAction = {
  type: string
  payload?:
    | ProductType[]
    | EditProductType
    | AddProductType
    | ProductType
    | boolean
    | string
    | number
}

export type ProductParamsType = {
  id: string
}

export type RootState = ReturnType<typeof rootReducer>

export type DispatchType = (args: StoreAction) => StoreAction
