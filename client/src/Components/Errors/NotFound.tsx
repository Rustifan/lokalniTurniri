import React from "react"
import { Link } from "react-router-dom"
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react"

interface Props
{
    text?: string;
    status?: number;
}

export default function NotFoundPage({text="Jebiga nismo ništa našli", status=404}: Props) {

    return (
        <Container style={{marginTop: 40}}>
            <Header style={{marginBottom: 40}}  textAlign="center" as="h1">Greška {status}</Header>
            <Segment placeholder>
                <Header icon>
                    <Icon size="huge" name='search' />

                    {text}
                </Header>
                <Segment.Inline>
                    <Button primary as={Link} to="/tournaments">Odi na turnire</Button>

                </Segment.Inline>
            </Segment>
        </Container>
    )
}