/* eslint-disable react/prop-types */
import AppointmentBadge from "@/components/AppointmentSchedular/AppointmentBadge";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPT_APPOINTMENT, APPOINTMENT_COMPLETED, APPOINTMENT_FAILED, REJECT_APPOINTMENT } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Check, X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorAppointmentCard = ({ mode, appointment, role, refresh }) => {
  const [acceptingAppointment, setIsAcceptingAppointment] = useState(false);
  const [rejectingAppointment, setIsRejectingAppointment] = useState(false);
  const [completingAppointment, setIsCompletingAppointment] = useState(false);
  const [failingAppointment, setIsFailingAppointment] = useState(false);
  const [reasonForRejection, setReasonForRejection] = useState("");
  const [openDialog, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const todayDate = new Date();

  const acceptAppointment = async () => {
    try {
      setIsAcceptingAppointment(true);
      const response = await axios.put(ACCEPT_APPOINTMENT, {
        appointmentId: appointment?._id,
        clientId: appointment?.clientId,
        appointmentDate: appointment?.appointmentDate,
      });
      if (response.status === 200) {
        refresh();
        toast({
          title: "Appointment accepted",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAcceptingAppointment(false);
    }
  };

  const rejectAppointment = async () => {
    if (reasonForRejection === "")
      return toast({
        title: "Please enter a reason for rejection",
        variant: "destructive",
      });

    try {
      setIsRejectingAppointment(true);
      const response = await axios.post(REJECT_APPOINTMENT, {
        appointmentId: appointment?._id,
        clientEmail: appointment?.clientDetails?.email,
        clientId: appointment?.clientId,
        shopId: appointment?.shopRecieverId,
        subject: appointment?.subject,
        rejectionReason: reasonForRejection,
        appointmentDate: appointment?.appointmentDate,
        appointmentTime: appointment?.appointmentTime,
        clientName: `${appointment?.clientDetails?.firstName} ${appointment?.clientDetails?.lastName}`,
      });

      if (response.status === 200) {
        refresh();
        toast({
          title: "Appointment rejected",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRejectingAppointment(false);
    }
  };

  const completeAppointment = async () => {
    try {
      setIsCompletingAppointment(true);
      const response = await axios.put(APPOINTMENT_COMPLETED, {
        appointmentId: appointment?._id,
      });

      if (response.status === 200) {
        refresh();
        toast({
          title: "Appointment marked as completed",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCompletingAppointment(false);
    }
  };

  const failedAppointment = async () => {
    try {
      setIsFailingAppointment(true);
      const response = await axios.put(APPOINTMENT_FAILED, {
        appointmentId: appointment?._id,
      });

      if (response.status === 200) {
        refresh();
        toast({
          title: "Appointment marked as failed",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFailingAppointment(false);
    }
  };


  const viewInCalendar = (date, eventId) => {
    navigate(`/events/${eventId}?eventDate=${date}`);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white border rounded-2xl shadow-md">
      <div className="flex items-center gap-6">
        {console.log(appointment)}
        <div className="w-24 h-24 rounded-lg overflow-hidden">
          <img
            src={appointment?.resources.petId?.petImages?.[0]?.url}
            alt="Pet"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">
            {appointment?.resources.petId?.petName}
          </h3>
          {role && role === "shopOwner" ? (
            <p className="text-sm text-gray-500">
              {appointment?.clientDetails.firstName +
                " " +
                appointment?.clientDetails.lastName +
                " | " +
                appointment?.clientDetails.phoneNo}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              {appointment?.shopRecieverId?.shopName}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-medium">Subject:</span> {appointment?.subject}
          </p>
          {role && role === "shopOwner" ? (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Client email:</span>{" "}
              {appointment?.clientDetails.email}{" "}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Address:</span>{" "}
              {appointment?.shopRecieverId?.shopAddress}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1 font-bold">
            <span>Date & Time:</span>{" "}
            {`${moment(appointment?.appointmentDate).format("MMM Do YYYY")} |
            ${moment(new Date(appointment?.startTime)).format("LT")}`}
          </p>
        </div>
        {mode === "new" ? (
          <div className="flex gap-4 justify-center items-center">
            <Button
              disabled={acceptingAppointment}
              onClick={() => acceptAppointment()}
              className="bg-green-500 text-white hover:bg-green-600 p-2 rounded-full shadow-md"
            >
              <Check className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-red-500 text-white hover:bg-red-600  p-2 rounded-full shadow-md"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : mode === "previous" ? (
          <div className="flex flex-col gap-2 h-32 justify-between items-end">
            <AppointmentBadge status={appointment?.status} />
            {role === "shopOwner" && appointment?.status === "pending" ? (
              <div className="flex gap-4">
                <Button onClick={()=>failedAppointment()} disabled={failingAppointment} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Failed
                </Button>

                <Button onClick={()=>completeAppointment()} disabled={completingAppointment} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  Completed
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    viewInCalendar(
                      appointment?.appointmentDate,
                      appointment?._id
                    )
                  }
                  className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                >
                  View in Calendar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 h-32 justify-between items-end">
            <AppointmentBadge status={appointment?.status} />
            <div className="flex gap-4">
              <Button
                onClick={() =>
                  viewInCalendar(appointment?.appointmentDate, appointment?._id)
                }
                className="bg-blue-500 text-white hover:bg-blue-600 w-full"
              >
                View in Calendar
              </Button>
              {role === "shopOwner" &&
                todayDate > new Date(appointment?.appointmentDate) &&
                appointment?.status === "pending" && (
                  <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full">
                    Mark as completed
                  </Button>
                )}
            </div>
          </div>
        )}

        {openDialog && (
          <Dialog open={openDialog} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <DialogTitle>Reason for rejection</DialogTitle>
                <DialogDescription>
                  Please provide a valid reason for rejecting the appointment
                  which would be shown to the client.
                </DialogDescription>
              </AlertDialogHeader>
              <Textarea
                id="description"
                placeholder="Write your reason"
                className="col-span-3"
                value={reasonForRejection}
                onChange={(e) => setReasonForRejection(e.target.value)}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={() => rejectAppointment()}
                  disabled={rejectingAppointment}
                >
                  Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentCard;
