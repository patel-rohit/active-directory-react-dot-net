import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);
    //  this.isAuthenticated = useIsAuthenticated();
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }




  render() {

    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">React + .NET Core</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                <PageLayout />
                {/* <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/fetch-data">
                    { isAuthenticated ? 'Sign In' : 'Sign Out'}
                    </NavLink>
                  </NavItem> */}
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header >
    );
  }
}



export const PageLayout = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch(e => {
        console.log(e);
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });
    }
  }
  return (
    <React.Fragment>
      {!isAuthenticated &&
        <React.Fragment>
          <button onClick={() => handleLogin("popup")} className="ml-5">
            Sign in using Popup
        </button>
          <button onClick={() => handleLogin("redirect")} className="ml-5">
            Sign in using Redirect
        </button>
        </React.Fragment>
      }

      {isAuthenticated &&
        <React.Fragment>
             <button variant="secondary" onClick={() => instance.logout()} className="ml-auto">Sign Out</button>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

