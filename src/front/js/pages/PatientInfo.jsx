import React, { useContext, useState, useEffect } from "react"
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";



export const PatientInfo = () => {
    
    const { store, actions } = useContext(Context);
    const [patient, setPatient] = useState(null);

    console.log("Que raro");

    useEffect(() => {

        console.log("Hola antes del getPatientInfo");
        const getPatientInfo = async () => {

            const patientId = localStorage.getItem("user_id")   //  Lo malo es que el id de este usuario será vulnerable...
            const url = process.env.BACKEND_URL + `/api/getPatientById/${patientId}`;

            try{
                console.log("La url -> ",url);
                const response = await fetch(url);
                console.log("Pasado el response");
                
                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPatient(data);
                }else{
                    console.error("Error fetching the patient");
                }
            }catch (error){
                console.error("Error fetching the patient info -> ",error);
            } 
            


        }

        getPatientInfo();

    }, []);



    return (

        // !store.isLoggedIn ? <Navigate to="/login" /> :

        <div>

            <h2>Patient information</h2>
            <button className="btn btn-warning mb-3">Edit info</button>
            {patient !== null ? (
                <div>
                    <p><b>PatientID</b>: {patient.id}</p>
                    <p><b>Name</b>: {patient.name}</p>
                    <p><b>Email</b>: {patient.email}</p>
                </div>
            ) : (
                <p>Loading your info</p>
            )}


        </div>

    )


}