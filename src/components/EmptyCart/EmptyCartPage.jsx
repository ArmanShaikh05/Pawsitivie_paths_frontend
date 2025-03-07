import { ShoppingCart } from "lucide-react";

const EmptyCart = () => {

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <ShoppingCart className="w-16 h-16 text-gray-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mt-2">
            It looks like you haven’t added anything to your cart yet. Start
            exploring our products now!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
