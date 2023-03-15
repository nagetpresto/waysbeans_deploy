import { Col } from "react-bootstrap";

export const ProductCard = ({ id, name, price, stock, image }) => {
  return (
    <Col size={12} sm={6} md={3}>
      <div className="product-card">
        <img alt="Product" className="product-img img-fluid" src={image}/>
        <div className="card-body">
          <a href={"/product-detail/" + id}>{name}</a>
          <p className="mb-1 mt-2">Rp.{price}</p>
          <p>Stock : {stock}</p>
        </div>
      </div>
    </Col>
  )
}