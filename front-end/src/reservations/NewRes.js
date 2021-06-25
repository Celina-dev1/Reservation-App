import React, {Fragment, useState} from "react";
import { useHistory } from "react-router-dom";
import ListErrors from "../layout/ListErrors";
import { createReservation } from "../utils/api";
import ResForm from "./ResForm";


function NewRes() {
    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "YYYY-MM-DD",
        reservation_time: "10:30",
        people: 1,
    };
    
    const [formData, setFormData] = useState({ ...initialFormState });
    const [errors, setErrors] = useState([]);

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
        
        if (isTuesday(formData.reservation_date)) {
            setErrors([...errors, "We are closed on Tuesdays"])
        }
        else if (dateInPast(formData.reservation_date)) {
            setErrors([...errors, "Reservation date cannot be in the past"])
        }
        else if (invalidTime(formData.reservation_date, formData.reservation_time)) {
            setErrors([...errors, "We accept reservations from 10:30am to 9:30pm"])
        } else {
            async function create() {
                try {
                    await createReservation(formData, abortController.signal);
                    history.push(`/dashboard?date=${formData.reservation_date}`); // go to dashboard page of new reservation date
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
            <ResForm formData={formData} handleChange={handleChange} handleNewRes={handleNewRes} />
        </Fragment>
    )
}

export default NewRes;