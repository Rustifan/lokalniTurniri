import React, { useEffect } from 'react';
import {  Route,  Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import TournamentDetails from './Components/Tournaments/TournamentDetails';
import TournamentList from './Components/Tournaments/TournamentList';
import Login from './Components/Forms/Login';
import { store } from './Stores/store';
function App() {

  const {userStore} = store;

  useEffect(()=>
  {
    userStore.getUser();
  }, [userStore])

  return (
      <>
      <Navbar />
      <Login/>
      <Container style={{ marginTop: 0 }}>
        <Switch>
          <Route path="/tournaments/:id" component={TournamentDetails} key="asd"/>
          <Route path="/tournaments" component={TournamentList}/>
          <Route path="/">Homer</Route>
        </Switch>
      </Container>
      </>
)
}

export default App;



