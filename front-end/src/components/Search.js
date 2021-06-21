import React, {Fragment, useState} from "react";
import { searchByPhone } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

function Search() {

    const [reservations, setReservations] = useState([]);
    const [phone, setPhone] = useState("");
    const [notFound, setNotFound] = useState(false);

    const handleChange = ({ target }) => {
        setPhone(target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        async function search() {
            try {
                const data = await searchByPhone(phone, abortController.signal);
                setReservations(data);
                if (data.length === 0) {
                    setNotFound(true);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log("Aborted");
                  } else {
                    throw error;
                  }
            }
        }
        search();
    }

    return (
        <Fragment>
            <h2>Create New Table</h2>
            <form className="form-group" onSubmit={handleSearch}>
                <label>Table Name:</label>
                <input 
                    name="mobile_number"
                    type="text" 
                    className="form-control"
                    placeholder="Enter a customer's phone number"
                    value={phone}
                    onChange={handleChange}
                    required
                />
                
                <button 
                className="btn btn-primary my-2" 
                type="submit">
                    Find
                </button>
            </form>
            <div>
                <h3>Search Results</h3>
                {notFound && <p>No reservations found</p>}
                <table className="table table-striped table-dark">
                    <thead>
                    <tr>
                        <th scope="col">Reservation Time</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Number of Guests</th>
                        <th scope="col">Reservation Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservation_id}>
                        <td>{formatAsTime(reservation.reservation_time)}</td>
                        <td>{reservation.first_name}</td>
                        <td>{reservation.last_name}</td>
                        <td>{reservation.mobile_number}</td>
                        <td>{reservation.people}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default Search;