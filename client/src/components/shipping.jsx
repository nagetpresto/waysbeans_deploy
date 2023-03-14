import { Modal, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { API } from '../config/api';

function ShippingForm(props) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postal, setPostal] = useState('');
  const [phone, setPhone] = useState('');
  const [showModalPay, setShowModalPay] = useState(false);

  // Submit handler
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify({
        name:           name,
        address:        address,
        postal_code:    postal,
        phone:          phone,
      });

      const response = await API.patch("/transactions", body, config);
      const token = response.data.data.token;
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          setShowModalPay(true)
          navigate("/user-profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          setShowModalPay(true)
          navigate("/user-profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          setShowModalPay(true)
          navigate("/user-profile");
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      })
      // window.location.replace('/user-profile')

    } catch (error) {
      console.log(error);
    }
  });

  // Snap
  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
  
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <Modal {...props}
      centered
      >     
      <Modal.Body className='mx-4 my-2'>
        <Modal.Title className='mb-4'>Shipping Detail</Modal.Title>

        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className='mb-4' controlId="formBasicEmail">
            <Form.Control value={name} 
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Full Name" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
          <Form.Control value={address} 
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                required
                placeholder="Address" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
          <Form.Control value={postal} 
                onChange={(e) => setPostal(e.target.value)}
                type="text"
                required
                placeholder="Postal Code" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
          <Form.Control value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                placeholder="Phone" />
          </Form.Group>

          <Button className='col-12 mb-2' variant="outline-primary" type="submit">
            Pay
          </Button>
        </Form>
      </Modal.Body>

      <Modal show={showModalPay} onHide={() => setShowModalPay(false)}>
            <Modal.Body className='text-success text-center'>
                Thank you for ordering in us, please wait 1 x 24 hours to verify you order
            </Modal.Body>
    </Modal>

    </Modal>
  );
}

export default ShippingForm