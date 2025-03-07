import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaStar, FaRegStar  } from "react-icons/fa";
import "./shoptestimonial.scss";

const ShopTestimonial = () => {
  return (
    <Card className="cursor-pointer relative z-[4] pointer-events-none">
      <CardContent className="w-full flex flex-col items-center py-5">
        <Avatar className="w-[5rem] h-[5rem] ">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex gap-2 mt-4 mb-2">
            <div className="flex gap-2">
                {Array.from({length:3}).map((_,index)=>(
                    <FaStar size={15} color="#3a0751" key={index} />
                ))}
            </div>
            <div className="flex gap-2">
                {Array.from({length:2}).map((_,index)=>(
                    <FaRegStar size={15} key={index} />
                ))}
            </div>
        </div>
        <p className="text-sm mb-4">Very Good</p>
        <h2 className="text-center font-semibold text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id, adipisci. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam, ullam!</h2>
      </CardContent>
    </Card>
  );
};

export default ShopTestimonial;
