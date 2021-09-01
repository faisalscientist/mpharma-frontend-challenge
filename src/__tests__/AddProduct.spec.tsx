import { mount, shallow } from "enzyme"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import AddProduct from "../AddProduct"
import { ADD_PRODUCT, SET_PRODUCT_ERROR } from "../store/action"
import { addProduct, setProductError } from "../store/action-creators"
import rootReducer from "../store/reducer"
import { createStore, initialStoreState, product, resetStore } from "./utils"
import ReactRouter from "react-router"
import React from "react"

const store = createStore()
describe("AddProduct Test", () => {
  it("should be defined", () => {
    const wrapper = shallow(render())
    expect(wrapper.text()).toBeDefined()
  })
  describe("AddProduct Store State", () => {
    afterEach(() => {
      resetStore()
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
        `Add product`
      )
    })
    it("should contain an add product form", () => {
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            product,
          })
        )
      )
      const addForm = wrapper.find("[data-testid='addForm']")
      expect(addForm).toBeDefined()
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
        target: { value: "New Product Name", name: "name" },
      }
      const addForm = wrapper.find("[data-testid='productName']")
      expect(addForm).toBeDefined()
      expect(addForm.find("label").text()).toEqual("Product Name")
      let input = addForm.find("input")
      input.simulate("change", event)
      const productPrice = wrapper.find("[data-testid='productPrice']")
      expect(productPrice).toBeDefined()
      expect(productPrice.find("label").text()).toEqual("Price")
      input = productPrice.find("input")
      event = {
        preventDefault(): void {},
        target: { value: "30", name: "price" },
      }
      input.simulate("change", event)
      const submitButton = wrapper.find("[data-testid='submitButton']")
      expect(submitButton).toBeDefined()
      addForm.simulate("submit", event)
      const successMessage = wrapper.find("[data-testid='successMessage']")
      expect(
        (
          successMessage.props() as {
            dangerouslySetInnerHTML: { __html: string }
          }
        ).dangerouslySetInnerHTML.__html
      ).toBe(`You have successfully added <b>New Product Name</b>`)
    })
    it("should add a new product to products array in store", () => {
      const products = [product]
      let expectedAction = {
        type: ADD_PRODUCT,
        payload: { name: "New Product", price: 50 },
      }
      const reducer = rootReducer(
        { ...initialStoreState, product, products },
        expectedAction
      )
      store.dispatch(addProduct({ name: "New Product", price: 50 }))
      reducer.products[1].prices[0].date = "2021-09-01"
      expect(reducer).toEqual({
        ...initialStoreState,
        product,
        products: [
          ...products,
          {
            id: 2,
            name: "New Product",
            prices: [{ id: 0, price: 50, date: "2021-09-01" }],
          },
        ],
      })
      expect(
        store.getActions().find((action) => action.type === ADD_PRODUCT)
      ).toEqual(expectedAction)
    })
  })
})

const render = (storeDetails: any = store) => {
  return (
    <Provider store={storeDetails}>
      <MemoryRouter>
        <AddProduct />
      </MemoryRouter>
    </Provider>
  )
}
