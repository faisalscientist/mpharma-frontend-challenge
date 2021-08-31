import React from "react"
import { SpinnerCircular } from "spinners-react"

const Loader = () => {
  return (
    <SpinnerCircular
      size={50}
      thickness={100}
      speed={100}
      color="rgba(57, 89, 172, 1)"
      secondaryColor="rgb(228 229 233)"
    />
  )
}

export default Loader
