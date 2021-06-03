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
import EditTournament from './Components/Forms/EditTournament';
import UserProfile from './Components/Users/UserProfile';
import EditProfile from './Components/Users/EditProfile';
import Messages from './Components/Messages/Messages';
import HomeComponent from './Components/HomeComponent';
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
          <Route exact path="/"><HomeComponent/></Route>
          <Route exact path="/tournaments/:id" component={TournamentDetails}/>
          <Route exact path="/tournaments/:id/edit" component={EditTournament}/>
          <Route path="/tournaments" component={TournamentList}/>
          <Route path="/createTournament" component={CreateTournamentForm}/>
          <Route path="/errorTesting" component={ErrorTesting}/>
          <Route exact path="/userProfile/:username" component={UserProfile}/>
          <Route exact path="/userProfile/:username/edit" component={EditProfile}/>
          <Route exact path="/messages" component={Messages}/>
          <Route component={NotFoundPage}/>
        </Switch>
      </Container>
      </>
)
}

export default observer(App);



