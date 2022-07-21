import React from 'react'
import {Link} from 'react-router-dom'
import { useCart } from '../hooks/useCart';

const Header = (props) => {
  const { totalPrice } = useCart()
 
  return (
    <div>
           <header className="d-flex justify-between align-center p-40">
           <Link to="/">
       <div  className="d-flex align-center">
       <img width={40} height={40} src="/img/logo.png" alt="logo" />
        <div>
          <h3 className="text-uppercase">Sneakers</h3>
          <p className="opacity-5">Великолепная обувь!</p>
        </div>
       </div>
       </Link>
        <ul className="d-flex">
          <li onClick={props.onClickCart} className="mr-30  cu-p">
            <img width={18} height={18}
             src="/img/cart.svg" alt="корзина"/>
             <span>{totalPrice} руб.</span>
            </li>
            <li className="mr-30  cu-p">
              <Link to="/favorites">
              <img width={18} height={18} src="/img/heart.svg" alt="закладки"/>
              </Link>
            </li>
            <li className="mr-30  cu-p">
            <Link to="/orders">
              <img width={18} height={18} src="/img/user.svg" alt="Пользователь"/>
              </Link>
            </li>
        </ul>
      </header>
    </div>
  )
}

export default Header
