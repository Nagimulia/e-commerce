import React from 'react'
import {Route} from 'react-router-dom'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Orders from './pages/Orders'
import axios from 'axios'
import AppContext from './context'



function App() {
  const [items, setItems] = React.useState([])
  const [favorites, setFavorites] = React.useState([])
  const [cartItems, setCartItems] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [cartOpened, setCartOpened] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

 React.useEffect(() => {
  async function fetchData() {
    try {
      const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
        axios.get('https://60d62397943aa60017768e77.mockapi.io/cart'),
        axios.get('https://60d62397943aa60017768e77.mockapi.io/favorites'),
        axios.get('https://60d62397943aa60017768e77.mockapi.io/items'),
      ]);

      setIsLoading(false)
      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    } catch (error) {
      alert('Ошибка при запросе данных ;(');
      console.error(error);
    }
  }

  fetchData();
}, []);

 const onAddToCart = async (obj) => {
   try{
     const findItem = cartItems.find((item) => Number(item.id) === Number(obj.id))
    if (findItem){
      setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)))
      await axios.delete(`https://60d62397943aa60017768e77.mockapi.io/cart/${findItem.id}`)
      
    }
   else {
    setCartItems(prev => [...prev, obj])
    const { data } = await axios.post('https://60d62397943aa60017768e77.mockapi.io/cart', obj)
    setCartItems(prev => prev.map(item =>{
      if(item.parentId === data.parentId){
        return { 
          ...item,
          id: data.id
        }
      }
      return item
    }))
  }
 } catch (error) {
   alert('Ошибка при добавлении в корзину')
 }
 }

 const onRemoveItem = (id) => {
 try{
  axios.delete(`https://60d62397943aa60017768e77.mockapi.io/cart/${id}`)
  setCartItems(prev => prev.filter(item => item.id !== id))
 } catch (error) {
  alert('Ошибка при удалении из корзину')
 }
 }
 


 const onAddToFavorite = async (obj) => {
  try {
    if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
      axios.delete(`https://60d62397943aa60017768e77.mockapi.io/favorites/${obj.id}`);
      setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    } else {
      const { data } = await axios.post(
        'https://60d62397943aa60017768e77.mockapi.io/favorites',
        obj,
      );
      setFavorites((prev) => [...prev, data]);
    }
  } catch (error) {
    alert('Не удалось добавить в фавориты');
    console.error(error);
  }
}

 const onChangeSearchInput = (event) => {
  setSearchValue(event.target.value)
 }

const isItemAdded = (id) => {
  return cartItems.some((obj) => Number(obj.parentId) === Number(id))
}

  return (
    <AppContext.Provider 
    value={{ 
      cartItems,
       items, 
       favorites, 
       isItemAdded, 
       onAddToFavorite,
       setCartItems,
      setCartOpened}}>
     <div className="wrapper clear">
        <Drawer
        items={cartItems}
        onClose={() => setCartOpened(false)}
        onRemove={onRemoveItem}
        opened={cartOpened}
        />
   
      <Header 
      onClickCart = {() => setCartOpened(true)}
      />
      <Route path="/" exact>
        <Home 
        items = {items}
        cartItems={cartItems}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onChangeSearchInput={onChangeSearchInput}
        onAddToFavorite={onAddToFavorite}
        onAddToCart={onAddToCart}
        isLoading={isLoading}
        />
      </Route>
        <Route path="/favorites">
          <Favorites/>
        </Route>
        <Route path="/orders">
          <Orders/>
        </Route>
      </div>
      </AppContext.Provider>
  );
}

export default App;
