import React from 'react'
import logo from './commons/images/icon.png';
import { withRouter } from 'react-router-dom';

import {
    Button,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand, NavLink, UncontrolledDropdown,
} from 'reactstrap';

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

const navBarLogoStyle = {
    width: '60px',
    height: '60px',
    padding: '10px'
};

class NavigationBar extends React.Component {
    handleLogOut = () => {
        this.props.history.push('/');
    };

    render() {
        return (
            <div>
                <Navbar color="dark" light expand="md">
                    <NavbarBrand href="/home">
                        <img
                            src={logo}
                            style={navBarLogoStyle}
                            alt="Logo"
                        />
                    </NavbarBrand>
                    <Nav className="mr-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle style={textStyle} nav caret>
                                Menu
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    <NavLink href="/admin">Admin</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/home">Home</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href="/user">User</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>

                    <Button
                        color="danger"
                        onClick={this.handleLogOut}
                    >
                        Log out
                    </Button>

                    <div style={{ marginRight: '10px' }} />
                </Navbar>
            </div>
        );
    }
}

export default withRouter(NavigationBar)
