import NoAppointments from "@/components/AppointmentSchedular/NoAppointments";
import AppointmentCard from "@/components/Cards/AppointmentCard/AppointmentCard";
import Loader from "@/components/Loader/Loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GET_DOCTOR_APPOINTMENTS,
  GET_SHOP_APPOINTMENTS,
  GET_USER_APPOINTMENTS,
} from "@/constants/routes";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Appointments = () => {
  const role = useSelector((state) => state.userDetailReducer.userData.role);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  const [isFetchAppointments, setIsFetchingAppointents] = useState(false);
  const [newAppointments, setNewAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  const [reducerValue, forceUpadte] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (role && role === "shopOwner") {
      setIsFetchingAppointents(true);
      axios
        .get(`${GET_SHOP_APPOINTMENTS}?shopId=${userId}`)
        .then(({ data }) => {
          const now = new Date();
          setNewAppointments(
            data.data.filter((appointment) => appointment.isScheduled === false)
          );
          setPreviousAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate < now;
            })
          );
          setUpcomingAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate > now;
            })
          );
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsFetchingAppointents(false);
        });
    } else if (role && role === "petDoctor") {
      setIsFetchingAppointents(true);
      axios
        .get(`${GET_DOCTOR_APPOINTMENTS}?doctorId=${userId}`)
        .then(({ data }) => {
          const now = new Date();
          setNewAppointments(
            data.data.filter((appointment) => appointment.isScheduled === false)
          );
          setPreviousAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate < now;
            })
          );
          setUpcomingAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate > now;
            })
          );
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsFetchingAppointents(false);
        });
    } else {
      setIsFetchingAppointents(true);
      axios
        .get(`${GET_USER_APPOINTMENTS}?userId=${userId}`)
        .then(({ data }) => {
          const now = new Date();
          setPreviousAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate < now;
            })
          );
          setUpcomingAppointments(
            data.data.filter((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              return appointment.isScheduled === true && appointmentDate > now;
            })
          );
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsFetchingAppointents(false);
        });
    }
  }, [role, userId, reducerValue]);

  return (
    <div className="p-6 overflow-y-hidden">
      <h2 className="text-xl font-semibold mb-4">My appointments</h2>
      {isFetchAppointments ? (
        <Loader />
      ) : (
        <div>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="previous">Previous</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              {role && role !== "user" && (
                <TabsTrigger value="new">New Appointents</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="previous">
              <ScrollArea className="h-[35rem]">
                <div className="flex flex-col gap-2">
                  {previousAppointments.length > 0 ? (
                    previousAppointments.map((appointment, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 * index }}
                      >
                        <AppointmentCard
                          appointment={appointment}
                          role={role}
                          refresh={forceUpadte}
                          mode={"previous"}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <NoAppointments mode="upcoming" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="upcoming">
              <ScrollArea className="h-[35rem]">
                <div className="flex flex-col gap-2">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 * index }}
                      >
                        <AppointmentCard
                          appointment={appointment}
                          role={role}
                          refresh={forceUpadte}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <NoAppointments mode="upcoming" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {role && role !== "user" && (
              <TabsContent value="new">
                <ScrollArea className="h-[35rem]">
                  <div className="flex flex-col gap-2">
                    {newAppointments.length > 0 ? (
                      newAppointments.map((appointment, index) => (
                        <motion.div
                          key={index}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 * index }}
                        >
                          <AppointmentCard
                            appointment={appointment}
                            mode="new"
                            role={role}
                            refresh={forceUpadte}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <NoAppointments mode="new" />
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Appointments;
