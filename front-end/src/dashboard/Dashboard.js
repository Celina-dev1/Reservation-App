import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables, finishTable, updateResStatus } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const query = useQuery();
  const queryDate = query.get("date")
  if (queryDate) {
    date = queryDate;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleFinish = (table) => {
    const abortController = new AbortController();
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      async function finish() {
        try { 
            await finishTable(table.table_id, abortController.signal);
            //update reservation status to 'finished'
            await updateResStatus(table.reservation_id, {data: { status: "finished" }}, abortController.signal);
            //reload the dashboard
            await loadDashboard();
            //history.push("/");
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Aborted");
              } else {
                throw error;
              }
        }
      }
      finish();
      return () => {
        abortController.abort();
      };
    }
  };

  const handleCancelRes = (reservation_id) => {
    const abortController = new AbortController();
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      async function cancel() {
        try { 
            await updateResStatus(reservation_id, {data: { status: "cancelled" }}, abortController.signal);
            //reload the dashboard
            await loadDashboard();
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Aborted");
              } else {
                throw error;
              }
        }
      }
      cancel();
      return () => {
        abortController.abort();
      };
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <button onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
        <button onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
        <button onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ListReservations reservations={reservations} handleCancelRes={handleCancelRes} />
      <ListTables tables={tables} handleFinish={handleFinish} />
    </main>
  );
}

export default Dashboard;
