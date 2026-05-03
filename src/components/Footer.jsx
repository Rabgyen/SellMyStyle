import React from 'react'

const Footer = () => {
  return (
    <footer className=" pt-20  bg-[#EEEEEE] text-slate-900 clip-slanted shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <h3 className="text-2xl md:text-3xl font-extrabold">Need Help?</h3>
            <p className="mt-3 text-lg font-semibold">sellmystyle@startup.com</p>
            <p className="mt-6 text-sm text-slate-500">© {new Date().getFullYear()} SellMyStyle</p>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-indigo-600 uppercase tracking-wider text-sm mb-4">Navigation</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><a href="#" className="hover:underline">Home</a></li>
                  <li><a href="#" className="hover:underline">Favorites</a></li>
                  <li><a href="#" className="hover:underline">Cart</a></li>
                  <li><a href="#" className="hover:underline">About us</a></li>
                  <li><a href="#" className="hover:underline">Register</a></li>
                  <li><a href="#" className="hover:underline">Account</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-indigo-600 uppercase tracking-wider text-sm mb-4">Socials</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li><a href="#" className="hover:underline">Instagram</a></li>
                  <li><a href="#" className="hover:underline">Facebook</a></li>
                  <li><a href="#" className="hover:underline">X</a></li>
                  <li><a href="#" className="hover:underline">LinkedIn</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-indigo-600 uppercase tracking-wider text-sm mb-4">Contacts</h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li>+977 9812345678</li>
                  <li>0123422254</li>
                  <li>+1 234-567-8901</li>
                  <li>sellmystyle@startup.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
