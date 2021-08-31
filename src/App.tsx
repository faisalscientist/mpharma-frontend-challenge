import { BrowserRouter, Route, Switch } from "react-router-dom"
import AddProduct from "./AddProduct"
import EditProduct from "./EditProduct"
import Products from "./Products"
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from "react-redux"
import store, { persistor } from "./store"

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="m-auto my-40">
          <div className="flex">
            <div className="m-auto" style={{ width: "500px" }}>
              <BrowserRouter>
                <Switch>
                  <Route path="/" component={Products} exact />
                  <Route path="/new" component={AddProduct} exact />
                  <Route path="/:id/edit" component={EditProduct} exact />
                </Switch>
              </BrowserRouter>
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  )
}

export default App
