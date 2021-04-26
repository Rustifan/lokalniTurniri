import React from "react"
import { Link } from "react-router-dom"
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react"

export default function NotFoundPage() {

    return (
        <Container style={{marginTop: 40}}>
            <Header style={{marginBottom: 40}}  textAlign="center" as="h1">Greška 404</Header>
            <Segment placeholder>
                <Header icon>
                    <Icon size="huge" name='search' />

                    Jebiga Nismo ništa našli
                </Header>
                <Segment.Inline>
                    <Button primary as={Link} to="/tournaments">Odi na turnire</Button>

                </Segment.Inline>
            </Segment>
        </Container>
    )
}