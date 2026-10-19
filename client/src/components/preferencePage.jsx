import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreferencePage.css'

function PreferencePage() {
    const [prefs, setPrefs] = useState({
        prefsFor: ["","","","",""],
        prefsAgainst: ["","","","",""],
    });

    /*
    const [prefs, setPrefs] = useState({
        pref1: "",
        pref2: "",
        pref3: "",
        pref4: "",
        pref5: "",
        dislikePref1: "",
        dislikePref2: "",
        dislikePref3: "",
        dislikePref4: "",
        dislikePref5: ""
    });*/

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'http://localhost:3000/student/prefs',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(prefs),
                    credentials: 'include'
                }
            );

            const data = await response.text();
            if(response.ok) {
                alert('Preference submitted successfully!');
            }
            else {
                let errorMsg;

                if (data.includes("{") &&
                    data.includes("message")) {
                    errorMsg = JSON.parse(data).message;
                } else {
                    errorMsg = data
                }
                
                setFormErrors({general: errorMsg || 'Preference failed to submit!'});
                return;
            }
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
            setFormErrors({ general: 'Please try again!' });
        }
    };

    const inputChanges = (e) => {
        const { name, value } = e.target;

        if (name.includes('dislikePref')) {
            let n = name.split("dislikePref")[1];
            let newPrefsAgainst = prefs.prefsAgainst;
            newPrefsAgainst[n - 1] = value;

            setPrefs({ ...prefs, prefsAgainst: newPrefsAgainst });
        } else {
            let n = name.split("pref")[1];
            let newPrefsFor = prefs.prefsFor;
            newPrefsFor[n - 1] = value;

            setPrefs({ ...prefs, prefsFor: newPrefsFor });
        }
    };

    return (
                <form className="pref-container" onSubmit={handleSubmit}>
                    <div className="pref-form-section">
                    <p>Students you want <em>included</em> in your group</p>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div className="preferences" key={`pref${n}`}>
                            <label>
                                {n}{n === 1 ? "st " : n === 2 ? "nd " : n === 3 ? "rd " : "th "} 
                                Preference
                            <input
                                type="text"
                                name={`pref${n}`}
                                value={prefs.prefsFor[n - 1]}
                                onChange={inputChanges}
                                placeholder={`${n}${n === 1  ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} Preference`}
                            />
                            </label>
                        </div>
                    ))}

                    <p>Students you want <em>excluded</em> from your group</p>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div className="preferences" key={`dislikePref${n}`}>
                            <label>
                                {n}{n === 1 ? "st " : n === 2 ? "nd " : n === 3 ? "rd " : "th "} 
                                Preference
                            <input
                                type="text"
                                name={`dislikePref${n}`}
                                value={prefs.prefsAgainst[n - 1]}
                                onChange={inputChanges}
                                placeholder={`${n}${n === 1  ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} Preference`}
                            />
                            </label>
                        </div>
                    ))}

                    {formErrors.general && (
                        <div> {formErrors.general} </div>
                    )}
                    
                    <button className="preference-submit" type="submit">
                        Submit
                    </button>
                    </div>
                </form>
    )
}

export default PreferencePage