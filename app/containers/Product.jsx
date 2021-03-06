import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import item from '../schema';
import Default from '../components/product/DefaultProduct.jsx';
import Buyer from '../components/product/BuyerProduct.jsx';
import Seller from '../components/product/SellerProduct.jsx';
import {
  mapStateToProps,
  mapDispatchToProps,
  productReducer
} from '../reducers/product.reducer';

// TODO: Get this to check current product first before loading.
// TODO: This should redirect in the event of an error.

class productContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: ''
    };
    // this.buyButtonHandler = this.buy.bind(this);
    this.initCarousel = () => {
      const $carousel = $('.carousel.carousel-slider');
      $carousel.carousel({
        full_width: true,
        indicators: true
      });
      // $carousel.on('click', () => $carousel.carousel('next'));
    };
  }
  componentWillMount() {
      
    fetch(`/api/items/${this.props.params.id}`, {
      credentials: 'include'
    })
    .then(res => {
      console.log(`Response from server, ${res}`);
      return res.json();
    })
    .then((res) => {
      // set default image if none are present
      if (!res.images) {
        const newRes = res;
        newRes.images = ['http://lorempixel.com/output/nature-q-c-640-480-10.jpg'];
        return newRes;
      }
      return res;
    })
    .then(res => this.props.updateProduct(res))
    .catch(err => console.error(err));
  }
  componentDidMount() {
    this.initCarousel();
  }
  componentWillReceiveProps(nextProps) {
    fetch(`/api/items/${this.props.params.id}/${this.props.user}/transaction`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ userRole: res.role });
      })
      .catch(err => console.log(err));
  }
  componentDidUpdate() {
    this.initCarousel();
  }
  componentWillUnmount() {
    this.props.clearProduct();
  }
  render() {
    if (this.props.loggedIn && this.state.userRole === 'buyer') {
      console.log('buyer');
      return (
        <Buyer
          loggedIn={this.props.loggedIn}
          updateProduct={this.props.updateProduct}
          product={this.props.product}
        />
      );
    }
    if (this.props.loggedIn && this.state.userRole === 'seller') {
      console.log('seller');
      return (
        <Seller
          loggedIn={this.props.loggedIn}
          updateProduct={this.props.updateProduct}
          product={this.props.product}
        />
      );
    }
    return (
      <Default
        loggedIn={this.props.loggedIn}
        updateProduct={this.props.updateProduct}
        product={this.props.product}
      />
    );
  }
}

productContainer.propTypes = {
  product: item,
  params: PropTypes.shape({
    id: PropTypes.any
  }),
  user: PropTypes.object.isRequired,
  updateProduct: PropTypes.func.isRequired,
  clearProduct: PropTypes.func.isRequired
};

const Product = connect(mapStateToProps, mapDispatchToProps)(productContainer);

export { Product, productReducer, productContainer };
