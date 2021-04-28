import React, { useEffect } from 'react';
import {  Route,  Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import TournamentDetails from './Components/Tournaments/TournamentDetails';
import TournamentList from './Components/Tournaments/TournamentList';
import Login from './Components/Forms/Login';
import { store } from './Stores/store';
import Register from './Components/Forms/Register';
import ErrorTesting from './Components/Errors/ErrorTesting';
import NotFoundPage from './Components/Errors/NotFound';
import FlashError from './Components/Errors/FlashError';
import { observer } from 'mobx-react-lite';
import { history } from '.';
import CreateTournamentForm from './Components/Forms/CreateTournament';
function App() {

  const {userStore, errorStore} = store;
  const {error} = errorStore;

  useEffect(()=>
  {
    userStore.getUser();
  }, [userStore])

  //clear error on history change
  history.listen(()=>
  {
      errorStore.removeError();
  })

  return (
      <>
      <Navbar />

      {error &&
      <FlashError error={error}/>}

      <Login/>
      <Register/>
      <Container style={{ marginTop: 0 }}>
        <Switch>
          <Route exact path="/">Homer</Route>
          <Route path="/tournaments/:id" component={TournamentDetails} key="asd"/>
          <Route path="/tournaments" component={TournamentList}/>
          <Route path="/createTournament" component={CreateTournamentForm}/>
          <Route path="/errorTesting" component={ErrorTesting}/>
          <Route component={NotFoundPage}/>
        </Switch>
      </Container>
      </>
)
}

export default observer(App);



