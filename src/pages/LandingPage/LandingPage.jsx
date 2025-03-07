import LandingFooter from "@/components/LandingPage/LandingFooter/LandingFooter"
import LandingHome from "@/components/LandingPage/LandingHome/LandingHome"
import LandingNavbar from "@/components/LandingPage/Navbar/LandingNavbar"

const LandingPage = () => {
  return (
    <div className="hidden-scrollbar">
      <LandingNavbar />
      <LandingHome />
      <LandingFooter />
    </div>
  )
}

export default LandingPage