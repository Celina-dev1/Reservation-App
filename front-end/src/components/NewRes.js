import React, {Fragment, useState} from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
//import { ErrorAlert } from "../layout/ErrorAlert";


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
        if (target.name === "people") {
            setFormData({
                ...formData,
                [target.name]: target.valueAsNumber,
            });
        } else {
            setFormData({
                ...formData,
                [target.name]: target.value,
            });
        } 
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

    const isTuesday = (date) => {
        const resDate = new Date(date);

         if (resDate.getUTCDay() === 2) {
             return true;
         }
         return false;
    };

    // const dateInPast = (date) => {
    //     const today = new Date();
    //     const resDate = new Date(date);

    //     if (resDate.toISOString().substring(0, 10) >= today.toISOString().substring(0, 10)) {
    //         return false;
    //     }
    //     return true;
    // };

    // const invalidTime = (date, time) => {
    //     const resDate = new Date(date);
    //     const today = new Date();
    //     //if reservation_date is today
    //     if (resDate.toISOString().substring(0, 10) === today.toISOString().substring(0, 10)) {
    //         //time must be later than the current time of day and earlier than 9:30pm
    //         let currentHour = today.getHours();
    //         let currentMinutes = today.getMinutes();
    //         const resTime = time.split(':');
    //         if (resTime[0] > currentHour && time < "21:30") {
    //             return false;
    //         }
    //         else if ((resTime[0] === currentHour && resTime[1] > currentMinutes) && time < "21:30") {
    //             return false;
    //         }
    //         return true;
    //     } 
    //     //otherwise time must be between 10:30am and 9:30pm
    //     else {
    //         if (time < "10:30" || time > "21:30") {
    //             return true;
    //         }
    //         return false;
    //     } 
    // };

    return (
        <Fragment>
            <h2>Create New Reservation</h2>
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
                {isTuesday(formData.reservation_date) ? <p className="alert alert-danger">We are closed on Tuesdays</p> : null}
                {/* {dateInPast(formData.reservation_date) ? <p className="alert alert-danger">Date cannot be in the past</p> : null} */}
                <input 
                    name="reservation_date"
                    type="date" 
                    className="form-control"
                    value={formData.reservation_date}
                    onChange={handleChange}
                    required
                />

                <label>Time:</label>
                {/* {invalidTime(formData.reservation_date, formData.reservation_time) ? <p className="alert alert-danger">We accept reservations from 10:30am to 9:30pm</p> : null} */}
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