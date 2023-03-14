import {Container, Modal, Row, Button} from 'react-bootstrap';
import { useParams } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import { useMutation } from 'react-query';
import { API } from '../config/api';
import { useContext } from "react";
import { UserContext } from '../context/userContext';

function ProductDetail(){
    useEffect (() => {
        fakeAPI();
        AOS.init();
        cartData();
    })

    // Fetching product data
    const params = useParams();
    const [data, setData] = useState();
    const fakeAPI = async () => {
      try {
        const response = await API.get(`/products/${params.id}`);
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Fetching cart data
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

    // confrim context
    const [state, dispatch] = useContext(UserContext);
    const isConfirmed = state.user.is_confirmed;
    const [showConfirm, setShowConfirm] = useState(false);

    // Handle Add to cart
    const [showModal, setShowModal] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const { id } = useParams(); 
    const intId = parseInt(id, 10);
    const addToCart = useMutation(async (e) => {
        if (localStorage.token) {
            if(isConfirmed === true){
                const toUpdate = cart.find(item => item.id === intId);
                    if (toUpdate.qty < data.stock){
                        try {
                            e.preventDefault();
                      
                            const config = {
                                headers: {
                                "Content-type": "application/json",
                                },
                            };
                      
                            const data = {
                                product_id: intId,
                            };
        
                            const body = JSON.stringify(data);
                      
                            await API.post("/carts", body, config);
                            setShowModal(true);
                      
                        } catch (error) {
                        console.log(error);
                        }
                    }else{
                        setShowStock(true)
                    }
            }else{
                setShowConfirm(true);
            }
        }else{
            setShowLogin(true)
        }
    });

    return (
        <Container className='landing-page' data-aos="fade-down" data-aos-delay="200">
            <Row className='product-detail d-flex justify-content-start px-4 px-md-0 py-4 py-md-0'>
                <div className='detail-left col-12 col-md-5'>
                    <img src={"http://localhost:5000/uploads/" +data?.image} alt="Logo" className='img-fluid'/>
                </div>
                <div className='detail-right flex-column col-12 col-md-7'>
                    <h4 className="mb-0">{data?.name}</h4>
                    <p className="mb-4">stock : {data?.stock}</p>
                    <p className="product-description">{data?.description}</p>
                    <span className="mt-2 mb-5">Rp.{data?.price}</span>
                    <Button  onClick={ (e) => addToCart.mutate(e)} variant="outline-primary" className='add-chart d-flex justify-content-center align-items-center py-1'>{addToCart.isLoading ? "Loading...": "Add Cart"}</Button>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Add Product
                    </Modal.Body>
                </Modal>
                <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                    <Modal.Body className='text-danger text-center'>
                        Please confirm your email to proceed transaction!
                    </Modal.Body>
                </Modal>
                <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                    <Modal.Body className='text-danger text-center'>
                        Please login or register to proceed transaction!
                    </Modal.Body>
                </Modal>
                <Modal show={showStock} onHide={() => setShowStock(false)}>
                    <Modal.Body className='text-danger text-center'>
                        You cannot add product more than the stock 
                    </Modal.Body>
            </Modal>
            </Row>
        </Container>
    )
}

export default ProductDetail;
