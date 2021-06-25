import React, {Fragment, useState} from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import NewTableForm from "./NewTableForm";

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
            <NewTableForm formData={formData} handleChange={handleChange} handleNewTable={handleNewTable} />
        </Fragment>
    )
}

export default NewTable;