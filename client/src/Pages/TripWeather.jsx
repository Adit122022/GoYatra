import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloudSun, Droplets, Wind, Thermometer, Cloud, CloudRain, CloudSnow, CloudFog, Sun, CloudLightning } from "lucide-react";
import { axiosInstance } from "../components/Axios/axios";

const TripWeather = ({ tripId, tripPlan, setTripPlan }) => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const navigate = useNavigate();

  // Weather API key should be in your environment variables
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

  // Fetch trip details
  
  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }
      setLoading(true);

      try {
        // Check if tripId exists and is valid before making the request
        if (!tripId) {
          console.error("Trip ID is missing or invalid");
          setLoading(false);
          return;
        }

        console.log("Fetching trip details for ID:", tripId);
        const response = await axiosInstance.get(`/tripplan/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Trip details response:", response.data);
        const { trip } = response.data;

        // Check if trip data exists
        if (!trip) {
          console.error("Trip data is missing in the response");
          setLoading(false);
          return;
        }

        setTripPlan({
          generatedPlan: trip.generatedPlan,
          tripDetails: {
            location: trip.destination,
            duration: trip.days + " days",
            travelers: trip.travelGroup,
            budget: trip.budget,
          },
        });
      } catch (error) {
        console.error("Error fetching trip details:", error);
        // More detailed error logging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, setTripPlan, navigate]);

  // Separate useEffect for weather to avoid dependency issues
  useEffect(() => {
    const fetchWeather = async () => {
      // Make sure we have a location before trying to fetch weather
      if (!tripPlan?.tripDetails?.location) {
        console.log("No location available for weather fetch");
        return;
      }
      
      try {
        console.log("Fetching weather for:", tripPlan.tripDetails.location);
        // Use a direct fetch for weather API to avoid potential CORS issues
        const response = await fetch(`${WEATHER_API_URL}?q=${encodeURIComponent(tripPlan.tripDetails.location)}&appid=${WEATHER_API_KEY}&units=metric`);
        
        if (!response.ok) {
          throw new Error(`Weather API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Weather data:", data);
        setWeather(data);
        setWeatherError(null);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeatherError("Unable to fetch weather data for this location.");
      }
    };

    if (tripPlan?.tripDetails?.location) {
      fetchWeather();
    }
  }, [tripPlan?.tripDetails?.location, WEATHER_API_KEY]);

  // Function to get appropriate weather icon
  const getWeatherIcon = (weatherCode) => {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (!weatherCode) return <CloudSun className="h-8 w-8 text-blue-500" />;
    
    const code = weatherCode.toString();
    
    if (code.startsWith('2')) { // Thunderstorm
      return <CloudLightning className="h-8 w-8 text-gray-500" />;
    } else if (code.startsWith('3') || code.startsWith('5')) { // Drizzle or Rain
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (code.startsWith('6')) { // Snow
      return <CloudSnow className="h-8 w-8 text-gray-300" />;
    } else if (code.startsWith('7')) { // Atmosphere (fog, mist etc)
      return <CloudFog className="h-8 w-8 text-gray-400" />;
    } else if (code === '800') { // Clear sky
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else { // Clouds
      return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  // Function to get background color based on weather
  const getWeatherBackground = (weatherCode) => {
    if (!weatherCode) return "bg-blue-50";
    
    const code = weatherCode.toString();
    
    if (code.startsWith('2')) { // Thunderstorm
      return "bg-gray-100";
    } else if (code.startsWith('3') || code.startsWith('5')) { // Drizzle or Rain
      return "bg-blue-50";
    } else if (code.startsWith('6')) { // Snow
      return "bg-slate-50";
    } else if (code.startsWith('7')) { // Atmosphere (fog, mist etc)
      return "bg-gray-50";
    } else if (code === '800') { // Clear sky
      return "bg-amber-50";
    } else { // Clouds
      return "bg-gray-50";
    }
  };

  // Function to format date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`rounded-lg text-black shadow-md p-4  ${weather ? getWeatherBackground(weather.weather[0].id) : ""} transition-colors duration-500`}>
      <h3 className="text-lg  font-semibold mb-2 flex items-center">
        <CloudSun className="mr-2 h-5 w-5 text-blue-500" />
        Weather in {tripPlan?.tripDetails?.location || "Loading location..."}
      </h3>
      
      {loading && !weather && !weatherError && (
        <div className="flex items-center justify-center h-24">
          <div className="animate-pulse text-gray-500">Loading weather data...</div>
        </div>
      )}
      
      {weatherError && (
        <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
          {weatherError}
        </div>
      )}
      
      {weather && (
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {getWeatherIcon(weather.weather[0].id)}
              <div className="ml-3">
                <div className="font-bold text-2xl">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="text-gray-600 capitalize">
                  {weather.weather[0].description}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-right text-sm text-gray-500">
                {formatDate()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {weather.name}, {weather.sys.country}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div className="flex flex-col items-center p-2 bg-white/70 rounded-md shadow-sm">
              <Thermometer className="h-4 w-4 text-blue-500 mb-1" />
              <div className="text-gray-600">Feels like</div>
              <div className="font-medium">{Math.round(weather.main.feels_like)}°C</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/40 rounded-md shadow-sm">
              <Droplets className="h-4 w-4 text-blue-500 mb-1" />
              <div className="text-gray-600">Humidity</div>
              <div className="font-medium">{weather.main.humidity}%</div>
            </div>
            <div className="flex flex-col items-center p-2 bg-primary/40 rounded-md shadow-sm">
              <Wind className="h-4 w-4 text-blue-500 mb-1" />
              <div className="text-gray-600">Wind</div>
              <div className="font-medium">{Math.round(weather.wind.speed)} m/s</div>
            </div>
          </div>
          
          {/* Additional weather info */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 bg-white/70 rounded-md shadow-sm">
              <span className="text-gray-600">Min Temp</span>
              <span className="font-medium">{Math.round(weather.main.temp_min)}°C</span>
            </div>
            <div className="flex justify-between p-2 bg-white/70 rounded-md shadow-sm">
              <span className="text-gray-600">Max Temp</span>
              <span className="font-medium">{Math.round(weather.main.temp_max)}°C</span>
            </div>
            {weather.visibility && (
              <div className="flex justify-between p-2 bg-white/70 rounded-md shadow-sm">
                <span className="text-gray-600">Visibility</span>
                <span className="font-medium">{Math.round(weather.visibility / 1000)} km</span>
              </div>
            )}
            {weather.sys && weather.sys.sunrise && (
              <div className="flex justify-between p-2 bg-white/70 rounded-md shadow-sm">
                <span className="text-gray-600">Sunrise</span>
                <span className="font-medium">
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripWeather;