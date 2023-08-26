import { useEffect, useState } from 'react';
import './index.css';
import axios from 'axios';

function App() {
  const [listProducts, setListProducts] = useState([])
  const [listCarts, setListCarts] = useState([])

  // convert to USDollar
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // get product
  useEffect(() => {
    axios.get("https://cart-z6p5.onrender.com/api/v1/products")
      .then((res) => {
        setListProducts(res.data.data)
      })
      .catch((error) => console.log(error))
    const cart = localStorage.getItem("cart")
    if (cart) {
      setListCarts(JSON.parse(cart))
    }
  }, [])

  // total cart
  const totalCart = listCarts.reduce((prev, curr) => prev + curr.quantity * curr.price, 0)

  // add to cart
  const handleAddToCart = (item) => {
    const listData = [...listCarts]
    const foundCart = listData.find(cartItem => cartItem._id === item._id)
    if (foundCart) {
      foundCart.quantity += 1
    } else {
      listData.push({
        ...item,
        quantity: 1
      })
    }
    setListCarts(listData)
    localStorage.setItem("cart", JSON.stringify(listData))
  }

  // Change quantity
  const handleChangeQuantity = (item, value) => {
    const listData = [...listCarts]
    const foundCart = listData.find(cartItem => cartItem._id === item._id)
    foundCart.quantity += value
    if (foundCart.quantity < 1) {
      return;
    }
    setListCarts(listData)
    localStorage.setItem("cart", JSON.stringify(listData))
  }


  // delete a product in cart
  const handleDeleteOneProductInCart = (id) => {
    const filterData = listCarts.filter((item) => item._id !== id)
    setListCarts(filterData)
    localStorage.setItem("cart", JSON.stringify(filterData))
  }

  return (
    <div className='flex gap-8 justify-center items-center h-screen w-screen'>
      <div className='w-[300px] h-[500px] overflow-hidden shadow-md relative px-7 py-3 rounded-[28px]'>
        <div className='w-[200px] h-[200px] rounded-full absolute -left-20 -top-12 bg-Yellow'></div>
        <div className='relative z-10'>
          <img src="/image/nike.png" width={50} height={100} alt="Logo" />
          <h1 className='text-Black font-extrabold text-xl py-2'>Our Products</h1>
        </div>
        <div className='h-[400px] relative z-10 overflow-y-auto no-scrollbar'>
          {listProducts.map((item, index) => (
            <div key={index} className='pb-20'>
              <div style={{ backgroundColor: item.color }} className='rounded-[28px] h-72'>
                <img src={item.image} className='-rotate-[20deg]' alt="Products" />
              </div>
              <h2 className='text-lg text-Black font-bold py-3'>{item.name}</h2>
              <p>{item.description}</p>
              <div className='flex justify-between py-3 items-center'>
                <h3 className='font-bold text-lg'>{USDollar.format(item.price)}</h3>
                <button onClick={() => handleAddToCart(item)} className='bg-Yellow font-bold text-sm rounded-[28px] p-2'>ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='w-[300px] h-[500px] overflow-y-auto no-scrollbar shadow-md relative px-7 py-3 rounded-[28px]'>
        <div className='w-[200px] h-[200px] rounded-full absolute -left-20 -top-12 bg-Yellow'></div>
        <div className='sticky top-0'>
          <img src="/image/nike.png" width={50} height={100} alt="Logo" />
          <div className='flex justify-between items-center'>
            <h1 className='text-Black font-extrabold text-xl py-2'>Your cart</h1>
            <h3 className='font-bold text-lg text-Black'>{USDollar.format(totalCart)}</h3>
          </div>
        </div>
        <div className='relative'>
          {
            listCarts.map((item, index) => (
              <div key={index} className='flex pb-10 gap-4'>
                <div style={{ backgroundColor: item.color }} className='rounded-full w-16 h-16'>
                  <img src={item.image} className='-rotate-[20deg]' alt="Products" />
                </div>
                <div className='flex-1'>
                  <h2 className='text-xs text-Black font-bold'>{item.name}</h2>
                  <h3 className='font-bold text-lg py-2 text-Black'>{USDollar.format(item.price * item.quantity)}</h3>
                  <div className='flex justify-between'>
                    <div className='flex gap-4 items-center'>
                      <div className='rounded-full bg-Gray flex justify-center w-7 h-7'>
                        <button onClick={() => handleChangeQuantity(item, -1)}>
                          <img src="/image/minus.png" width={8} alt="Logo" />
                        </button>
                      </div>
                      <span>{item.quantity}</span>
                      <div className='rounded-full bg-Gray flex justify-center w-7 h-7'>
                        <button onClick={() => handleChangeQuantity(item, 1)}>
                          <img src="/image/plus.png" width={8} alt="Logo" />
                        </button>
                      </div>
                    </div>
                    <div className='rounded-full bg-Yellow flex justify-center w-7 h-7'>
                      <button onClick={() => handleDeleteOneProductInCart(item._id)}>
                        <img src="/image/trash.png" width={20} height={100} alt="Trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  );
}

export default App;
