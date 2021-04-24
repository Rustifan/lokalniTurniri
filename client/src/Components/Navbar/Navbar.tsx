
import React from "react"
import { Link } from "react-router-dom"
import { Container, Icon, Menu } from "semantic-ui-react"
import UserMenu from "../Users/UserMenu"

export default function Navbar()
{
    


    const style = 
    {
        fontSize: 20
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
            
                <Menu.Item color="teal" position="right">
                    <UserMenu/>
                </Menu.Item>
        </Container>
        </Menu>
    
    </>
    )
}