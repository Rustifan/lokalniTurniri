import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Route, RouteProps } from "react-router-dom"
import { history } from "../..";
import { store } from "../../Stores/store"

const PrivateRoute: React.FC<RouteProps> = props =>
{
    const {setLoginModalOpen, isLogedIn, loginModalOpen} = store.userStore;
    
    const [initialModalOpen, setInitialModalOpen] = useState(false);

    
    if(initialModalOpen && !loginModalOpen && !isLogedIn())
    {
        history.goBack();
    }
    

    useEffect(()=>
    {
        let mounted = true;

        if (mounted && !isLogedIn() && !initialModalOpen)
        {
            
            setLoginModalOpen(true);
            setInitialModalOpen(true);
           
            
        }
        return ()=>{mounted=false};
        
    }, [setLoginModalOpen, setInitialModalOpen, isLogedIn, initialModalOpen]);


    if(!isLogedIn())
    {
        return <></>;
    }
    return(
        <Route {...props}/>
    )
}


export default observer(PrivateRoute);