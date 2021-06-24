//get the current reservation
//get all the tables that are free and have a capacity greater than or equal to the reservation people
//on submit update the selected table with the reservation id and go to the dashboard
import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, seatTable, updateResStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListErrors from "./ListErrors";

function SeatRes() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [reservation, setReservation] = useState([]);
    const [reservationError, setReservationError] = useState(null);

    const [tables, setTables] = useState([]);
    const [tableToUpdate, setTableToUpdate] = useState({});
    const [errors, setErrors] = useState([]);

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
        if (!sufficientCapacity()) {
            setErrors([...errors, "Table selected cannot fit the current reservation"])
        }else {
            async function seat() {
                try {
                    
                    await seatTable(tableToUpdate.table_id, reservation_id, abortController.signal);
                    //update the reservation to have a status of 'seated'
                    await updateResStatus(reservation_id, {data: { status: "seated" } }, abortController.signal);
                    history.push(`/dashboard?date=${reservation.reservation_date}`);
                } catch (error) {
                    if (error.name === "AbortError") {
                        console.log("Aborted");
                      } else {
                        throw error;
                      }
                }
            }
            seat();
            return () => {
                abortController.abort();
              };
        }
        
    }

    const handleChange = ({ target }) => {
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
    const filteredTables = tables.filter((table) => table.reservation_id === null);

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
                    {filteredTables.map((table) => (
                    <option key={table.table_id} value={table.table_id}>
                        {table.table_name} - {table.capacity}
                    </option>
                    ))}
                </select>
                <ListErrors errors={errors} />
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
