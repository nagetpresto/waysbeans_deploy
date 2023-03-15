import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from "react";
import {Container, Button, Modal, Form} from 'react-bootstrap';
import upload from "../assets/image/upload.png"
import { useMutation } from 'react-query';
import { API } from '../config/api';

export default function AddProduct() {
    useEffect(() => {
        AOS.init();
    })

    // initialize
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        stock: '',
        price: '',
        description: '',
        image: ''
      });

    // Input Handle
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct({...product, [name]: value});
    };

    // File handler
    const [preview, setPreview] = useState(false);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProduct({...product, image: file})

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreview(reader.result);
          };
      };

    // Submit handler
    const handleSubmit = useMutation(async (e) => {
        try {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await API.post(`/products`, product, config);
        setShowModal(true)
        window.location.replace('/list-product')

        } catch (error) {
        console.log(error);
        }
    });

    return (
        <Container className="my-cart" data-aos="fade-down" data-aos-delay="100">
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <div className='col-12 col-md-6 px-3'>
                    <h5 className='mb-4'>Add Product</h5>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="name"
                            type="text"
                            value={product.name} onChange={handleInputChange}
                            placeholder="Name"
                            required />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="stock"
                            type="number"
                            value={product.stock} onChange={handleInputChange}
                            placeholder="Stock" 
                            required/>
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="price"
                            type="number"
                            value={product.price} onChange={handleInputChange}
                            placeholder="Price" 
                            required/>
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control required name="description" value={product.description} onChange={handleInputChange} className='mb-4' placeholder="Product Description" as="textarea" rows={3} />
                        </Form.Group>

                        <Form.Group className='mb-4'>
                            <Form.Control
                            id="upload"
                            name="image"
                            className="custom-file-input"
                            type="file"
                            accept="image/*"
                            // required
                            onChange={handleFileChange} />
                            <label className="upload px-2 py-1" for="upload">Product Photo
                                <img className="ms-3" src={upload}/>
                            </label>
                        </Form.Group>

                        <div className='text-center'>
                        <Button className='col-6 mb-2' variant="outline-primary" type="submit">
                            {handleSubmit.isLoading ? "Loading..." : "Add Product"}
                        </Button>
                        </div>
                    </Form>
                </div>
                <div className='px-3 py-3 col-12 col-md-6 d-flex flex-row justify-content-center align-items-center'>
                    <div style={{overflow:'hidden', width:'600px'}} className="d-flex justify-content-center align-items-center">
                        <img className="img-fluid" src={preview}/>
                        {/* /image/gutemala-beans.png */}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Add Product
                    </Modal.Body>
            </Modal>
        </Container>
    )
}