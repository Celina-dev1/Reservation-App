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
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };

    const [reservation, setReservation] = useState({...initialFormState});
    const [errors, setErrors] = useState(null);

    //get current reservation
    useEffect(() => {
        setErrors(null);
        readReservation(reservation_id)
          .then(setReservation)
          .catch(setErrors);
      }, [reservation_id]);


    function handleChange({ target: { name, value } }) {
        if (name === "people") {
            setReservation((prevState) => ({
                ...prevState,
                [name]: Number(value),
              }));
        }
        setReservation((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };

    function validate(reservation){
        const errors = []
        function isFutureDate({ reservation_date, reservation_time }) {
          const dt = new Date(`${reservation_date}T${reservation_time}`);
          if (dt < new Date()) {
              errors.push(new Error("Reservation must be set in the future"));
          }
        }
        function isTuesday({ reservation_date }) {
          const day = new Date(reservation_date).getUTCDay();
          if (day === 2) {
            errors.push(new Error("No reservations available on Tuesday."));
          }
        }
        function isOpenHours({ reservation_time }){
          const hour = parseInt(reservation_time.split(":")[0]);
          const mins = parseInt(reservation_time.split(":")[1]);
          if (hour <= 10 && mins <= 30){
              errors.push(new Error("Restaurant is only open after 10:30 am"));
          }
          if (hour >= 22){
              errors.push(new Error("Restaurant is closed after 10:00 pm"));
          }
        }
        isFutureDate(reservation);
        isTuesday(reservation);
        isOpenHours(reservation);
        return errors;
    };

    const handleUpdateRes = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const resErrors = validate(reservation);

        if (resErrors.length) {
            return setErrors(resErrors);
        }
        async function update() {
            try {
                await updateReservation(reservation, abortController.signal);
                history.push(`/dashboard?date=${reservation.reservation_date}`);
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


    return (
        <Fragment>
            <h2>Edit Reservation</h2>
            {errors !== null && <ListErrors errors={errors} />}
            <form className="form-group" onSubmit={handleUpdateRes}>
                <label>First Name:</label>
                <input 
                    name="first_name"
                    type="text" 
                    className="form-control"
                    value={reservation.first_name}
                    onChange={handleChange}
                    required
                />
                
                <label>Last Name:</label>
                <input 
                    name="last_name"
                    type="text" 
                    className="form-control"
                    value={reservation.last_name}
                    onChange={handleChange}
                    required
                />

                <label>Mobile Number:</label>
                <input 
                    name="mobile_number"
                    type="tel" 
                    className="form-control"
                    value={reservation.mobile_number}
                    onChange={handleChange}
                    required
                />  

                <label>Date:</label>
                <input 
                    name="reservation_date"
                    type="date" 
                    className="form-control"
                    value={reservation.reservation_date}
                    onChange={handleChange}
                    required
                />

                <label>Time:</label>
                <input 
                    name="reservation_time"
                    type="time" 
                    className="form-control"
                    value={reservation.reservation_time}
                    onChange={handleChange}
                    required
                />

                <label>Number of guests:</label>
                <input 
                    name="people"
                    type="number"
                    min={1}
                    className="form-control"
                    value={reservation.people}
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