import configureStore, { MockStore } from "redux-mock-store"
import configureMockStore from "redux-mock-store"
import React from "react"
import thunk from "redux-thunk"
import { ProductsState, ProductType } from "../types"

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares)
export const initialStoreState: ProductsState = {
  products: [],
  loading: false,
  productError: "",
  product: null,
}

export const product = {
  id: 1,
  name: "Product Name",
  prices: [
    { id: 1, price: 20, date: new Date().toISOString() },
    { id: 2, price: 30, date: new Date().toISOString() },
  ],
}

export const createStore = (storeState = initialStoreState): MockStore => {
  return mockStore(storeState)
}

export const resetStore = (): MockStore => {
  const mockStore = configureMockStore([])
  return mockStore()
}
