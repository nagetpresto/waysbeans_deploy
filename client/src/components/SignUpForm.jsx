import { Modal, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from '../context/userContext';
import { useMutation } from 'react-query';
import { API } from '../config/api';

function SignUpForm(props) {
  // calling modal switch handler 
  const handleSwitchToLogin = () => {
    props.onSwitch();
  };

  // input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Register handle
  const [showNotif, setNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleSubmitRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify({
        email:    email,
        password: password,
        name:     name,
      });

      await API.post("/register", body, config);
      setNotif(true);

      } catch (error) {
        console.log(error);
        setShowModal(true)
      }
  });

  return (
    <Modal {...props}
      centered
      >     
      <Modal.Body className='mx-4 my-2'>
        <Modal.Title className='mb-4'>Register</Modal.Title>

        <Form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
          <Form.Group className='mb-4' controlId="formBasicEmail">
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control 
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full Name" />
          </Form.Group>

          <Button className='col-12 mb-2' variant="outline-primary" type="submit">
            Register
          </Button>
          <Form.Text className="d-flex justify-content-center">
              Already have an account? klik <span onClick={handleSwitchToLogin}>Here</span>
          </Form.Text>
        </Form>
      </Modal.Body>

      <Modal show={showNotif} onHide={() => setNotif(false)}>
          <Modal.Body className='text-success text-center'>
              Register Success. Please Check your Email to confirm!
          </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Body className='text-success text-center'>
              Email is already Registered
          </Modal.Body>
      </Modal>

    </Modal>
    
  );
}

export default SignUpForm