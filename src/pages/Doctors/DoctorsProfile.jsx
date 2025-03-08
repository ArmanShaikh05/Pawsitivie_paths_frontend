import DoctorAppointmentSchedule from "@/components/AppointmentSchedular/DoctorAppointmentSchedul";
import ShopTestimonial from "@/components/ShopTestimonial/ShopTestimonial";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CREATE_DOCTOR_APPOINTMENT,
  GET_DOCTOR_DETAILS_BY_USERID,
  POST_DOCTOR_REVIEW,
} from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { addOneHourToTime, getCurrency } from "@/utils/features";
import axios from "axios";
import { Info, Star } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import { RiContactsBook2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const DoctorsProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [userData, setUserData] = useState(null);
  const userId = useSelector((state) => state.userDetailReducer.userData?._id);
  const profilePic = useSelector(
    (state) => state.userDetailReducer.userData?.profilePic?.url
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);

  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");

  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState(userData?.phone || "");

  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);

  const [relatedDoctors, setRelatedDoctors] = useState([]);

  const [openDialog, setDialogOpen] = useState(false);
  const [rating, setRating] = useState();
  const [review, setReview] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);

  const [reviewsData, setReviewsData] = useState();

  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    axios
      .get(`${GET_DOCTOR_DETAILS_BY_USERID}?doctorId=${doctorId}`)
      .then(({ data }) => {
        setUserData(data.data);
        setReviewsData(data.data?.reviews || []);
        let relatedDoctors = data?.relatedDoctors?.filter(
          (doctor) => doctor.userId !== doctorId
        );
        setRelatedDoctors(relatedDoctors);
      })
      .catch((err) => console.log(err));
  }, [doctorId, reducerValue]);

  const createAppointment = async () => {
    const todayDate = new Date();
    if (
      userFirstName === "" ||
      userLastName === "" ||
      email === "" ||
      phone === ""
    ) {
      return toast({
        title: "Please enter all user details",
        variant: "destructive",
      });
    }
    if (selectedDate === "" || selectedTime === "") {
      return toast({
        title: "Please select appointment date and time",
        variant: "destructive",
      });
    }
    if (selectedDate < todayDate) {
      return toast({
        title:
          "Cannot schedule appointment in past date. Please select appropriate date",
        variant: "destructive",
      });
    }
    try {
      setIsCreatingAppointment(true);
      const cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        CREATE_DOCTOR_APPOINTMENT,
        {
          userId: userId,
          doctorId: userData?._id,
          description: meetingDescription,
          startTime: selectedTime,
          endTime: addOneHourToTime(selectedTime),
          clientDetails: {
            firstName: userFirstName,
            lastName: userLastName,
            email: email,
            phoneNo: phone,
            profilePic: profilePic,
          },
          subject: "Pet Doctor",
          appointmentDate: selectedDate,
        },
        { cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        setUserFirstName("");
        setUserLastName("");
        setSelectedTime("");
        setMeetingDescription("");
        setOpenAppointmentDialog(false);
        setSelectedDate(new Date());
        toast({
          title: "Created appointment",
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (error.response.status === 409) {
        return toast({
          title: "You already have an appointment at this time",
          variant: "destructive",
        });
      }
      console.log(error.response);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const postReview = async () => {
    if (!rating) {
      return toast({
        title: "Please select a rating",
        variant: "destructive",
      });
    } else if (reviewTitle === "") {
      return toast({
        title: "Please enter a review title",
        variant: "destructive",
      });
    } else if (reviewDesc === "") {
      return toast({
        title: "Please enter a review description",
        variant: "destructive",
      });
    } else {
      const reviewData = {
        userId: userId,
        doctorId: userData?._id,
        rating,
        reviewTitle,
        reviewDesc,
        review,
      };
      const cancelToken = axios.CancelToken.source();
      try {
        setIsPostingReview(true);
        const response = await axios.post(POST_DOCTOR_REVIEW, reviewData, {
          cancelToken: cancelToken.token,
        });
        if (response.status === 200) {
          setDialogOpen(false);
          toast({
            title: "Review posted successfully",
          });
          setReview("");
          setReviewTitle("");
          setReviewDesc("");
          setRating();
          forceUpdate();
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      } finally {
        setIsPostingReview(false);
      }
    }
  };

  return (
    <div className="page-container hidden-scrollbar p-4">
      <div className="page-container hidden-scrollbar p-4">
        <div className="grid grid-cols-[25%_auto] place-items-center px-4 items-center p-4 space-x-4">
          {/* Left Section: Doctor Image */}
          <div className=" self-start w-[80%] aspect-square   flex items-center flex-col justify-center">
            <div className="border w-full p-2 rounded-lg">
              <Avatar className="w-full h-full  rounded-lg">
                <AvatarImage
                  className="object-cover"
                  src={userData?.profilePic?.url}
                />
                <AvatarFallback className="text-black text-[5rem]">
                  {userData?.userName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            {userData?.availableForWork ? (
              <div className="mt-4 inline-flex items-center px-4 py-2 border-2 border-green-500 text-green-500 text-sm font-semibold rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Available for Work
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center px-4 py-2 border-2 border-red-500 text-red-500 text-sm font-semibold rounded-full shadow-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Not Available
              </div>
            )}
          </div>

          {/* Right Section: Doctor Details */}
          <Card className="w-full min-h-[16rem] border-2 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">{userData?.userName}</h2>
              </div>
              <p className="text-gray-600">
                {userData?.education} - {userData?.speciality}
              </p>
              {userData?.experience && (
                <Badge variant="outline" className="mt-1">
                  {userData?.experience} years
                </Badge>
              )}

              {/* About Section */}
              {userData?.bio && (
                <div className="mt-3 text-gray-700 text-sm">
                  <div className="flex items-center space-x-1">
                    <Info className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">About</span>
                  </div>
                  <p className="mt-1 text-gray-600">{userData?.bio}</p>
                </div>
              )}

              {userData?.city && userData?.state && userData?.address && (
                <div className="mt-5 text-gray-700 text-sm">
                  <div className="flex items-center space-x-1">
                    <CiLocationOn className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className="mt-1 text-gray-600">{userData?.address}</p>
                  <p className="mt-1 text-gray-600">
                    {userData?.city}, {userData?.state}
                  </p>
                </div>
              )}

              {userData?.availability && (
                <div className="mt-5 text-gray-700 text-sm">
                  <div className="flex items-center space-x-1">
                    <IoMdTime className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">Timmings</span>
                  </div>
                  <p className="mt-1 text-gray-600">
                    Weekdays - {userData?.availability?.weekdays.open} :{" "}
                    {userData?.availability?.weekdays.close}
                  </p>
                  <p className="mt-1 text-gray-600">
                    Weekends - {userData?.availability?.weekend.open} :{" "}
                    {userData?.availability?.weekend.close}
                  </p>
                  <p className="mt-1 text-gray-600">
                    {userData?.availability?.sundayClosed
                      ? "Sunday Working"
                      : "Sunday Closed"}
                  </p>
                </div>
              )}

              <div className="mt-5 text-gray-700 text-sm">
                <div className="flex items-center space-x-1">
                  <RiContactsBook2Line className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Contact Details</span>
                </div>
                <p className="mt-1 text-gray-600">Email - {userData?.email}</p>
                {userData?.phone && (
                  <p className="mt-1 text-gray-600">
                    Contact - {userData?.phone}
                  </p>
                )}
              </div>

              {userData?.appointmentFee > 0 && (
                <div className="mt-5 text-gray-700 text-sm">
                  <span className="font-semibold">Appointment Fee</span>
                  <p className="mt-1 text-gray-600">
                    {getCurrency(userData?.appointmentFee)}
                  </p>
                </div>
              )}

              <div className="w-full gap-8 flex justify-end">
                <Button
                  variant="outline"
                  className="h-[3rem]"
                  onClick={() => setDialogOpen(true)}
                >
                  Post Review
                </Button>
                {openDialog && (
                  <Dialog open={openDialog} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Write your review</DialogTitle>
                        <DialogDescription>
                          Your review will be shown to other users, so make sure
                          to use appropriate words..
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="rating">Rating</Label>
                          <Select
                            id="rating"
                            onValueChange={(value) => {
                              setRating(value);
                              if (value === 1) {
                                return setReview("Very Bad");
                              } else if (value === 2) {
                                return setReview("Bad");
                              } else if (value === 3) {
                                return setReview("Good");
                              } else if (value === 4) {
                                return setReview("Very Good");
                              } else {
                                return setReview("Excellent");
                              }
                            }}
                          >
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Ratings" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Very Bad</SelectItem>
                              <SelectItem value="2">Bad</SelectItem>
                              <SelectItem value="3">Good</SelectItem>
                              <SelectItem value="4">Very Good</SelectItem>
                              <SelectItem value="5">Excellent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="Review"
                            className="col-span-3"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="description"
                            className="text-right self-start"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your review"
                            className="col-span-3"
                            value={reviewDesc}
                            onChange={(e) => setReviewDesc(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={postReview}
                          disabled={isPostingReview}
                        >
                          Post Review
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {/* SHOW APPOINTMENT MODEL */}
                <AlertDialog
                  open={openAppointmentDialog}
                  onOpenChange={setOpenAppointmentDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="primary" className="h-[3rem]">
                      Schedule Appointment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-max h-[43rem] overflow-auto hidden-scrollbar">
                    <AlertDialogHeader className={"h-10"}>
                      <AlertDialogTitle>Schedule Appointment</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div></div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {/* Appointment schedular */}
                    <DoctorAppointmentSchedule
                      doctorId={doctorId}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      setSelectedDate={setSelectedDate}
                      setSelectedTime={setSelectedTime}
                      email={email}
                      setEmail={setEmail}
                      phone={phone}
                      setPhone={setPhone}
                      userFirstName={userFirstName}
                      setUserFirstName={setUserFirstName}
                      userLastName={userLastName}
                      setUserLastName={setUserLastName}
                      meetingDescription={meetingDescription}
                      setMeetingDescription={setMeetingDescription}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <Button
                        disabled={isCreatingAppointment}
                        onClick={() => createAppointment()}
                        variant={"primary"}
                      >
                        Create Appointment
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {reviewsData?.length > 0 && (
        <div className="w-[90%] mt-[4rem] mb-[3rem] mx-auto flex flex-col relative">
          <h2 className="text-xl font-medium">Customer Reviews</h2>
          <div className="shop-carousels mt-8 mb-8">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {reviewsData?.map((review, index) => (
                  <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/4"
                  >
                    <ShopTestimonial reviewData={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}

      {relatedDoctors?.length > 0 && (
        <div className="w-[90%] mt-[4rem] mb-[3rem] mx-auto flex flex-col relative">
          <h2 className="text-xl font-medium">Related Doctors</h2>
          <div className="shop-carousels mt-8 mb-8">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {relatedDoctors?.map((doctor, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/4"
                  >
                    <Card
                      className="px-4 py-2 bg-white shadow-md rounded-lg w-full h-[20rem]"
                      onClick={() => navigate(`/pet-doctors/${doctor?.userId}`)}
                    >
                      <CardContent className="flex flex-col items-center justify-between h-full text-center">
                        <div className="w-48 h-48 rounded-lg bg-gray-200 overflow-hidden mb-2">
                          <Avatar className="w-full h-full  rounded-lg">
                            <AvatarImage
                              className="object-cover"
                              src={doctor?.profilePic?.url}
                            />
                            <AvatarFallback className="text-black text-[5rem]">
                              {doctor?.userName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className=" w-[12rem] flex flex-col items-center">
                          <div className="flex items-center gap-1 my-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="text-yellow-500"
                              />
                            ))}
                          </div>
                          <h3 className="text-base font-semibold mt-2">
                            {doctor?.userName}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {doctor?.speciality}
                          </p>
                          <p className="text-green-600 text-xs">
                            {doctor?.city + ", " + doctor?.state}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsProfile;
