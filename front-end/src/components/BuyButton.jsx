const BuyButton = ({ productName, productPrice, productSize, productColor, productId }) => {
    const handleWhatsAppClick = () => {
        if (!productColor || !productSize) {
            const userConfirmed = window.confirm(
                "You haven't selected both color and size. Are you sure you want to proceed without selecting them?"
            );

            if (!userConfirmed) {
                return; 
            }
        }

        sendWhatsAppMessage();
    };

    const sendWhatsAppMessage = () => {
        const phoneNumber = import.meta.env.VITE_PHONE; 

        let message = `Hello! I want to buy this product:
        
Product: ${productName}
Price: $${productPrice}
Product ID: ${productId}`;

        if (productColor) {
            message += `\nColor: ${productColor}`;
        }
        if (productSize) {
            message += `\nSize: ${productSize}`;
        }

        message += `\n\nPlease contact me to complete the purchase.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.location.href = whatsappUrl;
    };

    return (
        <div className='fixed md:relative left-0 bottom-3 px-2 w-full h-16 flex flex-col items-center justify-center'>
            <div
                className=' w-84 h-12 flex tracking-wider flex-col items-center justify-center font-bold text-2xl bg-yellow rounded-full hover:bg-black hover:text-yellow hover:border-3 hover:border-yellow cursor-pointer transition-all duration-300'
                onClick={handleWhatsAppClick}
            >
                Buy Now
            </div>
        </div>
    );
};
export default BuyButton;
