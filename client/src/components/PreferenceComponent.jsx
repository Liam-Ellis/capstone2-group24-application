import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './preferenceComponent.css'

function PreferenceComponent() {
    const [studentDetails, setStudentDetails] = useState({
        studentId: "",
        fullName: "",
        CWA: "",
        emailNotifications: "",
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
    });

    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate(studentDetails);

        if (Object.keys(validationError).length > 0) {
            setFormErrors(validationError);
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:3000/api/preference',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentDetails),
                    credentials: 'include'
                }
            );

            const data = await response.json();
            if(response.ok === true) {
                alert('Preference submitted successfully!');
                navigate('/dashboard');
            }
            else {
                setFormErrors({general: data.message || 'Preference failed to submit!'});
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
        setStudentDetails({ ...studentDetails, [name]: value });
        setFormErrors({});
        console.log(studentDetails);
    };

    const validate = (values) => {
        const errors = {};

        return errors;
    };

    return (
                <form className="pref-container" onSubmit={handleSubmit}>
                    <p>Students you want <em>included</em> in your group</p>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div className="preferences" key={`pref${n}`}>
                            <label>
                                {n}{n === 1 ? "st " : n === 2 ? "nd " : n === 3 ? "rd " : "th "} 
                                Preference
                            <input
                                type="text"
                                name={`pref${n}`}
                                value={studentDetails[`pref${n}`]}
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
                                value={studentDetails[`dislikePref${n}`]}
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

                </form>
    )
}

export default PreferenceComponent