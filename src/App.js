import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productObject = cartList.find(eachList => eachList.id === product.id)
    if (productObject) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachList => {
          if (product.id === eachList.id) {
            const updatedQuantity = eachList.quantity + product.quantity
            return {...eachList, quantity: updatedQuantity}
          }
          return eachList
        }),
      }))
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  removeCartItem = productId => {
    const {cartList} = this.state
    const newCartItem = cartList.filter(eachList => eachList.id !== productId)
    this.setState({cartList: newCartItem})
  }

  incrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachList => {
        if (productId === eachList.id) {
          const updatedQuantity = eachList.quantity + 1
          return {...eachList, quantity: updatedQuantity}
        }
        return eachList
      }),
    }))
  }

  decrementCartItemQuantity = productId => {
    const {cartList} = this.state
    const productObject = cartList.find(eachList => eachList.id === productId)
    if (productObject.quantity > 1) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachList => {
          if (eachList.id === productId) {
            const updatedQuantity = eachList.quantity - 1
            return {...eachList, quantity: updatedQuantity}
          }
          return eachList
        }),
      }))
    } else {
      const newCartItem = cartList.filter(eachList => eachList.id !== productId)
      this.setState({cartList: newCartItem})
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
