import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../components/Axios/axios";
import Loader from "../components/Other/Loader";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const response = await axiosInstance.get("/tripplan/history");
        setTrips(response.data.trips);
      } catch (error) {
        console.error("Error fetching trip history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripHistory();
  }, [axiosInstance]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <h2 className="text-4xl font-extrabold mb-8 text-base-content">
          Trip History
        </h2>
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => {
              const imageUrl =
                trip.generatedPlan?.hotelOptions?.[0]?.hotelImageUrl ||
                trip.generatedPlan?.itinerary?.day1?.plan?.[0]?.placeImageUrl ||
                `https://source.unsplash.com/400x225/?${encodeURIComponent(trip.destination)}`;

              return (
                <div key={trip._id} className="card bg-base-100 shadow-xl image-full">
                  <figure>
                      <img 
                          src={imageUrl} 
                          alt={`View of ${trip.destination}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src="https://via.placeholder.com/400x225?text=Beautiful+Destination";
                          }}
                      />
                  </figure>
                  <div className="card-body justify-between">
                    <div>
                      <h3 className="card-title text-2xl">{trip.destination}</h3>
                      <p>A journey of {trip.days} {trip.days > 1 ? 'days' : 'day'}.</p>
                    </div>
                    <div className="card-actions justify-end">
                      <Link to={`/trip-display/${trip._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
              <h3 className="text-2xl font-semibold">No trips found.</h3>
              <p className="text-base-content/70 mt-2">Looks like you haven't planned any trips yet. Let's get started!</p>
              <Link to="/travel-preferences" className="btn btn-primary mt-6">
                  Plan a New Trip
              </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;
