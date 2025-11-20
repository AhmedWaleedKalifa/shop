import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <footer className='w-full bg-gray/5 border-t border-gray/20 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        
        {/* Contact Header */}
        <div className='text-center mb-6'>
          <h3 className='text-2xl font-bold text-yellow mb-2'>Get In Touch</h3>
          <p className='text-gray'>We'd love to hear from you</p>
        </div>

        {/* Social Media Links with Hover Effects */}
        <div className='flex justify-center space-x-6 mb-8 '>
          <a 
            href={import.meta.env.VITE_FACEBOOK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            aria-label="Visit our Facebook page"
          >
            <FontAwesomeIcon 
              icon={faFacebook} 
              size="lg" 
              className="text-[#0866FF] group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-gray-600 whitespace-nowrap">Facebook</span>
            </div>
          </a>

          <a 
            href={import.meta.env.VITE_INSTAGRAM} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            aria-label="Visit our Instagram page"
          >
            <FontAwesomeIcon 
              icon={faInstagram} 
              size="lg" 
              className="text-[#FE0464] group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-gray-600 whitespace-nowrap">Instagram</span>
            </div>
          </a>

          <a 
            href={import.meta.env.VITE_WHATSAPP} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            aria-label="Chat with us on WhatsApp"
          >
            <FontAwesomeIcon 
              icon={faWhatsapp} 
              size="lg" 
              className="text-[#21C063] group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-gray whitespace-nowrap">WhatsApp</span>
            </div>
          </a>
        </div>

        {/* Email Section */}
        <div className='text-center mb-6'>
          <div className="inline-flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className='text-sm text-gray mb-2 font-medium'>Prefer email?</p>
            <a 
              href={`mailto:${import.meta.env.VITE_EMAIL}`}
              className='text-gray-800 hover:text-blue transition-colors duration-300 flex items-center justify-center group'
            >
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="mr-2 text-blue-500 group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{import.meta.env.VITE_EMAIL}</span>
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className='text-center border-t border-gray-200 pt-6'>
          <p className='text-gray-500 text-sm'>
            We typically respond within 24 hours
          </p>
          <p className='text-gray-400 text-xs mt-2'>
            &copy; {new Date().getFullYear()} Werzu Store. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer