import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom"
import { Button, Dropdown } from "semantic-ui-react"
import { store } from "../../Stores/store"

export default observer(() => {
    
    const {userStore} = store;
    const {user} = userStore;

    

    return user ? 
            (<Dropdown item text={user?.username}>
                <Dropdown.Menu>
                    
                    <Dropdown.Item>
                        Settings
                    </Dropdown.Item> 
                    <Dropdown.Item onClick={userStore.logout}>
                        Logout
                    </Dropdown.Item> 
                </Dropdown.Menu>    
            </Dropdown>) :
            (
                <Dropdown item text="Guest"> 
                <Dropdown.Menu>
                    
                    <Dropdown.Item as={Button} onClick={()=>userStore.setLoginModalOpen(true)}>
                        Login
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/login">
                        Register
                    </Dropdown.Item>
                    

                </Dropdown.Menu>    
            </Dropdown>) 
                
            
           
            
       


    
});