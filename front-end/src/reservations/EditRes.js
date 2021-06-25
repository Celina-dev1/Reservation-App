import React, {Fragment, useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import ListErrors from "../layout/ListErrors";
import { updateReservation, readReservation } from "../utils/api";

function EditRes() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "YYYY-MM-DD",
        reservation_time: "10:30",
        people: 1,
    };

    const [currentRes, setCurrentRes] = useState({...initialFormState});
    const [errors, setErrors] = useState([]);

    //get current reservation
    useEffect(() => {
        async function loadCurrentRes() {
            const response = await readReservation(reservation_id);
            setCurrentRes(response);
        }
        loadCurrentRes();
    }, [reservation_id]);


    const handleChange = ({ target }) => {
        if (target.name === "people") {
            setCurrentRes({
                ...currentRes,
                [target.name]: target.valueAsNumber,
            });
        } else {
            setCurrentRes({
                ...currentRes,
                [target.name]: target.value,
            });
        } 
    };

    const handleUpdateRes = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        
        if (isTuesday(currentRes.reservation_date)) {
            setErrors([...errors, "We are closed on Tuesdays"])
        }
        else if (dateInPast(currentRes.reservation_date)) {
            setErrors([...errors, "Reservation date cannot be in the past"])
        }
        else if (invalidTime(currentRes.reservation_date, currentRes.reservation_time)) {
            setErrors([...errors, "We accept reservations from 10:30am to 9:30pm"])
        } else {
            async function update() {
                try {
                    await updateReservation(currentRes, abortController.signal);
                    history.push(`/dashboard?date=${currentRes.reservation_date}`); // go to dashboard page of new reservation date
                } catch (error) {
                    if (error.name === "AbortError") {
                        console.log("Aborted");
                      } else {
                        throw error;
                      }
                }
            }
            update();
        } 
    }

    const isTuesday = (date) => {
        const resDate = new Date(date);

         if (resDate.getUTCDay() === 2) {
             return true;
         }
         return false;
    };

    const dateInPast = (date) => {
        const today = new Date();
        const resDate = new Date(date);

        if (resDate.toLocaleDateString() >= today.toLocaleDateString()) {
            return false;
        }
        return true;
    };

    const invalidTime = (date, time) => {
        const res = new Date(`${date} ${time}`);

        if (res.getHours() < 10 || (res.getHours() === 10 && res.getMinutes() < 30)) {
                return true;
        }
        else if (res.getHours() > 21 || (res.getHours() === 21 && res.getMinutes() > 30)) {
            return true;
        }
            return false;
    }

    return (
        <Fragment>
            <h2>Create New Reservation</h2>
            <ListErrors errors={errors} />
            <form className="form-group" onSubmit={handleUpdateRes}>
                <label>First Name:</label>
                <input 
                    name="first_name"
                    type="text" 
                    className="form-control"
                    value={currentRes.first_name}
                    onChange={handleChange}
                    required
                />
                
                <label>Last Name:</label>
                <input 
                    name="last_name"
                    type="text" 
                    className="form-control"
                    value={currentRes.last_name}
                    onChange={handleChange}
                    required
                />

                <label>Mobile Number:</label>
                <input 
                    name="mobile_number"
                    type="text" 
                    className="form-control"
                    value={currentRes.mobile_number}
                    onChange={handleChange}
                    required
                />  

                <label>Date:</label>
                <input 
                    name="reservation_date"
                    type="date" 
                    className="form-control"
                    value={currentRes.reservation_date}
                    onChange={handleChange}
                    required
                />

                <label>Time:</label>
                <input 
                    name="reservation_time"
                    type="time" 
                    className="form-control"
                    value={currentRes.reservation_time}
                    onChange={handleChange}
                    required
                />

                <label>Number of guests:</label>
                <input 
                    name="people"
                    type="number"
                    min="1" 
                    className="form-control"
                    value={currentRes.people}
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

export default EditRes;