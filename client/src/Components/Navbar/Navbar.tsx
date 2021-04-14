
import React from "react"
import { Link } from "react-router-dom"
import { Button, Container, Icon, Menu } from "semantic-ui-react"

export default () => {
    return (
    <>
    
        <Menu inverted className="navbar">
            
                <Menu.Item>
                    <Icon name="home"/>
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="tournaments">Tournaments</Link>
                </Menu.Item>
                 
        </Menu>
    
    </>
    )
}