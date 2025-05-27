import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Plane, User, Heart, Users, Group , PiggyBank, Wallet, Gem, MapPin, Calendar, Globe, Search, ChevronRight } from "lucide-react";
import Loader from "../components/Other/Loader";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import TiltedCard from "../components/ui/ReactBIt/TiltedCard";
import { useNavigate } from "react-router-dom";
import { PlanContext } from "../components/context/TripContext";
import { axiosInstance } from "../components/Axios/axios";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function EnhancedTravelForm() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelGroup, setTravelGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setTripPlan } = useContext(PlanContext);
  const [formStep, setFormStep] = useState(1);

  const navigate = useNavigate();

  const SelectBudgetOptions = [
    {
      id: 1,
      value: "cheap",
      icon: <PiggyBank/>,
      label: "Budget",
      description: "Affordable options",
    },
    {
      id: 2,
      value: "moderate",
      icon: <Wallet/>,
      label: "Moderate",
      description: "Mid-range comfort",
    },
    {
      id: 3,
      value: "luxary",
      icon: <Gem/>,
      label: "Luxury",
      description: "Premium experience",
    },
  ];

  const SelectTravelsList = [
    {
      id: 1,
      value: "just_me",
      icon: <User/>,
      label: "Solo",
      description: "Just me",
    },
    {
      id: 2,
      value: "couple",
      icon: <Heart/>,
      label: "Couple",
      description: "Romantic getaway",
    },
    {
      id: 3,
      value: "family",
      icon: <Users/>,
      label: "Family",
      description: "With kids",
    },
    {
      id: 4,
      value: "friends",
      icon: <Group/>,
      label: "Friends",
      description: "Group adventure",
    },
  ];
 

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }
      try {
        const response = await axiosInstance.get("/user/check-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication error:", error.response || error.message);
        alert("Authentication failed. Please log in again.");
        navigate("/login");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleCardClick = (type, value) => {
    if (type === "budget") {
      setBudget(value);
      setErrors({ ...errors, budget: "" });
    } else if (type === "travelGroup") {
      setTravelGroup(value);
      setErrors({ ...errors, travelGroup: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!destination) newErrors.destination = "Destination is required.";
      if (!days) newErrors.days = "Number of days is required.";
    } else if (step === 2) {
      if (!budget) newErrors.budget = "Budget selection is required.";
    } else if (step === 3) {
      if (!travelGroup) newErrors.travelGroup = "Travel group selection is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to generate a trip.");
      return;
    }

    // Final validation of all fields
    const newErrors = {};
    if (!destination) newErrors.destination = "Destination is required.";
    if (!days) newErrors.days = "Number of days is required.";
    if (!budget) newErrors.budget = "Budget selection is required.";
    if (!travelGroup) newErrors.travelGroup = "Travel group selection is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (parseInt(days, 10) > 7) {
      alert("Maximum number of days exceeded! Please choose at most 7 days.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "tripplan/createtrip",
        {
          destination: destination?.label,
          days,
          budget,
          travelGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tripData = response.data.trip;
      setTripPlan(tripData);
      const tripId = response.data.trip._id;
      navigate(`/trip-display/${tripId}`);
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert(error?.response?.data?.message || "Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }

    // Reset form
    setDestination(null);
    setDays("");
    setBudget("");
    setTravelGroup("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };


  //  custom styles for the  google
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none", // Light border color
      boxShadow: "none",
      width: "100%",
      minHeight: "3rem",
      borderRadius: "0.5rem",
      "&:hover": {
        borderColor: "#3b82f6", // Blue border on hover
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.8em",
      color: "#fffff", // Slate-400 for placeholder
    }),
    input: (provided) => ({
      ...provided,
      color: "#fffff", // Slate-800 for input text
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#dbeafe" : "#FFDBDB", // Light blue bg when focused
      color: "#000000", // Slate-800 for text
      padding: "10px 12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#bfdbfe", // Slightly darker blue on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
      zIndex: 10,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fffff", // Slate-800 for selected value
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#00000", // Slate-500 for dropdown arrow
    }),
    indicatorSeparator: () => ({
      display: "none", // Hide the separator
    }),
  };

  // Progress indicator
  const renderProgressSteps = () => {
    return (
      <div className="w-full flex justify-center mb-6">
        <ul className="steps md:text-sm text-xs steps-horizontal w-full max-w-md">
          <li className={`step ${formStep >= 1 ? "step-primary" : ""}`}>
            Destination
          </li>
          <li className={`step ${formStep >= 2 ? "step-primary" : ""}`}>
            Budget
          </li>
          <li className={`step ${formStep >= 3 ? "step-primary" : ""}`}>
            Travel Group
          </li>
          <li className={`step ${formStep >= 4 ? "step-primary" : ""}`}>
            Summary
          </li>
        </ul>
      </div>
    );
  };

  // Render step 1: Destination and Days
  const renderStep1 = () => {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Where would you like to go?</h2>
          <p className="opacity-75">Start by choosing your destination and trip duration</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Destination Input */}
          <motion.div variants={itemVariants} className="w-full form-control">
            <label className="label">
              <span className="label-text text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                Destination
              </span>
            </label>

            <div
              className={`relative w-full ${
                errors.destination ? "tooltip tooltip-open tooltip-error" : ""
              }`}
              data-tip={errors.destination}
            >
               <div className=" mt-2 relative w-full">
      <div className="flex items-center w-full border border-gray-200  rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <div className="flex-shrink-0 pl-3 text-gray-400">
          <Search size={18} />
        </div>
        
        <div className="flex-grow">
          <GooglePlacesAutocomplete
            apiKey={API_KEY}
            selectProps={{
              value: destination,
              onChange: (value) => {
                setDestination(value);
                setErrors({ ...errors, destination: "" });
              },
              placeholder: "Search for a city or landmark...",
              styles: customStyles,
              components: {
                DropdownIndicator: () => null, // Remove the dropdown arrow
              },
              isClearable: true,
            }}
          />
        </div>
      </div>
      
      {errors.destination && (
        <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
      )}
    </div>
            </div>
          </motion.div>
        </div>

        {/* Days Input */}
        <motion.div variants={itemVariants} className="w-full form-control">
          <label className="label">
            <span className="label-text text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Duration
              <span className="inline ml-2 sm:hidden"> in days</span>
            </span>
          </label>

          <div
            className={`relative  mt-2 w-full ${errors.days ? "tooltip tooltip-open tooltip-error" : ""}`}
            data-tip={errors.days}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {[...Array(7)].map((_, index) => (
                <motion.button
                  key={index + 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDays((index + 1).toString());
                    setErrors({ ...errors, days: "" });
                  }}
                  className={`btn btn-circle hover:scale-105 transition-all delay-150 duration-300 ${
                    days === (index + 1).toString() ? "btn-primary" : "btn-outline"
                  } md:w-16 md:h-16`}
                >
                  <div className="flex md:flex-col items-center">
                    <span className="md:text-xl   font-bold">{index + 1}</span>
                    <span className=" hidden sm:inline text-xs">{index === 0 ? "day" : "days"}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="btn btn-primary gap-2"
          >
            Next <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render step 2: Budget selection
  const renderStep2 = () => {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">What's your budget range?</h2>
          <p className="opacity-75">Choose your preferred spending level</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col form-control">
          <div
            className={`${errors.budget ? "tooltip tooltip-open tooltip-error" : ""}`}
            data-tip={errors.budget}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SelectBudgetOptions.map((option) => (
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={option.id}
                  onClick={() => handleCardClick("budget", option.value)}
                  className={`card cursor-pointer transition-all ${
                    budget === option.value
                      ? "ring-4 ring-primary ring-opacity-50 transform -translate-y-2"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="p-4 mx-auto ">
      <div className="relative w-[170px] h-[140px] overflow-hidden bg-primary/20 rounded-xl shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center">
        {/* Icon display */}
        <div className="text-primary gap-2  text-4xl transition-all duration-300 group-hover:opacity-30 flex items-center justify-center">
        <p className="text-center text-2xl">{option.icon}</p>
                  <h3 className="text-center text-2xl font-medium ">
                    {option.label}
                  </h3>

        </div>
        
        {/* Hover overlay with full information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-center px-2">
          <p className="text-lg font-semibold mb-1">{option.label}</p>
          {option.description && (
            <p className="text-xs leading-tight">{option.description}</p>
          )}
        </div>
      </div>
                  </div>
                  {budget === option.value && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <div className="badge badge-primary badge-lg">Selected</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            className="btn btn-outline gap-2"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="btn btn-primary gap-2"
          >
            Next <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render step 3: Travel Group
  const renderStep3 = () => {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Who's traveling with you?</h2>
          <p className="opacity-75">Select your travel companions</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col form-control">
          <div
            className={`${errors.travelGroup ? "tooltip tooltip-open tooltip-error" : ""}`}
            data-tip={errors.travelGroup}
          >
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {SelectTravelsList.map((option) => (
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  key={option.id}
                  onClick={() => handleCardClick("travelGroup", option.value)}
                  className={` mx-auto cursor-pointer transition-all rounded ${
                    travelGroup === option.value
                      ? "ring-4 ring-primary ring-opacity-50 transform -translate-y-2"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="p-4 mx-auto ">
      <div className="relative w-[170px] h-[140px] overflow-hidden bg-primary/20 rounded-xl shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:rotate-1 flex items-center justify-center">
        {/* Icon display */}
        <div className="text-primary gap-2  text-4xl transition-all duration-300 group-hover:opacity-30 flex items-center justify-center">
        <p className="text-center text-2xl">{option.icon}</p>
                  <h3 className="text-center text-2xl font-medium ">
                    {option.label}
                  </h3>

        </div>
        
        {/* Hover overlay with full information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-center px-2">
          <p className="text-lg font-semibold mb-1">{option.label}</p>
          {option.description && (
            <p className="text-xs leading-tight">{option.description}</p>
          )}
        </div>
      </div>
                  </div>
                  {travelGroup === option.value && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <div className="badge badge-primary badge-lg">Selected</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            className="btn btn-outline gap-2"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="btn btn-primary gap-2"
          >
            Next <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render step 4: Summary
  const renderStep4 = () => {
    const getIconForValue = (type, value) => {
      if (type === "budget") {
        return SelectBudgetOptions.find(option => option.value === value)?.icon || null;
      } else if (type === "travelGroup") {
        return SelectTravelsList.find(option => option.value === value)?.icon || null;
      }
      return null;
    };
    

    const getLabelForBudget = (value) => {
      return SelectBudgetOptions.find(option => option.value === value)?.label || value;
    };
    
    const getLabelForTravelGroup = (value) => {
      return SelectTravelsList.find(option => option.value === value)?.label || value;
    };

    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Your Trip Summary</h2>
          <p className="opacity-75">Review your adventure details</p>
        </motion.div>

        <div className="card shadow-lg">
          <div className="card-body">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row items-center gap-4 mb-4"
            >
              <div className=" flex items-center">
                <div className="w-16 h-16 rounded-full mask mask-squircle flex items-center justify-center">
                  <Globe size={32} className="text-primary animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{destination?.label || "No destination selected"}</h3>
                <p className="text-sm opacity-75">For {days} {days === "1" ? "day" : "days"}</p>
              </div>
            </motion.div>

            <div className="divider"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="avatar">
    {getIconForValue("budget", budget)}
</div>
<div>
  <h4 className="text-lg font-semibold">Budget</h4>
  <p>{getLabelForBudget(budget)}</p>
</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="avatar">
                <div className="text-3xl text-primary">
  {getIconForValue("travelGroup", "couple")}
</div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Travel Group</h4>
                  <p>{getLabelForTravelGroup(travelGroup)}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            className="btn btn-outline gap-2"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="btn btn-primary gap-2  ml-2"
          >
            <Plane size={18} /> Generate My Trip
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (formStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden min-w-screen py-10 px-4">
      <div className="flex flex-col justify-between lg:flex-row  overflow-x-hidden max-w-7xl mx-auto">
        {/* Form Side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:w-2/3 card shadow-2xl rounded-3xl overflow-hidden"
        >
          {/* Hero Banner */}
          <div className="p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute w-40 h-40 rounded-full top-4 right-4"></div>
              <div className="absolute w-20 h-20 rounded-full bottom-4 left-10"></div>
              <div className="absolute w-32 h-32 rounded-full right-1/3"></div>
            </div>

            <motion.div variants={itemVariants} className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Plane className="w-8 h-8 mr-3 inline" /> Create Your Adventure
              </h1>
              <p className="text-lg opacity-90 max-w-lg">
                Tell us your preferences, and we'll craft the perfect travel experience
              </p>
            </motion.div>
          </div>

          <div className="divider my-0"></div>

          {/* Progress indicator */}
          <div className="px-6 pt-6">{renderProgressSteps()}</div>

          {/* Form Content */}
          <div className="p-6 md:p-8">{renderStepContent()}</div>
        </motion.div>

        {/* Map/Image Side with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="lg:w-1/4 hidden lg:block relative h-auto"
        >
          <div className="sticky top-10 w-full">
            <div className="card shadow-2xl full  overflow-hidden">
              <TiltedCard
                className="object-cover"
                imageSrc="https://i.pinimg.com/736x/f9/af/73/f9af73ea72f0f484bf2c9c00a7a1a1d2.jpg"
                altText="Travel Adventure Map"
                captionText="AI Trip Planner"
                containerHeight="500px"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                 <p></p>
                }
              />
            </div>

            {/* Travel stat cards */}
            {destination && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className=" card shadow-md p-4"
              >
                <div className="stat">
                  <div className="stat-title">Selected Destination</div>
                  <div className="stat-value text-xl">{destination?.label}</div>
                  <div className="stat-desc">Start your journey today!</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}