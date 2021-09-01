import { mount, shallow } from "enzyme"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import EditProduct from "../EditProduct"
import { EDIT_PRODUCT, GET_PRODUCT, SET_PRODUCT_ERROR } from "../store/action"
import {
  editProduct,
  getProduct,
  setProductError,
} from "../store/action-creators"
import rootReducer from "../store/reducer"
import { createStore, initialStoreState, product, resetStore } from "./utils"
import ReactRouter from "react-router"
import React from "react"

const store = createStore()
describe("EditProduct Test", () => {
  it("should be defined", () => {
    const wrapper = shallow(render())
    expect(wrapper.text()).toBeDefined()
  })
  describe("EditProduct Store State", () => {
    afterEach(() => {
      resetStore()
    })
    it("store should contain product when product state is set", () => {
      const state = { ...initialStoreState, product }
      const reducer = rootReducer(state, { type: "" })
      expect(reducer).toEqual(state)
    })
    it("should contain appropriate product title", () => {
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            product,
          })
        )
      )
      expect(wrapper.find("[data-testid='productTitle']").text()).toBe(
        `Edit product: ${product.name}`
      )
    })
    it("should contain ErrorMessage when productError state has non-empty string", () => {
      const errorMessage = `No product found with id: undefined`
      let expectedAction = {
        type: SET_PRODUCT_ERROR,
        payload: errorMessage,
      }
      const reducer = rootReducer(initialStoreState, expectedAction)
      store.dispatch(setProductError(errorMessage))
      expect(reducer).toEqual({
        ...initialStoreState,
        productError: errorMessage,
      })
      expect(
        store.getActions().find((action) => action.type === SET_PRODUCT_ERROR)
      ).toEqual(expectedAction)
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            productError: errorMessage,
          })
        )
      )
      expect(
        (
          wrapper.find("[data-testid='productError']").props() as {
            message: string
          }
        ).message
      ).toBe(errorMessage)
      const backButton = wrapper.find("[data-testid='backButton']")
      expect(backButton.find("Link").props().to).toBe("/")
    })
    it("should contain an update product form", () => {
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            product,
          })
        )
      )
      const editForm = wrapper.find("[data-testid='editForm']")
      expect(editForm).toBeDefined()
    })
    it("should a change product input details when form input is updated", () => {
      jest
        .spyOn(ReactRouter, "useParams")
        .mockReturnValue({ id: product.id.toString() })
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            product,
          })
        )
      )
      let event = {
        preventDefault(): void {},
        target: { value: "Updated Product Name", name: "name" },
      }
      const editForm = wrapper.find("[data-testid='productName']")
      expect(editForm).toBeDefined()
      expect(editForm.find("label").text()).toEqual("Product Name")
      let input = editForm.find("input")
      expect(input.props().value).toEqual("Product Name")
      input.simulate("change", event)
      const productPrice = wrapper.find("[data-testid='productPrice']")
      expect(productPrice).toBeDefined()
      expect(productPrice.find("label").text()).toEqual("Price")
      input = productPrice.find("input")
      expect(input.props().value).toEqual(20)
      event = {
        preventDefault(): void {},
        target: { value: "30", name: "price" },
      }
      input.simulate("change", event)
      const submitButton = wrapper.find("[data-testid='submitButton']")
      expect(submitButton).toBeDefined()
      editForm.simulate("submit", event)
      const successMessage = wrapper.find("[data-testid='successMessage']")
      expect(
        (
          successMessage.props() as {
            dangerouslySetInnerHTML: { __html: string }
          }
        ).dangerouslySetInnerHTML.__html
      ).toBe("You have successfully updated Product Name")
    })
    it("should fetch a product from store", () => {
      const products = [product]
      let expectedAction = {
        type: GET_PRODUCT,
        payload: "1",
      }
      const reducer = rootReducer(
        { ...initialStoreState, product, products },
        expectedAction
      )
      store.dispatch(getProduct("1"))
      expect(reducer).toEqual({
        ...initialStoreState,
        product,
        products,
      })
      expect(
        store.getActions().find((action) => action.type === GET_PRODUCT)
      ).toEqual(expectedAction)
    })
    it("should update a product in store", () => {
      resetStore()
      const products = [product]
      let expectedAction = {
        type: EDIT_PRODUCT,
        payload: { id: 1, name: "Updated Product Name", price: 200 },
      }
      const reducer = rootReducer(
        { ...initialStoreState, product, products },
        expectedAction
      )
      store.dispatch(
        editProduct({ id: 1, name: "Updated Product Name", price: 200 })
      )
      product.prices.unshift({ price: 200, id: 2, date: "2021-09-01" })
      reducer.products[0].prices[0].date = "2021-09-01"
      expect(reducer).toEqual({
        ...initialStoreState,
        products: [{ ...product, name: "Updated Product Name" }],
        product: { ...product, name: "Updated Product Name" },
      })
      expect(
        store.getActions().find((action) => action.type === EDIT_PRODUCT)
      ).toEqual(expectedAction)
    })
    it("should not update a product with invalid product id", () => {
      const products = [product]
      let expectedAction = {
        type: EDIT_PRODUCT,
        payload: { id: 100, name: "Updated Product Name", price: 200 },
      }
      const reducer = rootReducer(
        { ...initialStoreState, product, products },
        expectedAction
      )
      store.dispatch(
        editProduct({ id: 100, name: "Updated Product Name", price: 200 })
      )
      expect(reducer).toEqual({
        ...initialStoreState,
        products,
        product,
      })
      // expect(
      //   store.getActions().find((action) => action.type === EDIT_PRODUCT)
      // ).toEqual(expectedAction)
    })
  })
})

const render = (storeDetails: any = store) => {
  return (
    <Provider store={storeDetails}>
      <MemoryRouter>
        <EditProduct />
      </MemoryRouter>
    </Provider>
  )
}
