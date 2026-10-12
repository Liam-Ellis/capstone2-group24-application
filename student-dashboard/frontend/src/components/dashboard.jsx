import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/dashboard', {
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
        })
        .catch(err => {
            setFormError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <p> Loading posts... </p>;
    }

    if (formError) {
        return <p style={{color: 'red'}}> Error: {formError} </p>;
    }

    return (
        <>
            <h2> Dashboard </h2>
            <div>
                <div> <Link to = "/dashboard"> Dashboard </Link></div>
                <div> <Link to = "/application"> Application </Link></div>
                <div> <Link to = "/preference"> Preference Page </Link></div>
                <div> <Link to = "/upload"> Upload Resume </Link></div>
            </div>

        </>
    );
}

export default Dashboard;