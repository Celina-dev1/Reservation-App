//get the current reservation
//get all the tables that are free and have a capacity greater than or equal to the reservation people
//on submit update the selected table with the reservation id and go to the dashboard
import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatRes() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [reservation, setReservation] = useState([]);
    const [reservationError, setReservationError] = useState(null);

    const [tables, setTables] = useState([]);
    //filter the tables

    useEffect(load, [reservation_id]);

    function load() {
        const abortController = new AbortController();
        setReservationError(null);
        readReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setReservationError);
        listTables(abortController.signal)
        .then(setTables)
        .catch(setReservationError);
        return () => abortController.abort();
    }

    const handleSeatTable = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        // async function seat() {
        //     try {
        //         await updateTable({ data: { reservation_id: reservation.reservation_id } }, abortController.signal);
        //         history.push(`/dashboard`);
        //     } catch (error) {
        //         if (error.name === "AbortError") {
        //             console.log("Aborted");
        //           } else {
        //             throw error;
        //           }
        //     }
        // }
        // seat();
    }

    const handleChange = ({ target }) => {
       //set the table to be updated to the option selected
    };

    return (
        <Fragment>
            <h2>Seat Reservation</h2>
            {<ErrorAlert error={reservationError} />}
            {JSON.stringify(reservation)}
            <form className="form-group" onSubmit={handleSeatTable}>
                <select
                    name="table_id"
                    onChange={handleChange}
                    className="form-control form-control-lg"
                >
                    {tables.map((table) => (
                    <option value={table.table_id}>
                        Table: {table.table_name} - Max Capacity: {table.capacity}
                    </option>
                    ))}
                </select>
                
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

export default SeatRes;
