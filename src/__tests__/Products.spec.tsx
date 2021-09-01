import { mount, shallow } from "enzyme"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import Products from "../Products"
import {
  DELETE_PRODUCT,
  LOADING,
  SET_PRODUCTS,
  SET_PRODUCT_ERROR,
} from "../store/action"
import {
  deleteProduct,
  setLoading,
  setProductError,
  setProducts,
} from "../store/action-creators"
import rootReducer from "../store/reducer"
import { createStore, initialStoreState, product, resetStore } from "./utils"

const store = createStore()
describe("Products Test", () => {
  it("should be defined", () => {
    const wrapper = shallow(render())
    expect(wrapper.text()).toBeDefined()
  })
  describe("Products Store State", () => {
    afterEach(() => {
      resetStore()
    })
    it("should contain initial store state", () => {
      const reducer = rootReducer(initialStoreState, { type: "" })
      expect(reducer).toEqual(initialStoreState)
      const wrapper = mount(render())
      expect(wrapper.find("[data-testid='loader']").exists()).toBeFalsy()
    })
    it("should contain Loader when loading state is true", () => {
      const reducer = rootReducer(initialStoreState, {
        type: LOADING,
        payload: true,
      })
      let expectedAction = {
        type: LOADING,
        payload: true,
      }
      store.dispatch(setLoading(true))
      expect(reducer).toEqual({ ...initialStoreState, loading: true })
      expect(
        store.getActions().find((action) => action.type === LOADING)
      ).toEqual(expectedAction)
      const wrapper = mount(
        render(createStore({ ...initialStoreState, loading: true }))
      )
      expect(wrapper.find("[data-testid='loader']").exists()).toBeTruthy()
      expect(wrapper.find("[data-testid='productError']").exists()).toBeFalsy()
      expect(
        wrapper.find("[data-testid='productsSection']").exists()
      ).toBeFalsy()
    })
    it("should contain ErrorMessage when productError state has non-empty string", () => {
      const errorMessage = "This is an error"
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
      expect(wrapper.find("[data-testid='loader']").exists()).toBeFalsy()
      expect(
        (
          wrapper.find("[data-testid='productError']").props() as {
            message: string
          }
        ).message
      ).toBe(errorMessage)
      expect(
        wrapper.find("[data-testid='productsSection']").exists()
      ).toBeFalsy()
    })
    it("should contain `No products available` when products state is empty array", () => {
      const wrapper = mount(render(createStore()))
      expect(wrapper.find("[data-testid='loader']").exists()).toBeFalsy()
      expect(wrapper.find("[data-testid='productError']").exists()).toBeFalsy()
      expect(
        wrapper.find("[data-testid='productsSection']").exists()
      ).toBeTruthy()
      expect(wrapper.find("[data-testid='productsTitle']").text()).toBe(
        "No products available"
      )
      const addProductButton = wrapper.find("[data-testid='addProductButton']")
      expect(addProductButton).toBeDefined()
      expect(addProductButton.find("Link").props().to).toBe("new")
      expect(wrapper.find("[data-testid='productsTable']").exists()).toBeFalsy()
    })
    it("should show a table with list of products when products state is non-empty array", () => {
      const products = [product]
      let expectedAction = {
        type: SET_PRODUCTS,
        payload: products,
      }
      const reducer = rootReducer(initialStoreState, expectedAction)
      store.dispatch(setProducts(products))
      expect(reducer).toEqual({
        ...initialStoreState,
        products,
      })
      expect(
        store.getActions().find((action) => action.type === SET_PRODUCTS)
      ).toEqual(expectedAction)
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            products: products,
          })
        )
      )
      expect(wrapper.find("[data-testid='productsTitle']").text()).toBe(
        "List of products"
      )
      const productsTable = wrapper.find("[data-testid='productsTable']")
      expect(productsTable.exists()).toBeTruthy()
      const tableHeader = productsTable.find("thead").find("th")
      expect(tableHeader.length).toEqual(3)
      expect(tableHeader.get(0).props.children).toEqual("Product")
      expect(tableHeader.get(1).props.children).toEqual("Latest Price")
      const tableBody = productsTable.find("tbody").find("tr").children()
      expect(tableBody.length).toEqual(3)
      expect(tableBody.get(0).props.children).toEqual("Product Name")
      expect(tableBody.get(1).props.children).toEqual(["GHS", " ", "20.00"])
    })
    it("should contain an EditButton for each product row on table", () => {
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            products: [product],
          })
        )
      )
      const editProductButton = wrapper.find(
        "[data-testid='editProductButton']"
      )
      expect(editProductButton).toBeDefined()
      expect(editProductButton.find("Link").props().to).toBe(
        `${product.id}/edit`
      )
    })
    it("should contain an DeleteButton button for each product row on table", () => {
      const wrapper = mount(
        render(
          createStore({
            ...initialStoreState,
            products: [product],
          })
        )
      )
      window.confirm = jest.fn()
      const deleteProductButton = wrapper
        .find("[data-testid='deleteProductButton']")
        .find("button")
      expect(deleteProductButton).toBeDefined()
      deleteProductButton.simulate("click")
      expect(window.confirm).toHaveBeenCalled()
    })
    it("should remove product from store when product is deleted from table", () => {
      const products = [product, { ...product, id: 2 }]
      let expectedAction = {
        type: DELETE_PRODUCT,
        payload: 1,
      }
      const reducer = rootReducer(
        { ...initialStoreState, products },
        expectedAction
      )
      store.dispatch(deleteProduct(1))
      expect(reducer).toEqual({
        ...initialStoreState,
        products: [{ ...product, id: 2 }],
      })
      expect(
        store.getActions().find((action) => action.type === DELETE_PRODUCT)
      ).toEqual(expectedAction)
    })
  })
})

const render = (storeDetails: any = store) => {
  return (
    <Provider store={storeDetails}>
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    </Provider>
  )
}
