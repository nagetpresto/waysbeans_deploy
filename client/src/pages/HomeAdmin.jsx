import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import {Container, Table, Modal, Row} from 'react-bootstrap';
import { API } from '../config/api';

function HomeAdmin() {
    useEffect (() => {
        fakeAPI();
        AOS.init();
    })

    // Fetching transaction
    const [data, setData] = useState();
    const fakeAPI = async () => {
      try {
        const response = await API.get(`/transactions`);
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Handle detail
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState(false)
    const handleDetail = async (id) => {
        setDetail(data.find(item => item.id === id));
        setShowDetail(true)
    }
    const totalQty = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.qty, 0) : 0;
    const totalPrice = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.amount, 0) : 0; 
    

    return (
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
            <h5>Income Transaction</h5>
            <div className='mt-4 d-flex align-items-center justify-content-center'>
                <Table size="sm" bordered responsive="sm">
                    <thead>
                        <tr className=''>
                            <th style={{width: '100px'}}>ID</th>
                            <th style={{width: '300px'}}>User</th>
                            <th style={{width: '300px'}}>Name</th>
                            <th style={{width: '250px'}}>Address</th>
                            <th style={{width: '150px'}}>Post Code</th>
                            <th style={{width: '200px'}}>Products Order</th>
                            <th style={{width: '200px'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((data,i) => {
                                const status = data.status;
                                return(
                                    <tr style={{cursor: 'pointer'}} onClick={() => handleDetail(data.id)} key={i}>
                                        <td>{data.id}</td>
                                        <td>{data.user.name}</td>
                                        <td>{data.name}</td>
                                        <td>{data.address}</td>
                                        <td>{data.postal_code}</td>
                                        <td>{data.cart[0].product.name}, ...</td>
                                        <td>
                                            {status === 'Success'
                                            ? <span className="text-success">{data.status}</span>
                                            : status === 'Waiting Approval'
                                            ? <span className="text-warning">{data.status}</span>
                                            : status === 'Failed'
                                            ? <span className="text-danger">{data.status}</span>
                                            : <span className="text-danger">{data.status}</span>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>

            <Modal centered size="lg" show={showDetail} onHide={() => setShowDetail(false)}>
                <Modal.Body className='mx-4 my-2'>
                    <h5 className='mb-4 text-center'>Transaction Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>Trans ID</p>
                            <p className=''>Date</p>
                        </div>
                        <div className=' col-9'>
                            <p className='mb-0'>:  {detail.id}</p>
                            <p className=''>: {detail.day}, {detail.date}</p>
                        </div>
                    </Row>
                    <h5 className=''>User Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>User ID</p>
                            <p className='mb-0'>Name</p>
                            <p className=''>Email</p>
                        </div>
                        <div className='col-9'>
                            <p className='mb-0'>:  {detail && detail.user.id}</p>
                            <p className='mb-0'>:  {detail && detail.user.name}</p>
                            <p className=''>: {detail && detail.user.email}</p>
                        </div>
                    </Row>
                    <h5>Buyer Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>Name</p>
                            <p className='mb-0'>Address</p>
                            <p className='mb-0'>Postal Code</p>
                            <p className=''>Phone</p>
                            <p className='mb-0'>Qty</p>
                            <p className='mb-0'>Amount</p>
                            <p className=''>Status</p>
                        </div>
                        <div className=' col-9'>
                            <p className='mb-0'>:  {detail.name}</p>
                            <p className='mb-0'>:  {detail.address}</p>
                            <p className='mb-0'>:  {detail.postal_code}</p>
                            <p className=''>:  {detail.phone}</p>
                            <p className='mb-0'>:  {totalQty} Pcs</p>
                            <p className='mb-0'>:  Rp.{totalPrice}</p>
                            <p className='mb-0'>:  {detail.status}</p>
                        </div>
                    </Row>
                    <Table size="sm" bordered responsive="sm">
                        <thead>
                            <tr>
                                <th className='text-center' style={{width: '10px'}}>No</th>
                                <th className='text-center' style={{width: '200px', overflow:'hidden'}}>image</th>
                                <th className='text-center' style={{width: '240px'}}>Name</th>
                                <th className='text-center' style={{width: '100px'}}>Price</th>
                                <th className='text-center' style={{width: '100px'}}>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                        { detail.cart?.map((item, i) => {
                            return(
                                <tr className='text-center' key={i}>
                                    <td>{i+1}</td>
                                    <td className='d-flex justify-content-center align-items-center'>
                                        <div className='d-flex justify-content-center align-items-center' style={{width:'90px', height:'150px', overflow:'hidden'}}>
                                            <img className='img-fluid' src={item.product.image}/>
                                        </div>
                                    </td>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.price}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default HomeAdmin