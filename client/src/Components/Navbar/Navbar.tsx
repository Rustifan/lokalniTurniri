
import React from "react"
import { Link } from "react-router-dom"
import {  Button, Container, Icon, Label, Menu } from "semantic-ui-react"

export default () => {
    
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
                    <Link style={style} to="/">Home</Link>
                    
                </Menu.Item>
                <Menu.Item>
                    <Link style={style} to="/tournaments">Tournaments</Link>
                </Menu.Item>
            
                <Menu.Item color="teal" position="right">
                    <Icon name="user"/>
                    <Link style={style} to="/login">Login</Link>
                </Menu.Item>
        </Container>
        </Menu>
    
    </>
    )
}