/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./shoptestimonial.scss";
import moment from "moment";

const ShopTestimonial = ({ reviewData }) => {
  return (
    <Card className="cursor-pointer relative z-[4] pointer-events-none">
      <CardContent className="w-full flex flex-col items-center py-5">
        <Avatar className="w-[5rem] h-[5rem] ">
          <AvatarImage
            className="object-cover"
            src={reviewData?.userId?.profilePic?.url}
          />
          <AvatarFallback className="text-black text-[5rem]">
            {reviewData?.userId?.userName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex gap-2 mt-4 mb-2">
          <div className="flex gap-2">
            {Array.from({ length: reviewData?.rating }).map((_, index) => (
              <FaStar size={15} color="#3a0751" key={index} />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 - reviewData?.rating }).map((_, index) => (
              <FaRegStar size={15} key={index} />
            ))}
          </div>
        </div>
        <p className="text-sm mb-4">{reviewData?.title}</p>
        <h2 className="text-center font-semibold text-sm">
          {reviewData?.description}
        </h2>

        <p className="text-sm mt-4">{reviewData?.userId?.userName} </p>
        <p className="text-xs">{moment(reviewData?.createdAt).fromNow()}</p>
      </CardContent>
    </Card>
  );
};

export default ShopTestimonial;
