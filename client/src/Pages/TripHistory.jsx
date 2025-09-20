import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxios from "../components/Axios/axios";
import DeleteAlert from "../components/Other/DeleteAlert";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const response = await axiosInstance.get("/tripplan/history");
        const uniqueTrips = response.data.trips.reduce((acc, current) => {
          if (!acc.find((item) => item._id === current._id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setTrips(uniqueTrips);
      } catch (error) {
        console.error("Error fetching trip history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripHistory();
  }, [axiosInstance]);

  const handleDelete = (tripId) => {
    setTripToDelete(tripId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/tripplan/${tripToDelete}`);
      setTrips(trips.filter((trip) => trip._id !== tripToDelete));
      setShowDeleteAlert(false);
      setTripToDelete(null);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setTripToDelete(null);
  };

  // Skeleton Loader for cards
  const SkeletonCard = () => (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="h-48 bg-base-300 rounded-t-xl"></div>
      <div className="card-body space-y-3">
        <div className="h-6 bg-base-300 rounded w-3/4"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
        <div className="flex justify-end">
          <div className="h-10 w-24 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
          <h2 className="text-4xl font-extrabold mb-8 text-base-content">
            Trip History
          </h2>
          {/* Skeleton grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
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
                `https://source.unsplash.com/400x225/?${encodeURIComponent(
                  trip.destination
                )}`;

              return (
                <div key={trip._id} className="card bg-base-100 shadow-xl overflow-hidden">
                  <figure className="h-48">
                    <img
                      src={imageUrl}
                      alt={`View of ${trip.destination}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x225?text=Beautiful+Destination";
                      }}
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{trip.destination}</h2>
                    <p>
                      A journey of {trip.days}{" "}
                      {trip.days > 1 ? "days" : "day"}.
                    </p>
                    <div className="card-actions justify-end">
                      <Link
                        to={`/trip-display/${trip._id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="btn btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold">No trips found.</h3>
            <p className="text-base-content/70 mt-2">
              Looks like you haven\'t planned any trips yet. Let\'s get started!
            </p>
            <Link to="/travel-preferences" className="btn btn-primary mt-6">
              Plan a New Trip
            </Link>
          </div>
        )}
      </div>
      {showDeleteAlert && (
        <DeleteAlert onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
};

export default TripHistory;
