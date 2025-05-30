---

# GoYatra

**GoYatra** is a full-stack travel planning application designed to streamline the process of discovering, organizing, and booking travel experiences. Built with modern web technologies, GoYatra offers users an intuitive interface to explore destinations, manage itineraries, and make reservations seamlessly.

## 🌐 Live Demo

👉 [GoYatra-Live-Privew](https://github.com/Adit122022/GoYatra)


## 📁 Project Structure

The project follows a monorepo architecture, separating the frontend and backend for modularity and scalability:

```
GoYatra/
├── client/   # Frontend application (React)
└── server/   # Backend application (Node.js/Express)
```

## 🚀 Features

* **User Authentication**: Secure login and registration system.
* **Destination Browsing**: Explore various travel destinations with detailed information.
* **Itinerary Management**: Create and customize travel plans.
* **Booking System**: Reserve accommodations and activities.
* **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
* **API Integration**: Fetch real-time data for destinations, weather, and more.

## 🛠️ Tech Stack

### Frontend

* **React**: Component-based UI development.
* **React Router**: Client-side routing.
* **Context API**: Lightweight state management..
* **Axios**: HTTP client for API requests.
* **Bootstrap/Tailwind CSS**: Responsive design and styling.

### Backend

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web framework for Node.js.
* **Gemini AI**: Integrated AI-powered chatbot for support and itinerary.
* **MongoDB**: NoSQL database for storing user and travel data.
* **Mongoose**: ODM for MongoDB.
* **JWT**: JSON Web Tokens for authentication.
* **bcrypt**: Password hashing.

## 🧑‍💻 Getting Started

### Prerequisites

* **Node.js** (v14 or above)
* **npm** or **yarn**
* **MongoDB** instance (local or cloud-based)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Adit122022/GoYatra.git
   cd GoYatra
   ```

2. **Setup Backend:**

   ```bash
   cd server
   npm install
   ```

   * Create a `.env` file in the `server` directory with the following variables:

     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

   * Start the backend server:

     ```bash
     npm start
     ```

3. **Setup Frontend:**

   ```bash
   cd ../client
   npm install
   ```

   * Start the frontend development server:

     ```bash
     npm start
     ```

   * The application will be accessible at `http://localhost:3000`.

## 📦 Deployment

To deploy GoYatra:

1. **Frontend**: Build the React application.

   ```bash
   cd client
   npm run build
   ```

   * Deploy the `build` folder to a static hosting service like **Netlify**, **Vercel**, or **GitHub Pages**.

2. **Backend**: Deploy the Express server to a platform like **Heroku**, **Render**, or **DigitalOcean**.

   * Ensure environment variables are correctly set on the hosting platform.

## 🧪 Testing

*Testing scripts and instructions will be added in future updates.*

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Contact

For any inquiries or feedback:

* **GitHub**: [Adit122022](https://github.com/Adit122022)
