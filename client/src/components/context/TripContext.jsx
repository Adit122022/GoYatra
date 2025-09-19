import { createContext, useState, useContext } from "react";

export const PlanContext = createContext();

const TripProvider = ({ children }) => {
  const [tripPlan, setTripPlan] = useState(null);
  return (
    <PlanContext.Provider value={{ tripPlan, setTripPlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export const useTrip = () => useContext(PlanContext);

export default TripProvider;
