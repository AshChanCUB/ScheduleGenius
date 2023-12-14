import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPreferences as setReduxPreferences } from '../redux/reducers/preferenceSlice';


function PreferencesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedPreferences = useSelector(state => state.preferences.userPreferences);
  const userId = useSelector(state => state.user.user_id);

  const [preferences, setPreferences] = useState([]);
  const [labelWeights, setLabelWeights] = useState({
    'Lectures and Classes': 0.05,
    'Homework Assignments': 0.15,
    'Projects': 0.25,
    'Exams': 0.30,
    'Quizzes': 0.20,
    'Administrative Tasks': 0.05,
  });
  const [studyModel, setStudyModel] = useState('Pomodoro');
  const [pomodoroSettings, setPomodoroSettings] = useState({
    pomodoroLength: 25,
    breakLength: 5,
    extendedBreaks: 3
  });
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  useEffect(() => {
    if (savedPreferences && Object.keys(savedPreferences).length > 0) {
      setPreferences(savedPreferences.preferences || []);
      setLabelWeights(savedPreferences.labelWeights || labelWeights);
      setStudyModel(savedPreferences.studyModel || studyModel);
      setPomodoroSettings(savedPreferences.pomodoroSettings || pomodoroSettings);
    } else {
      fetchEventTypes();
    }
  }, [savedPreferences, labelWeights, studyModel, pomodoroSettings]); // Include dependencies here
  

    const fetchEventTypes = async () => {
      try {
        const response = await fetch('http://localhost:3001/unique-event-titles');
        if (response.ok) {
          const eventTypes = await response.json();
          setPreferences(eventTypes.map(type => ({
            type, 
            priority: '1', // Default priority
            label: 'Lectures and Classes', // Default label
            focusLevel: 'No Preference', // Default focus level
            estimatedDuration: 2 // Default estimated duration in hours
          })));
        } else {
          console.log('Failed to fetch event types');
        }
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    const handleReturnClick = () => {
      navigate('/home');
    };


  const handleLabelChange = (type, newLabel) => {
    setPreferences(preferences.map(pref => 
      pref.type === type ? { ...pref, label: newLabel } : pref
    ));
  };

  const handleEstimatedDurationChange = (type, newDuration) => {
    setPreferences(preferences.map(pref => 
      pref.type === type ? { ...pref, estimatedDuration: newDuration } : pref
    ));
  };

  const handleLabelWeightChange = (label, newWeight) => {
    setLabelWeights(prevWeights => ({
      ...prevWeights,
      [label]: parseFloat(newWeight)
    }));
  };
  
  const handleFocusLevelChange = (type, newFocusLevel) => {
    setPreferences(preferences.map(pref => 
      pref.type === type ? { ...pref, focusLevel: newFocusLevel } : pref
    ));
  };

  const handlePomodoroSettingChange = (setting, value) => {
    setPomodoroSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };
  
  const handlePriorityChange = (type, newPriority) => {
    setPreferences(preferences.map(pref => 
      pref.type === type ? { ...pref, priority: newPriority } : pref
    ));
  };

  const handleExportClick = () => {
    // and it expects a query parameter for the user ID
    window.open(`http://localhost:3001/export-csv?userId=${userId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserId = userId;
    dispatch(setReduxPreferences({
      preferences,
      labelWeights,
      studyModel,
      pomodoroSettings
    }));
  
    try {
      const response = await fetch('http://localhost:3001/submit-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          preferences: preferences,
          labelWeights: labelWeights,
          studyModel: studyModel,
          pomodoroSettings: pomodoroSettings
        }),
      });
  
      if (response.ok) {
        setPreferencesSaved(true);
      } else {
        console.log('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };





  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Set Your Preferences</h1>
      <form onSubmit={handleSubmit}>
        <table style={{ margin: '0 auto' }}>
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Priority</th>
              <th>Event Label</th> {/* New column for Event Label */}
              <th>Focus Level</th> 
              <th>Estimated Duration (hours)</th> 
            </tr>
          </thead>
          <tbody>
            {preferences.map((pref, index) => (
              <tr key={index}>
                <td>{pref.type}</td>
                <td>
                  <select 
                    value={pref.priority}
                    onChange={(e) => handlePriorityChange(pref.type, e.target.value)}
                  >
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={pref.label}
                    onChange={(e) => handleLabelChange(pref.type, e.target.value)}
                  >
                    <option value="Lectures and Classes">Lectures and Classes</option>
                    <option value="Homework Assignments">Homework Assignments</option>
                    <option value="Projects">Projects</option>
                    <option value="Exams">Exams</option>
                    <option value="Quizzes">Quizzes</option>
                    <option value="Administrative Tasks">Administrative Tasks</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={pref.focusLevel}
                    onChange={(e) => handleFocusLevelChange(pref.type, e.target.value)}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </td>
                <td>
        <input 
          type="number"
          value={pref.estimatedDuration}
          onChange={(e) => handleEstimatedDurationChange(pref.type, e.target.value)}
          min="0"
        />
      </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <h2>Set Weights for Event Labels</h2>
        <div>
          {Object.keys(labelWeights).map((label, index) => (
            <div key={index}>
              <label>{label}: </label>
              <input 
                type="number" 
                value={labelWeights[label]}
                onChange={(e) => handleLabelWeightChange(label, e.target.value)}
                step="0.01"
                min="0"
                max="1"
              />
            </div>
          ))}
        </div>
        <div>
  <h2>Pick Study Model: </h2>
  <div>
    <select 
      value={studyModel}
      onChange={(e) => setStudyModel(e.target.value)}
      style={{ marginBottom: '10px' }}
    >
      <option value="Pomodoro">Pomodoro</option>
      {/* Add other study models as needed */}
    </select>
  </div>
  {studyModel === 'Pomodoro' && (
    <div>
      <div>
        <label>Pomodoro Length (minutes): </label>
        <input 
          type="number" 
          value={pomodoroSettings.pomodoroLength}
          onChange={(e) => handlePomodoroSettingChange('pomodoroLength', e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Break Length (minutes): </label>
        <input 
          type="number" 
          value={pomodoroSettings.breakLength}
          onChange={(e) => handlePomodoroSettingChange('breakLength', e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Extended Breaks (Pomodoro Sessions): </label>
        <input 
          type="number" 
          value={pomodoroSettings.extendedBreaks}
          onChange={(e) => handlePomodoroSettingChange('extendedBreaks', e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </div>
  )}
</div>
  
        <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
          Save Preferences
        </button>
      </form>
  
      {preferencesSaved && (
        <>
          <p>Preferences Saved</p>
          <button onClick={handleExportClick} style={{ padding: '10px 20px' }}>
        Export Calendar
      </button>
          <button onClick={handleReturnClick} style={{ padding: '10px 20px', marginTop: '20px' }}>
            Return to Home
          </button>
        </>
      )}
    </div>
  );
}

export default PreferencesPage;