//get the current reservation
//get all the tables that are free and have a capacity greater than or equal to the reservation people
//on submit update the selected table with the reservation id and go to the dashboard
import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatRes() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [reservation, setReservation] = useState([]);
    const [reservationError, setReservationError] = useState(null);

    const [tables, setTables] = useState([]);
    const [tableToUpdate, setTableToUpdate] = useState({});

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
        async function seat() {
            try {
                await seatTable(tableToUpdate.table_id, reservation.reservation_id, abortController.signal);
                history.push(`/dashboard`);
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Aborted");
                  } else {
                    throw error;
                  }
            }
        }
        seat();
    }

    const handleChange = ({ target }) => {
       //set the table to be updated to the option selected
       const currentTable = tables.find((table) => table.table_id === Number(target.value));
       console.log(currentTable);
       setTableToUpdate(currentTable);
    };

    const sufficientCapacity = () => {
        if (tableToUpdate.capacity >= reservation.people) {
            return true;
        }
        return false;
    }
    //filter the tables to only map and display the tables that are free

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
                    <option key={table.table_id} value={table.table_id}>
                        {table.table_name} - {table.capacity}
                    </option>
                    ))}
                </select>
                {!sufficientCapacity() ? <p className="alert alert-danger">Table selected cannot fit the current reservation</p> : null}
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
