import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
   <footer className='w-full bg-gray/5 border-t border-gray/20 py-8 px-4 lg:px-8 font-body'>
    <div className='max-w-6xl mx-auto'>
        
        {/* Main Content - Horizontal layout on large screens */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-8 mb-6'>
            
            {/* Left Section - Contact Header */}
            <section className='text-center lg:text-left lg:flex-1 mb-6 lg:mb-0'>
                <h3 className='text-2xl font-bold text-yellow mb-2 font-heading tracking-wide'>Get In Touch</h3>
                <p className='text-gray font-body'>We'd love to hear from you</p>
            </section>

            {/* Center Section - Social Media Links */}
            <nav className='flex justify-center lg:justify-center lg:flex-1 mb-6 lg:mb-0' aria-label="Social media links">
                <ul className='flex space-x-6 list-none'>
                    <li>
                        <a 
                            title='Facebook'
                            href={import.meta.env.VITE_FACEBOOK} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-body"
                            aria-label="Visit our Facebook page"
                        >
                            <FontAwesomeIcon 
                                icon={faFacebook} 
                                size="lg" 
                                className="text-[#0866FF] group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs text-gray-600 whitespace-nowrap font-body">Facebook</span>
                            </div>
                        </a>
                    </li>

                    <li>
                        <a 
                            title='Instagram'
                            href={import.meta.env.VITE_INSTAGRAM} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-body"
                            aria-label="Visit our Instagram page"
                        >
                            <FontAwesomeIcon 
                                icon={faInstagram} 
                                size="lg" 
                                className="text-[#FE0464] group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs text-gray-600 whitespace-nowrap font-body">Instagram</span>
                            </div>
                        </a>
                    </li>

                    <li>
                        <a 
                            title='Whatsapp'
                            href={import.meta.env.VITE_WHATSAPP} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-body"
                            aria-label="Chat with us on WhatsApp"
                        >
                            <FontAwesomeIcon 
                                icon={faWhatsapp} 
                                size="lg" 
                                className="text-[#21C063] group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs text-gray whitespace-nowrap font-body">WhatsApp</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Right Section - Email */}
            <section className='text-center lg:text-right lg:flex-1'>
                <div className="inline-flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 font-body">
                    <p className='text-sm text-gray mb-2 font-medium'>Prefer email?</p>
                    <a 
                        href={`mailto:${import.meta.env.VITE_EMAIL}`}
                        className='text-gray-800 hover:text-blue transition-colors duration-300 flex items-center justify-center group font-body'
                    >
                        <FontAwesomeIcon 
                            icon={faEnvelope} 
                            className="mr-2 text-blue-500 group-hover:scale-110 transition-transform duration-300" 
                        />
                        <span className="font-medium">{import.meta.env.VITE_EMAIL}</span>
                    </a>
                </div>
            </section>

        </div>

        {/* Additional Info - Centered below */}
        <div className='text-center border-t border-gray-200 pt-6 font-body'>
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