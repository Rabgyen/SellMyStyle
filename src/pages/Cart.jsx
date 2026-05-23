import NavBar from '../components/NavBar'
import CartItem from '../components/CartItem'
import { useCartContext } from '../context/CartContext'
import Footer from '../components/Footer'
import { RiDiscountPercentFill } from "react-icons/ri";
import { PiTicketBold } from "react-icons/pi";

const Cart = () => {
  const { cart, totalamount } = useCartContext()

  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
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
       {cart.length != 0 && <div className='flex flex-col gap-2'>
         <div className='flex justify-between rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] px-8 py-8'>
          <div className='flex items-center gap-2'>
            <span>
              <RiDiscountPercentFill className='text-4xl'/>
            </span>
            <span>
              <p className='font-bold'>Discount Code</p>
            <p className='text-xs'>Enjoy great deals and save more.</p>
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <PiTicketBold/>
            <p className='font-semibold text-md'>Add Code</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] px-8 py-8'>
          <div className='flex justify-between'>
            <p className='font-semibold'>Subtotal</p>
            <p>${totalamount}</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold text-gray-400'>Discount</p>
            <p>-</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold text-gray-400'>Shipping</p>
            <p>-</p>
          </div>
          <div className='flex justify-between border-t border-gray-400 py-2 mt-2'>
            <p className='font-semibold text-xl'>Total</p>
            <p>${totalamount}</p>
          </div>
        </div>
        </div>}
      </div>
      <Footer/>
    </div>
  )
}

export default Cart
