import React, { Component } from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.7,
  meat: 1.3,
  bacon: 1
};

class BurgerBuilder extends Component {
  state = {
    ingredients : null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios.get('https://burgerbuilder-71595.firebaseio.com/ingredients.json')
      .then((res) => {
        this.setState({
          ingredients: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          error: true,
        });
      });
  }

  updatePurchaseState() {
    const ingredients = {
      ...this.state.ingredients
    };
    const sum = Object.values(ingredients).reduce((a,b) => a + b, 0);
    this.setState({
      purchasable: sum > 0,
    });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    }, () => this.updatePurchaseState());
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
    }, () => this.updatePurchaseState());
  }

  purchaseHandler = () => {
    this.setState({
      purchasing: true,
    });
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    });
  }

  purchaseContinueHandler = () => {
  //   this.setState({ loading: true });
  //   const order = {
  //     ingredients: this.state.ingredients,
  //     price: this.state.totalPrice,
  //     customer: {
  //       name: 'Adam Gienapp',
  //       address: {
  //         street: '123 Fake St',
  //         city: 'Garbool',
  //         state: 'Adamfornia',
  //         zipCode: '48009',
  //       },
  //       email: 'adamPSN69@gmail.com',
  //     },
  //     deliveryMethod: 'fastest',
  //   };

  //   axios.post('/orders.json', order)
  //     .then(res => {
  //       this.setState({ loading: false, purchasing: false });
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       this.setState({ loading: false, purchasing: false });
  //       console.error(err);
  //     });
    const queryParams = [];
    for (let key in this.state.ingredients) {
      queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.state.ingredients[key]));
    }
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString,
    });
  }
  
  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded! :(</p> : <Spinner />;
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            order={this.purchaseHandler} />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
              ingredients={this.state.ingredients}
              price={this.state.totalPrice}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler} />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
};

export default withErrorHandler(BurgerBuilder, axios);