import {Container, Row} from 'react-bootstrap';
import landingLogo from '../assets/image/landingPage.png';
import landingImage from '../assets/image/landingImage.png';
import landingWaves from '../assets/image/landingWaves.png';

function LandingPage() {

    return (
        <Container className='landing-page'>
            <Row className='display-flex justify-content-center px-4 px-md-0 py-4 py-md-0'>
                <div className='col-12 col-md-11 landing-right ps-md-5 ps-3'>
                    <img src={landingLogo} alt="Logo" className='landing-logo pt-3 pt-md-5'/>
                    <h4 className='pt-2'>BEST QUALITY COFFEE BEANS</h4>
                    <p className='pb-3 pb-md-5 pt-2 pt-md-3'>Quality freshly roasted coffee made just for you.
                    <br />Pour, brew, and enjoy</p>
                </div>
                <div className='col-12 col-md-1 landing-left pe-md-0'>
                    <img src={landingImage} alt="Landing" className='landing-img pt-4 pt-md-0'/>
                    <img src={landingWaves} alt="Landing Waves" className='landing-waves'/>
                </div>
                {/* <Col md={10} xs={12} className='landing-right px-md-5 px-3'>
                    <div>
                        <img src={landingLogo} alt="Logo" className='landing-logo pt-3 pt-md-5'/>
                        <h4 className='pt-2'>BEST QUALITY COFFEE BEANS</h4>
                        <p className='pb-3 pb-md-5 pt-2 pt-md-3'>Quality freshly roasted coffee made just for you.
                        <br />Pour, brew, and enjoy</p>
                    </div>
                </Col>

                <Col md={2} xs={12} className='bg-primary landing-left d-flex justify-content-center align-items-center pe-5'>
                    <Col>
                        <img src={landingImage} alt="Landing Image" className='landing-image'/>
                        <img src={landingWaves} alt="Landing Waves" className='landing-waves'/>
                    </Col>
                </Col> */}
            </Row>
        </Container>
    );
}

export default LandingPage;