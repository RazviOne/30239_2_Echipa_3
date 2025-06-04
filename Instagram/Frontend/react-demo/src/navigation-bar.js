import React from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import '@fontsource/pacifico';


import InstaIcon from './commons/images/icon.png';
// import InstaLogo from './commons/images/Instagram_login_Logo.png';
import UserImg from './commons/images/user.png';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  logout() {
    sessionStorage.removeItem('user');
    this.props.history.push('/');
  }

  render() {
    return (
        <div
        style={{
            backgroundColor: '#262626',
            padding: '0.75rem 10%',
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'space-between'
        }}>
        
        
        <div
            style={{
            display: 'flex',
            alignItems: 'left',
            gap: '10px',
            flex: 1,
            }}
        >
            <img
            src={InstaIcon}
            alt="Logo"
            style={{ height: '40px', cursor: 'pointer' }}
            onClick={() => this.props.history.push('/home')}
            />
                <span
                onClick={() => this.props.history.push('/home')}
                style={{
                    color: 'white',
                    fontFamily: 'Pacifico, cursive',
                    fontSize: '1.8rem',
                    fontWeight: 'normal',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
                >
                Instagram
                </span>

        </div>

        {/* Mijloc: Dropdown */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret color="dark" style={{ backgroundColor: '#333' }}>
                Menu
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={() => this.props.history.push('/home')}>Feed</DropdownItem>
                <DropdownItem onClick={() => this.props.history.push('/profile')}>Profile</DropdownItem>
                <DropdownItem onClick={() => this.props.history.push('/admin')}>Admin</DropdownItem>
                {/* <DropdownItem divider />
                <DropdownItem onClick={this.logout}>Log out</DropdownItem> */}
            </DropdownMenu>
            </Dropdown>
        </div>

        {/* Dreapta: Avatar + Logout */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
            <img
            src={UserImg}
            alt="User"
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: 'white',
                cursor: 'pointer'
            }}
            onClick={() => this.props.history.push('/profile')}
            />
            <Button color="danger" size="sm" onClick={this.logout}>
            Log out
            </Button>
        </div>
        </div>
    );
  }
}

export default withRouter(NavigationBar);
