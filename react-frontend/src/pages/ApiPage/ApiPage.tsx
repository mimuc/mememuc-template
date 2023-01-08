import "swagger-ui-react/swagger-ui.css"
import SwaggerUI from "swagger-ui-react"

export const ApiPage = () => {
    return <SwaggerUI url={"/openapi.yaml"}/>
}