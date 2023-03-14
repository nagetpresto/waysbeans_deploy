import { Container, Row} from "react-bootstrap";
import {ProductCard} from "../components/ProductCard";
import { useEffect, useState } from "react";
import { API } from '../config/api';

const ProductPage = () => {
  const [data, setData] = useState();
  
  useEffect (() => {
    fakeAPI();
  })

  const fakeAPI = async () => {
    try {
      const response = await API.get("/products");
      if (response.data.code === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className='product-page'>
        <Row className='product-list display-flex justify-content-start px-4 px-md-0 py-4 py-md-0'>
        {
          data?.map((data, i) => {
            return (
            <ProductCard
                key={i}
                {...data}
                />
            )
          })
        }
        </Row>
    </Container>
  )
}
  
  export default ProductPage