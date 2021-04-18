import { observer } from "mobx-react-lite"
import React from "react"
import { Button } from "semantic-ui-react";
import { LoginForm } from "../../App/Interfaces/User";
import {store} from "../../Stores/store"

export default observer(()=>
{
    
    const {userStore} = store;

    function handleLogin()
    {
        const loginForm: LoginForm =
        {
            email: "beki@test.com",
            password: "Asdf1234"
        }

        userStore.login(loginForm);
    }

    return(
    <>
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={userStore.logout}>Logout</Button>
    </>
    )
});