import React, {Fragment, useState} from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function NewTable() {
    const history = useHistory();

    const initialFormState = {
        table_name: "",
        capacity: 1,
    };

    const [formData, setFormData] = useState({ ...initialFormState });

    const handleChange = ({ target }) => {
        if (target.name === "capacity") {
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


    const handleNewTable = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        console.log(formData)
        async function create() {
            try {
                await createTable(formData, abortController.signal);
                history.push(`/dashboard`);
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
            <h2>Create New Table</h2>
            <form className="form-group" onSubmit={handleNewTable}>
                <label>Table Name:</label>
                <input 
                    name="table_name"
                    type="text" 
                    className="form-control"
                    value={formData.table_name}
                    onChange={handleChange}
                    required
                />
               
                <label>Table Capacity:</label>
                <input 
                    name="capacity"
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.capacity}
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

export default NewTable;