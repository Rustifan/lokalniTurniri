
import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom"
import { Button, Container, Icon, Menu } from "semantic-ui-react"
import { store } from "../../Stores/store"
import UserMenu from "../Users/UserMenu"
import CSS from "csstype"

export default observer(function Navbar()
{
    
    const unreadMessages = store.messageStore.getUnreadMessages();

    
    const style: CSS.Properties = 
    {
        fontSize: "20px"
    }
    
    return (
    <>

        <Menu inverted className="navbar">
        <Container>    
                <Menu.Item>
                    
                    <Icon name="home"/>
                    <Link style={style} to="/">Lokalni Turniri</Link>
                    
                </Menu.Item>
                <Menu.Item>
                    <Link style={style} to="/tournaments">Turniri</Link>
                </Menu.Item>

               {/*  {process.env.NODE_ENV === "development" &&
                <Menu.Item>
                    <Link style={style} to="/errorTesting">Error Testing</Link>
                </Menu.Item>
                 }
                */}

                <Menu.Item>
                    <Link  style={style} to="/createTournament">Kreiraj turnir</Link>
                </Menu.Item> 
                
                
                <Menu.Item color="teal" position="right">
                    <UserMenu/>
                </Menu.Item>
                {store.userStore.isLogedIn() &&
                <Menu.Item>
                    <Button
                        inverted 
                        content=
                        {<>
                           Poruke
                        {unreadMessages > 0 && 
                        <div style={{position: "absolute", right: "-10px", top: "-10px"}} className="unreadMessages">{unreadMessages}</div> 
                        }
                        </>} 
                        basic 
                        circular 
                        icon={{name: "chat",  color: "blue"}}
                        as={Link}
                        to={"/messages"}
                        />
                </Menu.Item>
                }
        </Container>
        </Menu>
    
    </>
    )
});