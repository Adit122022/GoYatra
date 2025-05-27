import { createContext, useState } from "react";

export const PlanContext = createContext();

const TripContext = ({ children }) => {
  const [tripPlan, setTripPlan] = useState(null);
  return (
    <div>
      <PlanContext.Provider value={{ tripPlan, setTripPlan }}>
        {children}
      </PlanContext.Provider>
    </div>
  );
};

export default TripContext;
