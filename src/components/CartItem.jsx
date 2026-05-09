import React from 'react'
import image1 from '../assets/shade-1.jpg'
import { LiaHeartSolid } from 'react-icons/lia'
import { FaShippingFast } from 'react-icons/fa'
import { CgRedo } from 'react-icons/cg'
import { FaTrashAlt } from 'react-icons/fa'
import { useCartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'

const CartItem = ({ items }) => {

    const {removeFromCart} = useCartContext();

  return (
    <div className='group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'>
      <Link to={`/clothes/${items.id}`}>
      <div className='flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5'>
        <div className='relative shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5'>
          <div className='absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/10 to-transparent' />
          <img
            src={items.image}
            alt={items.detail}
            className='h-100 w-full min-w-44 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-40 sm:w-40'
          />
        </div>

        <div className='min-w-0 flex-1 space-y-4'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>
                {items.category}
              </p>
              <h1 className='mt-1 truncate text-xl font-semibold text-slate-900 sm:text-2xl'>
                {items.title}
              </h1>
              <p className='mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600'>
                {items.condition}
              </p>
            </div>

            <button className='inline-flex items-center gap-2 self-start rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100'>
              <LiaHeartSolid className='text-base' />
              Save
            </button>
          </div>

          <div className='flex flex-col gap-3 text-sm'>
            <div className='flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3'>
              <FaShippingFast className='text-lg text-slate-900' />
              <span>
                <p className='font-medium text-slate-900'>Arrives May 17-18</p>
                <p className='text-xs text-slate-500'>Fast delivery available</p>
              </span>
            </div>
            <div className='flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3'>
              <CgRedo className='text-lg text-slate-900' />
              <span>
                <p className='font-medium text-slate-900'>Free returns</p>
                <p className='text-xs text-slate-500'>Within 30 days of delivery</p>
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.24em] text-slate-400'>Price</p>
              <p className='text-2xl font-semibold text-slate-900'>{items.price}</p>
            </div>

            <div className='flex items-center gap-3'>
              <button type="button" className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black z-100' onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(items.id); }}>
                <FaTrashAlt className='text-sm' />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default CartItem
