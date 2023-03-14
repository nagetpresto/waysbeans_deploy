import {NavDropdown} from 'react-bootstrap';
import user from '../assets/image/user.png'
import logout from '../assets/image/logout.png'

function UserDropDown(props){
    const handleIsSignOut = () => {
        props.onChange();
      };
    return (
        <NavDropdown
            align="end"
        >
            <NavDropdown.Item href="/user-profile"><img width='20' className='me-2' src={user}/>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleIsSignOut}><img width='20' className='me-2' src={logout}/>Log Out</NavDropdown.Item>
        </NavDropdown> 
    )
}

export default UserDropDown