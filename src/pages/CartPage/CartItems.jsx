import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const CartItems = () => {
  const [quantity, setQuantity] = useState(4);
  const price = 2000;
  const total = price * quantity;

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Your Cart</h2>
      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
          <div className="flex items-center gap-4 col-span-2">
            <img
              src="/images/sample-product.jpg"
              alt="Product Image"
              className="w-28 h-28 rounded-lg object-cover shadow-md"
            />
            <div>
              <h3 className="font-semibold text-xl text-gray-900">Pedigree</h3>
              <p className="text-sm text-gray-500">The Pet World</p>
              <p className="text-sm text-purple-600 font-medium">Pet Type: Dogs</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700">₹{price.toLocaleString("en-IN")}/-</p>
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              className="text-lg font-bold text-gray-700"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <span className="text-lg font-medium text-gray-900">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-lg font-bold text-gray-700"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </Button>
          </div>
          <p className="text-lg font-semibold text-orange-500">₹{total.toLocaleString("en-IN")}/-</p>
          <Button variant="ghost" size="icon" className="hover:text-red-500 transition-colors">
            <Trash2 className="w-6 h-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CartItems;
