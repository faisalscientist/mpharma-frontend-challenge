import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import ErrorMessage from "./ErrorMessage"
import { editProduct, getProduct } from "./store/action-creators"
import {
  EditProductType,
  ProductParamsType,
  ProductType,
  RootState,
} from "./types"

const BackButton = () => (
  <button className="flex items-center border-2 border-gray-400 px-3 py-2 rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>{" "}
    <div>Back</div>
  </button>
)

const EditProduct = () => {
  const dispatch = useDispatch()
  let { id } = useParams<ProductParamsType>()

  const product: ProductType = useSelector(
    (state: RootState) => state.product as ProductType
  )

  const [productDetails, setProductDetails] = useState<EditProductType>({
    id: +id,
    name: "",
    price: 0,
  })
  const [successMessage, setSuccessMessage] = useState<string>("")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setProductDetails({
      ...productDetails,
      [e.target.name as string]: e.target.value as string,
    })
  }

  const handleSumit = (e: React.SyntheticEvent) => {
    setSuccessMessage("")
    e.preventDefault()
    dispatch(editProduct(productDetails))
    setSuccessMessage(`You have successfully updated ${product.name}`)
  }

  useEffect(() => {
    dispatch(getProduct(id))
    setProductDetails({
      ...productDetails,
      name: product?.name,
      price: product?.prices[0].price,
    })
  }, [dispatch, id, product])

  if (!product) {
    return <ErrorMessage message={`No product found with id: ${1}`} />
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Link to="/">
          <BackButton />
        </Link>
        <div>
          Edit product: <b>{product.name}</b>
        </div>
      </div>
      <div className="mt-10">
        {successMessage && (
          <div className="mb-2 border-2 border-green-300 py-2 px-2 text-center text-green-700 bg-green-200 rounded-sm">
            {successMessage}
          </div>
        )}
      </div>
      <div className="border-2 border-gray-200 px-5 py-5 shadow-lg">
        <form onSubmit={handleSumit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-500">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="input"
              onChange={handleInputChange}
              value={productDetails?.name}
              placeholder="Enter product name"
              autoFocus
            />
          </div>
          <div className="flex flex-col mt-5">
            <label htmlFor="price" className="text-gray-500">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              className="input"
              placeholder="Enter price"
              value={productDetails?.price}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="mt-8 mb-5 rounded-full bg-blue-500 text-white px-3 py-2"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
