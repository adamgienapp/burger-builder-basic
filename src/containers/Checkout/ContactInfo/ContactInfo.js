import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactInfo.css';


class ContactData extends Component {
  state= {
    name: '',
    email: '',
    address: {
      street: '',
      zipCode: '',
    },
    loading: false,
  };

  orderHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Adam Gienapp',
        address: {
          street: '123 Fake St',
          city: 'Garbool',
          state: 'Adamfornia',
          zipCode: '48009',
        },
        email: 'adamPSN69@gmail.com',
      },
      deliveryMethod: 'fastest',
    };

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {
    let form = (
      <form>
          <input className={classes.Input} type="text" name="name" placeholder="Your Name"/>
          <input className={classes.Input} type="email" name="email" placeholder="Your Email"/>
          <input className={classes.Input} type="text" name="street" placeholder="Street"/>
          <input className={classes.Input} type="text" name="zipCode" placeholder="Zip Code"/>
          <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
        </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }

    return(
      <div className={classes.ContactInfo}>
        <h4>Enter your Contact Info</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;