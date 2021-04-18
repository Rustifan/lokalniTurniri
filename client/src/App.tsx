import React, { useEffect } from 'react';
import {  Route,  Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import TournamentList from './Components/Tournaments/TournamentList';
import Login from './Components/Users/Login';
function App() {

  
  return (
      <>
      <Navbar />
      <Container style={{ marginTop: 0 }}>
        <Switch>
          <Route path="/tournaments" component={TournamentList}/>
          <Route path="/login" component={Login}></Route>
          <Route path="/">Homer</Route>
        </Switch>
      </Container>
      </>
)
}

export default App;


