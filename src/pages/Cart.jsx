import NavBar from '../components/NavBar'
import CartItem from '../components/CartItem'
import { useCartContext } from '../context/CartContext'
import Footer from '../components/Footer'

const Cart = () => {
  const { cart } = useCartContext()

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
            <p className="mt-2 text-slate-600">Add some items to get started</p>
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            <h1 className="text-3xl font-semibold text-slate-900">My Cart</h1>
            <div className='flex flex-col gap-4'>
              {cart.map((item) => (
                <CartItem key={item.id} items={item} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default Cart
