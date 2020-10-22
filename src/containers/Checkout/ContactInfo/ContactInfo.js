import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactInfo.css';


class ContactData extends Component {
  state= {
    name: '',
    email: '',
    address: {
      street: '',
      zipCode: '',
    }
  };

  render() {
    return(
      <div className={classes.ContactInfo}>
        <h4>Enter your Contact Info</h4>
        <form>
          <input className={classes.Input} type="text" name="name" placeholder="Your Name"/>
          <input className={classes.Input} type="email" name="email" placeholder="Your Email"/>
          <input className={classes.Input} type="text" name="street" placeholder="Street"/>
          <input className={classes.Input} type="text" name="zipCode" placeholder="Zip Code"/>
          <Button btnType="Success">ORDER</Button>
        </form>
      </div>
    );
  }
}

export default ContactData;