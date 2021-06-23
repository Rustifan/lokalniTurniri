import { observer } from "mobx-react-lite";
import React from "react"
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon } from "semantic-ui-react"
import { store } from "../Stores/store";


export default observer(function Home()
{
    const {userStore} = store;
    const {setLoginModalOpen, setRegisterModalOpen, isLogedIn} = userStore;

    return(
        <div className="HomeComponent">

            <Container style=
                {{display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexDirection: "column"}}>
                <Header 
                    style={{marginBottom: 30, fontSize: "40px"}}
                    as="h1" 
                    size="huge" 
                    textAlign="center" 
                    inverted >
                    <Icon color="yellow" name="winner"/>
                    Lokalni turniri
                </Header>
                {isLogedIn() ? 
                <div>
                    <Button 
                        as={Link} 
                        to="/tournaments" 
                        inverted 
                        size="huge" 
                        content="Uđi na Lokalne turnire"/>

                </div> :
                <>
                <div className="HomeButtons">
                    <Button 
                        onClick={()=>setLoginModalOpen(true)}
                        inverted 
                        size="huge">
                            
                            Ulogiraj se</Button>
                    <Button 
                        onClick={()=>setRegisterModalOpen(true)}
                        inverted 
                        size="huge">
                            Registriraj se</Button>
                </div>
                <Divider horizontal inverted content="ili"/>
                <div>
                    <Button as={Link} to="/tournaments" inverted size="huge" content="Uđi kao gost"/>
                </div>
                </>
            }
            </Container>

        </div>
    )
});

