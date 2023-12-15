import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import PreferencesPage from "./preferencePage"; // Import PreferencesPage
import myImage from "./images/planner2.jpg";
import "./css/style.css"; // Import your custom CSS file

const Dashboard = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const calendarEvents = useSelector((state) => state.calendar.calendarEvents);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const handleCloseClick = () => {
    // Implement any logic you need before going back to the dashboard
    dispatch(setSelectedTile(null));
  };

  // Memoize the 'tiles' array to prevent unnecessary re-creation
  const tiles = useMemo(() => [
    {
      title: "My Plan",
      link: "/my-plan",
      description: "Access and plan your activities",
    },
    {
      title: "Calendar",
      link: "/calendar",
      description: "Manage your calendar events",
    },
    {
      title: "Edit Preferences",
      link: "/edit-preferences",
      description: "Customize your preferences",
    },
    {
      title: "My Profile",
      link: "/my-profile",
      description: "View and edit your profile information",
    },
  ], []);

  useEffect(() => {
    // Clear the selected tile when a different tile is clicked
    if (selectedTile) {
      const tileLink = selectedTile.link;
      const isDifferentTileClicked = !tiles.some((tile) => tile.link === tileLink);
      if (isDifferentTileClicked) {
        setSelectedTile(null);
      }
    }
  }, [selectedTile, tiles]);

  return (
    <div>
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <div className="dashboard">
        <div className="header">
          <h1>Welcome to Your Dashboard</h1>
        </div>
        <div className="tiles-container">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`dashboard-tile ${selectedTile && selectedTile.link === tile.link ? 'selected' : ''}`}
              onClick={() => setSelectedTile(tile)}
            >
              <h2>{tile.title}</h2>
              <p>{tile.description}</p>
            </div>
          ))}
        </div>
        <div className="carousel">{/* Your carousel content goes here */}</div>
      </div>
    
      {/* Conditionally render PreferencesPage component */}
      {selectedTile && selectedTile.link === "/edit-preferences" && (
        <div>
        <PreferencesPage />
        <button className="close-button" onClick={() => setSelectedTile(null)}>x</button>
        </div>
      )}

      {/* Conditionally render user details modal */}
      {selectedTile && selectedTile.link === "/my-profile" && (
        <div className="user-details-modal">
        <div className="inner-box-user">
          <h2>User Profile</h2>
          <div className="user-details">
            <p>
              <strong>First Name:</strong>
            </p>
            <p>
              <strong>Last Name:</strong> 
            </p>
            <p>
              <strong>Email:</strong> 
            </p>
            {/* Add other user details as needed */}
          </div>
        </div>
      </div>
      )}

      {/* Conditionally render Calendar component */}
      {selectedTile && selectedTile.link === "/calendar" && (
        <div>
          <div className="inner-box-calendar" style={{ marginTop: "60px" }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              height="700px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
