import React from "react"
import { Button, Container } from "semantic-ui-react"
import { agent } from "../../App/agent"

export default function ErrorTesting() {
    const notFound = async () => {
        try {

            await agent.TestErrors.notFound();
        }
        catch (err) {
            console.log("error")
        }
    }

    const badRequest = async () =>
    {
        try
        {
            await agent.TestErrors.badRequest();
        }
        catch(err)
        {
            console.log("error");
        }
    }

    const unauthorized = async ()=>
    {
        try
        {
            await agent.TestErrors.unauthorized();
        }
        catch(err)
        {
            console.log("error");
        }
    }

    const serverError = async ()=>
    {
        try
        {
            await agent.TestErrors.serverError();
        }
        catch(err)
        {
            console.log("error");
        }
    }

    return (
        <Container>
            <Button onClick={notFound} color="red">NotFound</Button>
            <Button onClick={badRequest} color="red">BadRequest</Button>
            <Button onClick={unauthorized} color="red">Unauthorized</Button>
            <Button onClick={serverError} color="red">Server error</Button>
        </Container>
    )
}