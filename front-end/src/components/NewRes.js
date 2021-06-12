import React, {Fragment, useState} from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";


function NewRes() {
    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "YYYY-MM-DD",
        reservation_time: "",
        people: 1,
    };
    
    const [formData, setFormData] = useState({ ...initialFormState });

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleNewRes = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        console.log(formData)
        async function create() {
            try {
                await createReservation(formData, abortController.signal);
                history.push(`/dashboard/${formData.reservation_date}`); // go to dashboard page of new reservation date
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Aborted");
                  } else {
                    throw error;
                  }
            }
        }
        create();
    }

    return (
        <Fragment>
            <h2>Create Deck</h2>
            <form className="form-group" onSubmit={handleNewRes}>
                <label>First Name:</label>
                <input 
                    name="first_name"
                    type="text" 
                    className="form-control"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                
                <label>Last Name:</label>
                <input 
                    name="last_name"
                    type="text" 
                    className="form-control"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />

                <label>Mobile Number:</label>
                <input 
                    name="mobile_number"
                    type="text" 
                    className="form-control"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    required
                />  

                <label>Date:</label>
                <input 
                    name="reservation_date"
                    type="date" 
                    className="form-control"
                    value={formData.reservation_date}
                    onChange={handleChange}
                    required
                />

                <label>Time:</label>
                <input 
                    name="reservation_time"
                    type="time" 
                    className="form-control"
                    value={formData.reservation_time}
                    onChange={handleChange}
                    required
                />

                <label>Number of guests:</label>
                <input 
                    name="people"
                    type="number"
                    min="1" 
                    className="form-control"
                    value={formData.people}
                    onChange={handleChange}
                    required
                />
                
                <button 
                className="btn btn-secondary my-2 mr-2"
                onClick={() => history.goBack()}>Cancel</button>
                <button 
                className="btn btn-primary my-2" 
                type="submit">
                    Submit
                </button>
            </form>
        </Fragment>
    )
}

export default NewRes;