import '../App.css';
import '../assets/style/style.css'
import LandingPage from '../components/LandingPage';
import ProductPage from './ProductPage';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from 'react';

function Home() {
  useEffect (() => {
    AOS.init();
  }, [])

  return (
    <div data-aos="fade-down" data-aos-delay="200">
      <LandingPage/>
      <ProductPage/>
    </div>
  );
}

export default Home;