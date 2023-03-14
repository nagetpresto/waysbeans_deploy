import {Container, Row, Modal, Button} from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import plus from "../assets/image/+.png"
import minus from "../assets/image/-.png"
import bin from "../assets/image/bin.png"
import { API } from '../config/api';
import ShippingForm from '../components/shipping';

function MyCart(){
    useEffect (() => {
        AOS.init();
        cartData();
        handleAddQty();
        handleMinusQty();
    })

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

    // Calculating Item
    const totalQty = cart.length > 0 ? cart.reduce((total, item) => total + item.qty, 0) : 0;
    const totalPrice = cart.length > 0 ? cart.reduce((total, item) => total + item.amount, 0) : 0; 
    
    const [showModal, setShowModal] = useState(false);
    const [showShipping, setShowShipping] = useState(false);
    // Increasing qty
    const handleAddQty = async (id, e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            const data = {
                qty: 1+toUpdate.qty,
            };
      
            const body = JSON.stringify(data);
      
            await API.patch(`/carts/${id}`, body, config);
            setShowModal(true);
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Reducing qty
    const handleMinusQty = async (id,e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            const data = {
                qty: toUpdate.qty-1,
            };

            if (data.qty === 0){
                await API.delete(`/carts/${id}`, config);
                setShowModal(true);
            }else{
                const body = JSON.stringify(data);
      
                await API.patch(`/carts/${id}`, body, config);
                setShowModal(true);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Deleting Qty
    const handleDelQty = async (id,e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            await API.delete(`/carts/${id}`, config);
            setShowModal(true);
        } 
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
            <h5>My Cart</h5>
            <p className="mb-0 mt-4">Review Your Order</p>
            <Row>
                <div className='col-md-8 col-12'>                    
                    <hr className='mt-1'></hr>
                    <Row style={{gap:'10px'}}>
                        {
                            cart?.map((item, i) => {
                                return (
                                    <div key={i} className='d-flex flex-row'>
                                        <div className='cart-img col-2'>
                                            <img className='img-fluid' src={"http://localhost:5000/uploads/" + item.product.image}/>
                                        </div>
                                        <div className='ps-3 col-10 d-flex flex-column justify-content-center'>
                                            <div className="cart-detail-1 d-flex flex-row">
                                                <h5>{item.product.name}</h5>
                                                <div className='ms-auto'>
                                                    <p>Rp.{item.product.price}</p>
                                                </div>
                                            </div>
                                            <div className="cart-detail-2 d-flex flex-row">
                                                <div>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleMinusQty(item.id)} className="img-fluid" src={minus}/>
                                                    <span className='amount mx-3 px-3'>{item.qty}</span>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleAddQty(item.id)} className="img-fluid" src={plus}/>
                                                </div>
                                                <div className='ms-auto'>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleDelQty(item.id)} className="img-fluid" src={bin}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Row>
                    <hr></hr>
                </div>

                <div className='col-md-4 col-12'>
                    <hr className="mb-2 mt-1"></hr>
                    <div className="cart-detail-1 d-flex flex-row">
                        <p>Sub Total</p>
                        <div className='ms-auto'>
                            <p>Rp.{totalPrice}</p>
                        </div>
                    </div>
                    <div className="cart-detail-2 d-flex flex-row">
                        <p>Qty</p>
                        <div className='ms-auto'>
                            <p>{totalQty}</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="cart-detail-3 d-flex flex-row">
                        <p>Total</p>
                        <div className='ms-auto'>
                            <p>Rp.{totalPrice}</p>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                        <Button onClick={() => setShowShipping(true)} variant="outline-primary" className='col-8 d-flex justify-content-center align-items-center py-1'>Check Out</Button>
                    </div>
                </div>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Update Cart
                    </Modal.Body>
            </Modal>
            <ShippingForm show={showShipping} onHide={() => setShowShipping(false)}/>            
        </Container>
    )
}

export default MyCart