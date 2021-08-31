import React from "react"

const ErrorMessage = ({ message }: { message: string }) => {
  return <div className="text-red-500 font-bold text-xl">{message}</div>
}

export default ErrorMessage
