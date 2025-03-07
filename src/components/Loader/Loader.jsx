/* eslint-disable react/prop-types */
import "./loader.scss"

const Loader = ({position}) => {
  return (
    <div className={`loader-container ${position === "top" ? "items-start mt-20" : "items-center"}`}>
      <span className="loader"></span>
    </div>


  )
}

export default Loader