import { shallow } from "enzyme"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import App from "../App"
import store from "../store"

describe("EditProduct Test", () => {
  it("should be defined", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    )
    expect(wrapper.text()).toBeDefined()
  })
})
