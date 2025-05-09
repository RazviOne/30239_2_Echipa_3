import React from 'react'
import logo from './commons/images/icon.png';

import {
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

const NavigationBar = () => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/">
                <img
                    src={logo}
                    style={navBarLogoStyle}
                />
            </NavbarBrand>
            <Nav className="mr-auto" navbar>

                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle style={textStyle} nav caret>
                        Menu
                    </DropdownToggle>
                    <DropdownMenu right >

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
        </Navbar>
    </div>
);

export default NavigationBar
