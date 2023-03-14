import {NavDropdown} from 'react-bootstrap';
import beans from '../assets/image/beans.png'
import logout from '../assets/image/logout.png'

function AdminDropDown(props){
    const handleIsSignOut = () => {
        props.onChange();
      };
    return (
        <NavDropdown
            align="end"
        >
            <NavDropdown.Item href="/add-product"><img width='20' className='me-2' src={beans}/>Add Product</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/list-product"><img width='20' className='me-2' src={beans}/>List Product</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleIsSignOut}><img width='20' className='me-2' src={logout}/>Log Out</NavDropdown.Item>
        </NavDropdown> 
    )
}

export default AdminDropDown