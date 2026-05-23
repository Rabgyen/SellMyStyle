import NavBar from '../components/NavBar'
import CartItem from '../components/CartItem'
import { useCartContext } from '../context/CartContext'
import Footer from '../components/Footer'
import { RiDiscountPercentFill } from "react-icons/ri";
import { PiTicketBold } from "react-icons/pi";
import { IoBagCheckOutline } from "react-icons/io5";
import { useState } from 'react';
import { TiTick } from "react-icons/ti";

const Cart = () => {
  const { cart, totalamount } = useCartContext();
  const [showInputField, setShowInputField] = useState(false);
  const [discoundCode, setDiscountCode] = useState("");
  const [discountMatched, setDisountMatched] = useState(null);
  const [discountAttempted, setDiscountAttempted] = useState(false);
  const [finalTotalAmount, setFinalTotalAmount] = useState(totalamount);
  const realDiscountCode = "SellMyStyle";
  const discountAmount = 40;

  const handleDiscountInputField = () => {
    setShowInputField(prev => !prev);
  }

  const handleDiscount = () => {
    setDiscountAttempted(true);
    if (realDiscountCode === discoundCode.trim()) {
      setDisountMatched(true);
      setFinalTotalAmount(totalamount - discountAmount)
    }else{
      setDisountMatched(false);
      setFinalTotalAmount(totalamount)
    }
  }

    const handleDiscountOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDiscount();
    }
  }
 
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
         <div className='rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] px-8 py-8'>
          <div className='flex justify-between'>
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
            <button className='font-semibold text-md' onClick={handleDiscountInputField}>Add Code</button>
          </div>
          </div>
          {showInputField && <div className='flex flex-col gap-4 mt-6'>
            <input type="text" placeholder='Discount Code' className='border border-gray-300 w-full p-4 focus:outline-[#442dd6] rounded-xl'
            value={discoundCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            onKeyDown={handleDiscountOnKeyDown}/>
            <button className='flex w-full gap-2 font-semibold py-4 items-center justify-center bg-[#48A111] text-white rounded-xl' onClick={handleDiscount}>
            Apply <TiTick className='text-2xl'/>
          </button>
            <div>
              {discountMatched === true && <div className='p-2 text-sm text-white bg-green-600 inline-flex rounded-sm'>
              Discount applied successfully.
            </div>}
              {discountAttempted && discountMatched === false && <div className='p-2 text-sm bg-red-400 text-white inline-flex rounded-sm'>
              Incorrect Code.
            </div>}
            </div>
            
          </div>}
        </div>
        <div className='flex flex-col gap-2 rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] px-8 py-8'>
          <div className='flex justify-between'>
            <p className='font-semibold'>Subtotal</p>
            <p>${totalamount}</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold text-gray-400'>Discount</p>
            <p>{discountMatched === true ? `$${discountAmount}` : "-"}</p>
          </div>
          <div className='flex justify-between'>
            <p className='font-semibold text-gray-400'>Shipping</p>
            <p>Free</p>
          </div>
          <div className='flex justify-between border-t border-gray-400 py-2 mt-2'>
            <p className='font-semibold text-xl'>Total</p>
            <p>${finalTotalAmount}</p>
          </div>
          <button className='flex gap-2 font-semibold py-4 items-center justify-center bg-[#2377fc] text-white rounded-xl'>
            Checkout <IoBagCheckOutline className='text-2xl'/>
          </button>
        </div>
        </div>}
      </div>
      <Footer/>
    </div>
  )
}

export default Cart
