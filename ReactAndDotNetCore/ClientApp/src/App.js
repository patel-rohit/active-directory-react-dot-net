import React, { Component, useState } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import './custom.css'
import { callMsGraph } from "./graph";



export default class App extends Component {


  static displayName = App.name;

  render() {
    return (
      <Layout>

        <React.Fragment>
          <AuthenticatedTemplate>

            <ProfileContent />

            <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <h5 className="card-title">Please sign-in to see your profile information.</h5>
          </UnauthenticatedTemplate>
        </React.Fragment>
      </Layout>
    );
  }
}


/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      callMsGraph(response.accessToken).then(response => setGraphData(response));
    });
  }

  return (
    <div style={{ marginTop: '10px', marginBottom: '10px'}}>
      <h5 className="card-title" >Welcome {accounts[0].name}</h5>
      {graphData ?
        <ProfileData graphData={graphData} />
        :
        <button variant="secondary" onClick={RequestProfileData}>Request Profile Information</button>
      }
    </div>
  );
};



/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
  console.log(props.graphData);

  return (
    <div id="profile-div">
      <p><strong>First Name: </strong> {props.graphData.givenName}</p>
      <p><strong>Last Name: </strong> {props.graphData.surname}</p>
      <p><strong>Email: </strong> {props.graphData.userPrincipalName}</p>
      <p><strong>Id: </strong> {props.graphData.id}</p>
    </div>
  );
};