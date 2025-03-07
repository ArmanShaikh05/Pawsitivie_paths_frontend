/* eslint-disable react/prop-types */

const EventTemplate = ({event}) => {
  return (
    <div className="bg-red-300 p-5 text-white">{event?.Subject}</div>
  )
}

export default EventTemplate