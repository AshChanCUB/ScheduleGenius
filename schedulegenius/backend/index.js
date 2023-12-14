const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.post("/signup", async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    securityQuestion,
    securityAnswer,
  } = req.body;

  /*console.log(firstname);
    console.log(lastname);
    console.log(email);
    console.log(password);
    console.log(securityQuestion);
    console.log(securityAnswer);*/

  if (
    !email ||
    !password ||
    !firstname ||
    !lastname ||
    !securityQuestion ||
    !securityAnswer
  ) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
    await db.query(
      "INSERT INTO users (first_name, last_name, email, password_hash, security_question, security_answer_hash ) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        firstname,
        lastname,
        email,
        hashedPassword,
        securityQuestion,
        hashedSecurityAnswer,
      ]
    );
    res.status(201).json({ message: "User registered successfully" });
    console.log("Signup form submitted with:", {
      firstname,
      lastname,
      email,
      password,
      securityQuestion,
      securityAnswer,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Error during registration : User already exists" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing fields");
  }

  try {
    // Query the database for a user with the provided email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    // Check if user exists
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      console.log("Password match:", passwordMatch);

      if (passwordMatch) {
        // Password is correct
        res
          .status(200)
          .json({ message: "Login successful", user_id: user.user_id });
        console.log("Login Successful");
      } else {
        // Password is incorrect
        res.status(401).json({ message: "Invalid credentials" });
        console.log("Invalid credentials - password does not match");
      }
    } else {
      // User not found
      res.status(401).json({ message: "Invalid credentials" });
      console.log("Invalid credentials - user not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

let fetch;

app.post("/fetch-ical", async (req, res) => {
  fetch = fetch || (await import("node-fetch")).default;
  const { icalUrl } = req.body;
  try {
    const response = await fetch(icalUrl);
    const icalData = await response.text();
    res.send(icalData);
  } catch (error) {
    console.error("Error fetching iCal data:", error);
    res.status(500).send("Error fetching iCal data");
  }
});

app.post("/insert-events", async (req, res) => {
  const { userId, events } = req.body;
  try {
    await Promise.all(
      events.map(async (event) => {
        await db.query(
          "INSERT INTO events (user_id, title, description, start_time, end_time, location) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            userId,
            event.title,
            event.description,
            event.start,
            event.end,
            event.location,
          ]
        );
      })
    );
    res.status(200).json({ message: "Events inserted successfully" });
  } catch (error) {
    console.error("Error inserting events:", error);
    res.status(500).json({ message: "Error inserting events" });
  }
});

app.get("/unique-event-titles", async (req, res) => {
  try {
    const result = await db.query("SELECT DISTINCT title FROM events");
    const titles = result.rows.map((row) => row.title);
    res.json(titles);
  } catch (error) {
    console.error("Error fetching unique event titles:", error);
    res.status(500).send("Error fetching unique event titles");
  }
});

app.post("/submit-preferences", async (req, res) => {
  const { userId, preferences } = req.body;
  try {
    // Delete existing preferences for the user
    await db.query("DELETE FROM user_preferences WHERE user_id = $1", [userId]);

    // Insert new preferences
    await Promise.all(
      preferences.map(async (pref) => {
        await db.query(
          "INSERT INTO user_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)",
          [userId, pref.type, pref.priority]
        );
      })
    );
    res.status(200).json({ message: "Preferences saved successfully" });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Error saving preferences" });
  }
});

const Papa = require("papaparse");

app.get("/export-csv", async (req, res) => {
  const userId = req.query.userId;
  const query = `
    SELECT e.event_id, e.user_id, e.title, e.description, e.start_time, e.end_time, e.event_type, e.location, p.preference_id, p.preference_type, p.preference_value
    FROM events e
    LEFT JOIN user_preferences p ON e.title = p.preference_type
    WHERE e.user_id = $1;
  `;

  try {
    const result = await db.query(query, [userId]);
    const formattedData = result.rows.map((row) => ({
      event_id: row.event_id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      start_time: row.start_time,
      end_time: row.end_time,
      event_type: row.event_type,
      location: row.location,
      preference_id: row.preference_id,
      preference_type: row.preference_type,
      preference_value: row.preference_value,
    }));

    const csv = Papa.unparse(formattedData, {
      header: true,
    });

    res.setHeader("Content-Type", "text/csv");
    res.attachment("export.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).send("Error generating CSV");
  }
});

let otpStorage;
let emailStorage;
const otpMap = new Map();
app.post("/sendotp", async (req, res) => {
  try {
    const { email, securityQuestion, securityAnswer } = req.body;
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!email || !securityAnswer || !securityQuestion) {
      return res.status(400).send("Missing fields");
    } else if (user) {
      if (securityQuestion == user.security_question) {
        const secans = await bcrypt.compare(
          securityAnswer,
          user.security_answer_hash
        );
        if (secans) {
          console.log("Security Answer match:", secans);
          console.log("Sending OTP...");
          // Generate OTP and store it in the global variable
          otpStorage = generateOTP();
          // Store email in global variable
          emailStorage = email;
          // Save OTP in the map
          otpMap.set(email, otpStorage);
          console.log("Generated otp is " + otpStorage);
          await sendOTPByEmail(email, otpStorage);
          res.status(200).json({ message: "OTP sent successfully" });
        } else {
          console.log("Security answer wrong");
          res.status(401).json({ message: "Security answer wrong" });
        }
      } else {
        console.log("Security question wrong");
        res.status(401).json({ message: "Security question wrong" });
      }
    } else {
      res.status(401).json({ message: "Invalid email" });
      console.log("Invalid email - user not found");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/verifyotp", async (req, res) => {
  try {
    const { enterOtp } = req.body;
    const storedOTP = otpStorage;
    console.log("Stored otp in the session is " + storedOTP);
    if (!storedOTP) {
      console.log("OTP not found in the session");
      return res.status(400).json({ error: "OTP not found in the session" });
    }

    if (enterOtp === storedOTP) {
      // OTP is valid
      console.log("OTP verified successfully");
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      // Invalid OTP
      console.log("Invalid OTP");
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/resetpass", async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!password) {
    console.log('Missing fields')
    return res.status(400).send("Missing fields");
  }

  try {
    // Query the database for a user with the provided email
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      emailStorage,
    ]);
    const user = result.rows[0];
    if (user) {
      await db.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
        hashedPassword,
        emailStorage,
      ]);
      console.log('Updated the password');
      res.status(200).json({ message: "Updated password successfully" });
    } else {
      // User not found
      res.status(401).json({ message: "Invalid credentials" });
      console.log("Invalid credentials - user not found");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPByEmail(email, otp) {
  // You need to configure your email service here (using nodemailer)
  // Example with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "schedule.genius.planner@gmail.com",
      pass: "hwco nbke iblr zgxn",
    },
  });

  const mailOptions = {
    from: "schedule.genius.planner@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };
  console.log("Mail sent to the user");
  transporter.sendMail(mailOptions);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
