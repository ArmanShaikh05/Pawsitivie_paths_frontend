/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "./shopcard.scss";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();
  const fallbackText = shop?.shopName
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const totalReview =
    shop?.reviews?.reduce((sum, review) => sum + review.rating, 0) || 0;
  const overallReview = shop?.reviews?.length
    ? (totalReview / shop.reviews.length).toFixed(1)
    : "0.0";
  return (
    <Card
      className={`sm:w-full lg:w-72 w-72 h-max cursor-pointer transition-all duration-300 rounded-lg shadow-lg overflow-hidden`}
    >
      <Avatar className="h-max w-full rounded-none">
        <AvatarImage
          className="h-52 bg-cover bg-center"
          src={shop?.shopImages[0]?.url}
        />
        <AvatarFallback className="text-black">{fallbackText}</AvatarFallback>
      </Avatar>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{shop?.shopName}</h3>
        <div className="flex items-center gap-1 my-1">
          {[...Array(Math.floor(Number(overallReview)))].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-500" />
          ))}
        </div>
        <p className="text-sm text-gray-600">{shop?.shopAddress}</p>
        <Button
          variant="primary"
          className="mt-8 w-full"
          onClick={() => navigate(`/shop/${shop?.userId}`)}
        >
          View details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
