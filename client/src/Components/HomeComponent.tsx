import { observer } from "mobx-react-lite";
import React from "react"
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon } from "semantic-ui-react"
import { store } from "../Stores/store";
import GoogleLogin from 'react-google-login';


export default observer(function Home()
{
    const {userStore} = store;
    const {setLoginModalOpen, setRegisterModalOpen, isLogedIn,
        googleLogin, googleLoginError} = userStore;

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
                <GoogleLogin
                    
                    clientId={process.env.REACT_APP_GOOGLE_ID || ""}
                    buttonText="Prijavi se se pomoću Googla"
                    onSuccess={googleLogin}
                    onFailure={googleLoginError}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps=>
                    (
                        <Button 
                            
                            inverted
                            onClick={renderProps.onClick}
                            icon="google"
                            content="Ulogiraj se pomoću googla"
                            size="huge"
                        />
                    )}
                />
                </div>
                <Divider horizontal inverted content="ili"/>
                <div>
                    <Button as={Link} to="/tournaments" inverted size="huge" content="Uđi kao gost"/>
                </div>
                <div>
                </div>
                </>
            }
            </Container>

        </div>
    )
});

