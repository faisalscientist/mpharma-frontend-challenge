import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"
import { deleteProduct } from "./store/action-creators"
import { fetchProducts } from "./store/action-creators"
import { ProductsState, ProductType, RootState } from "./types"

const DeleteButton = ({ id }: { id: number }) => {
  const dispatch = useDispatch()
  const handleDelete = () => {
    if (window.confirm("Sure want to delete?")) {
      dispatch(deleteProduct(id))
    }
  }
  return (
    <button onClick={handleDelete}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  )
}

const EditButton = ({ id }: { id: number }) => (
  <Link to={`${id}/edit`}>
    <button className="mr-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
  </Link>
)

const AddButton = () => (
  <Link to="new">
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  </Link>
)

const Products = () => {
  const dispatch = useDispatch()

  const productsState: ProductsState = useSelector((state: RootState) => state)
  const products = productsState.products.map((product: ProductType) => {
    product.prices = product.prices.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return product
  })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  if (productsState.loading) {
    return <Loader data-testid="loader" />
  }

  if (productsState.productError !== "") {
    return (
      <ErrorMessage
        data-testid="productError"
        message={productsState.productError}
      />
    )
  }

  return (
    <>
      <div className="w-full" data-testid="productsSection">
        <div className="text-center mb-5 text-xl font-bold flex justify-between items-center">
          <div data-testid="productsTitle">
            {products.length > 0 ? "List of products" : "No products available"}
          </div>
          <AddButton data-testid="addProductButton" />
        </div>
        {products.length > 0 && (
          <table
            className="shadow-lg bg-white w-full"
            data-testid="productsTable"
          >
            <thead>
              <tr>
                <th className="bg-blue-100 border text-left px-8 py-4">
                  Product
                </th>
                <th className="bg-blue-100 border text-left px-8 py-4">
                  Latest Price
                </th>
                <th className="bg-blue-100 border text-left px-8 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border px-8 py-4">{product.name}</td>
                  <td className="border px-8 py-4">
                    GHS{" "}
                    {product.prices.length > 0
                      ? product.prices[0].price.toFixed(2)
                      : "-"}
                  </td>
                  <td className="border px-8 py-4 flex items-center">
                    <div className="mt-1">
                      <EditButton
                        data-testid="editProductButton"
                        id={product.id}
                      />
                    </div>
                    <DeleteButton
                      data-testid="deleteProductButton"
                      id={product.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Products
