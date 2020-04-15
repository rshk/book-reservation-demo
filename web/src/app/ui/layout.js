import React, {useState} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
} from 'reactstrap';
import {Link, NavLink as RouterNavLink} from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { getToken, doLogout } from 'lib/auth';
import { APPNAME, ICON } from 'app/config';


export default function Layout({children}) {

    // User data is needed by sub components
    const {data} = useQuery(gql`
        {
            info {
                version
                user {
                    id
                    email
                    displayName
                    imageUrl
                }
            }
        }
    `);

    const user = (data && data.info) ? data.info.user : null;

    return <div className="d-flex flex-column"
                style={{minHeight: '100vh'}}>
        <MainNavbar user={user} />
        <div style={{flex: 1}}>
            <Container>
                {children}
            </Container>
        </div>
        <footer className="text-muted">
            <Container>© 2020</Container>
        </footer>
    </div>;
}


function MainNavbar({user}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/">
            <img src={ICON} style={{height: 32, width: 32}} alt="" className="mr-3" />
            {APPNAME}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>

            <Nav className="mr-auto" navbar>

                <NavItem>
                    <NavLink tag={RouterNavLink} to="/">Requests</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink tag={RouterNavLink} to="/new/">New request</NavLink>
                </NavItem>

            </Nav>

            {false && <UserNavbar user={user} />}

        </Collapse>
    </Navbar>;
}


function UserNavbar(props) {
    if (!getToken()) {
        return <UserNavbarAnonymous {...props} />;
    }
    return <UserNavbarAuthenticated {...props} />;
}


function UserNavbarAuthenticated({user}) {
    return <Nav navbar>
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {user ? user.displayName : 'Logged in user'}
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem tag={RouterNavLink} to="/profile">
                    User profile
                </DropdownItem>
                <DropdownItem tag={RouterNavLink} to="/settings/password">
                    Change password
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={()=> doLogout()}>
                    Logout
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>

    </Nav>;
}


function UserNavbarAnonymous() {
    return <Nav navbar>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/login/">Login</NavLink>
        </NavItem>
    </Nav>;
}
