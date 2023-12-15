import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ICAL from "ical.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSelector, useDispatch } from 'react-redux';
import { setCalendarEvents } from '../redux/reducers/calendarSlice';
import myImage from "./images/planner2.jpg";
import "./css/style.css"; // Import your custom CSS file

function HomePage() {
  const [icalLink, setIcalLink] = useState("");
  const [calendarUploaded, setCalendarUploaded] = useState(false);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user_id);
  const dispatch = useDispatch();
  const calendarEvents = useSelector(state => state.calendar.calendarEvents);

  useEffect(() => {
    if (calendarEvents.length > 0) {
      setCalendarUploaded(true);
    }
  }, [calendarEvents]);

  const parseAndDisplayIcalData = (icalData) => {
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent').map(vevent => new ICAL.Event(vevent));

    const parsedEvents = events.map(event => ({
      title: event.summary,
      description: event.description, 
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      location: event.location,  
    }));
    
    dispatch(setCalendarEvents(parsedEvents)); // Dispatch parsed events to Redux store
    setCalendarUploaded(true);
  };

  const handleIcalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch request to your backend
      const response = await fetch("http://localhost:3001/fetch-ical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ icalUrl: icalLink }),
      });

      if (response.ok) {
        const icalData = await response.text();
        parseAndDisplayIcalData(icalData);
        setCalendarUploaded(true);
      } else {
        console.log("Failed to fetch iCal data from backend");
        // Handle fetch failure from backend
      }
    } catch (error) {
      console.error("Error fetching iCal data from backend:", error);
      // Handle errors from backend fetch
    }
  };

  const handlePreferencesClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/insert-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, events: calendarEvents }),
      });

      if (response.ok) {
        // Handle successful event insertion
        navigate('/submit-preferences'); // Navigate to preferences page
      } else {
        // Handle errors from the server
        console.log('Failed to insert events');
      }
    } catch (error) {
      console.error('Error inserting events:', error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div className="dashboard">
      <div style={{ textAlign: "center" }}>
        <div className="image-container">
          <img src={myImage} alt="Calendar" className="background-image" />
        </div>
        <h1>Welcome to Your Dashboard</h1>
        <form onSubmit={handleIcalSubmit}>
          <input
            type="text"
            placeholder="Paste your iCal link here"
            value={icalLink}
            onChange={(e) => setIcalLink(e.target.value)}
            style={{ width: "50%", padding: "10px" }}
          />
          <button
            type="submit"
            style={{ padding: "10px 20px", marginLeft: "10px" }}
          >
            Upload Calendar
          </button>
        </form>
      </div>

      {calendarUploaded && (
        <div>
          <p>Calendar Uploaded</p>
          <div className="inner-box-calendar" style={{ marginTop: "60px" }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              height="700px"
            />
          </div>
          <button
            onClick={handlePreferencesClick}
            style={{ padding: "10px 20px", marginTop: "30px" }}
          >
            Choose Preferences
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
