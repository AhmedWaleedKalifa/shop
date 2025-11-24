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
       <button 
    className='z-40 sticky md:relative left-0 bottom-3 px-2 w-full h-12 flex flex-col items-center justify-center font-heading mb-3'
    onClick={handleWhatsAppClick}
    aria-label="Buy this product now"
>
    <div className='w-84 md:w-full h-10 flex tracking-wider flex-col items-center justify-center font-bold text-lg bg-yellow rounded-full hover:bg-black hover:text-yellow cursor-pointer transition-all duration-300 z-40'>
        Buy Now
    </div>
</button>
    );
};
export default BuyButton;
