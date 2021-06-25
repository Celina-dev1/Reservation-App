import React from "react";
import { useHistory } from "react-router"

function NewTableForm({ formData, handleChange, handleNewTable }) {
    const history = useHistory();

    return (
        <div>
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
        </div>
    )
}

export default NewTableForm;