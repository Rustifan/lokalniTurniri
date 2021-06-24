import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom";
import { Button, Dropdown } from "semantic-ui-react"
import { store } from "../../Stores/store"

export default observer(() => {
    
    const {userStore} = store;
    const {user} = userStore;

    

    return user ? 
            (<Dropdown item text={user?.username}>
                <Dropdown.Menu>
                    
                    <Dropdown.Item as={Link} to={`/userProfile/${userStore.user?.username}`}>
                        Profil
                    </Dropdown.Item> 
                    <Dropdown.Item onClick={userStore.logout}>
                        Odjavi se
                    </Dropdown.Item> 
                </Dropdown.Menu>    
            </Dropdown>) :
            (
                <Dropdown item text="Gost"> 
                <Dropdown.Menu>
                    
                    <Dropdown.Item as={Button} onClick={()=>userStore.setLoginModalOpen(true)}>
                        Prijavi se
                    </Dropdown.Item>
                    <Dropdown.Item as={Button} onClick={()=>userStore.setRegisterModalOpen(true)}>
                        Registriraj se
                    </Dropdown.Item>
                    

                </Dropdown.Menu>    
            </Dropdown>) 
                
            
           
            
       


    
});