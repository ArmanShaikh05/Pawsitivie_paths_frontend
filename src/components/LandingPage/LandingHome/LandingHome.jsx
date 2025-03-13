/* eslint-disable react/prop-types */
import {
    FootPrint,
    GirlHoldingADog,
    HomeDarkCardLeftPic,
    HomeDarkCardRightPic,
    HomePageDog,
} from "../../../assets";
import "./landinghome.scss";

const formatNumber = (number) => {
  const suffixes = ["", "k", "M", "B", "T"];
  const suffixNum = Math.floor(("" + number).length / 3);
  const shortNumber = parseFloat(
    (number / Math.pow(1000, suffixNum)).toFixed(1)
  );
  return shortNumber >= 1
    ? `${shortNumber}${suffixes[suffixNum]}${"+"}`
    : number.toString();
};

const Card = (props) => {
  return (
    <div className="card-container">
      <div>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

const LandingHome = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const adoptedPets = formatNumber(1212);

  return (
    <>
      <div className="home-container">
        <div className="homeContainer-left">
          <div className="flex flex-col items-center">
            <div className="home-title">
              <div className="home-titlePlusPng">
                <p>Your Pets </p>
                <img src={HomePageDog} alt="Dog sitting" />
              </div>
              Are Our
              <br />
              Priority
            </div>
            <p className="home-second-para">
              Ensure you are fully prepared to provide proper care and attention
              to your pet before welcoming them into your home.
            </p>
          </div>

          <button className="Home-button" onClick={scrollToTop}>
            <p>Adopt a Pet</p>
            <img src={FootPrint} alt="footprint" />
          </button>
          
        </div>
        <div className="homeContainer-right">
          <img src={GirlHoldingADog} alt="Girl holding a Dog" />
        </div>
      </div>

      <div className="dark-grey-container">
        <div className="left-pic">
          <img src={HomeDarkCardLeftPic} alt="Dog with toy" />
        </div>
        <div className="left-para">
          <p>
            <span className="adopted-pets-num">{adoptedPets}</span> Furry Friends
            <br />
            Living Their Best Lives
          </p>
        </div>
        <div className="right-pic">
          <img src={HomeDarkCardRightPic} alt="Dog pic" />
        </div>
        <div className="right-para">
          <p className="we-do">WHAT WE DO?</p>With a focus on matching the right
          pet with the right family, PawFinds makes it easy to adopt love and
          foster happiness.
        </div>
      </div>

      <div className="planning-container">
        <h1>Planning to Adopt a Pet?</h1>
        <div className="boxes-container">
          <Card
            title="The Joy of Pet Adoption"
            description="Bringing a pet into your life can be an incredibly rewarding experience, not just for you but for the furry friend you welcome into your home. There's a special kind of magic that comes with adopting any companion animal."
          />
          <Card
            title="A Guide to Pet Adoption"
            description="Are you considering adding a new pet to your family? Pet adoption is a wonderful option to consider. The journey of finding the ideal companion involves careful thought, research, and planning, but the rewards are immeasurable. "
          />
          <Card
            title="Healing Power of Animal"
            description="Animals have an extraordinary ability to touch our lives in profound ways, offering not only companionship but also a therapeutic bond that can positively impact our physical, mental, and emotional well-being"
          />
        </div>
      </div>
    </>
  );
};

export default LandingHome;
