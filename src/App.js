import React from 'react'
import {NotificationContainer} from 'react-notifications';
import LoginForm from './components/login/LoginForm';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <LoginForm/>
        <NotificationContainer />
      </div>
    );
  }

}

export default App;
