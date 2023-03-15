import './App.css';
import './assets/style/style.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import {Container, Nav, Navbar, Button} from 'react-bootstrap';
import { useContext } from "react";
import { UserContext } from "./context/userContext"
import { API, setAuthToken } from './config/api';

import navLogo from './assets/image/logo.png';
import shopBasket from './assets/image/shopping-basket.png'
import Home from './pages/Home'
import HomeAdmin from './pages/HomeAdmin';
import UserDropDown from './components/UserDropDown';
import AdminDropDown from './components/AdminDropDown';
import ProductDetail from './pages/ProductDetail';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import MyCart from './pages/MyCart';
import UserProfile from './pages/UserProfile';
import AddProduct from './pages/AddProuct';
import ListProduct from './pages/ListProduct';
import UpdateProduct from './pages/UpdateList';
import EmailConfirm from './pages/EmailConfirm';
import PrivateRoute from './privateRoot/privateRoot';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  // modal handler
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleLoginModal = () => {
    setShowSignInModal(!showSignInModal);
  };
  const handleRegisterModal = () => {
    setShowSignUpModal(!showSignUpModal);
  };
  const handleModalSwitch = () => {
    setShowSignInModal(!showSignInModal);
    setShowSignUpModal(!showSignUpModal);
  };

  // Login Handler
  const [state, dispatch] = useContext(UserContext);
  const isSignIn = state.isLogin;
  const status = state.user.status;

  // Logout Hanldler
  function handleLogOut() {
    window.location.replace('/')
    dispatch({
      type: "LOGOUT",
    });
  
  }

  // Calculating Cart Item
  const [cart, setCart] = useState([]);
  const cartData = async () => {
    try {
      const response = await API.get(`/carts-active`);
      if (response.data.code === 200) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const itemTotal = cart.length;

  // Fetch user
  const [profile, setProfile] = useState();
  const User = async () => {
    try {
      const response = await API.get(`/profile`);
      if (response.data.code === 200) {
        setProfile(response.data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AOS.init();
    cartData();
    User();
  })

  return (
    <div>
      <Navbar expand="lg" className='bg-light shadow fixed-top' data-aos="fade-down" data-aos-delay="100">
        <Container>
          <Navbar.Brand href="/">
            <img src={navLogo} width="120" alt="Logo"/>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3">
              {isSignIn === true ?
              <>
                {status === "admin" ? 
                  <div></div> :
                  <div style={{ position: 'relative' }} className='d-flex justify-content-start align-items-center'>
                    <a href="/my-cart"><img src={shopBasket} className="shopping-basket me-2" alt="Logo"/></a>
                    {itemTotal === 0 ? <p></p> :
                    <div className='item text-center'>
                      <p>{itemTotal}</p> 
                    </div>
                    }
                  </div>
                  }
                  <div className='user-profile bg-dark d-flex justify-content-center align-items-center'>
                    <img src={profile} className="img-fluid" alt=""/>
                  </div> 
                  {status === "admin" ? 
                    <AdminDropDown onChange={handleLogOut}/> :
                    <UserDropDown onChange={handleLogOut}/>
                }
              </> :
              <>
                <Button onClick={handleLoginModal} variant="outline-primary" className='d-flex justify-content-center align-items-center py-0'>Login</Button>
                <Button onClick={handleRegisterModal} variant="outline-primary" className='d-flex justify-content-center align-items-center py-0'>Register</Button>
              </>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SignInForm show={showSignInModal} onHide={handleLoginModal} onSwitch={handleModalSwitch}/>
      <SignUpForm show={showSignUpModal} onHide={handleRegisterModal} onSwitch={handleModalSwitch} />

      <Routes>
        <Route path="/cofirm-email-status/:code" element={<EmailConfirm />} />
        {status === "admin" ? 
          <Route path="/" element={<HomeAdmin />} /> :
          <Route path="/" element={<Home />} /> 
        }
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/my-cart" element={itemTotal === 0 ?
            <div className='my-cart' data-aos="fade-down" data-aos-delay="200">
              Your cart is empty please check <a style={{textDecoration:'none'}}href="/">our product</a>
            </div> :
            <MyCart />}/>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/list-product" element={<ListProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
        </Route> 
      </Routes>
    </div>
  );
}

export default App;
