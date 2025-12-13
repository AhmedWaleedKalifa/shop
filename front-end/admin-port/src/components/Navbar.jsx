
function Navbar() {
   

   

    return (
        <nav className=' flex flex-col sticky left-0 top-0 z-50 max-w-[100vw] h-auto m-0 p-0 bg-white/90 backdrop-blur-sm border-b border-gray/20 justify-center' title='Search'
        >

            <div className='flex flex-row justify-center '  title='Logo'>
                <img
                    src="/logo.jpg"
                    alt="Werzu Store logo"
                    className='h-12 bg-cover font-body'
                />
            </div>

         
        </nav>
    )
}

export default Navbar