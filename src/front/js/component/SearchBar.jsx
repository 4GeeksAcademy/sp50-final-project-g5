import React,  { useContext, useState, useEffect }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js"; //2. Import Context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import "../../styles/searchBar.css"
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { SearchResultsList } from "./SearchResultsList.jsx";
import { useNavigate } from 'react-router-dom'

export const SearchBar = () =>{
    const  {store, actions } = useContext (Context); //3. destructuring store & actions
    const [input, setInput] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [city, setCity] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const navigate = useNavigate();
    

    const handleMedicineChange = (value) => {
        setInput(value);
        actions.getMedicines(value);
        setSelectedItem("");   // Reset selected item
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            actions.getMedicines(input);
            setSelectedItem(""); 
        }
    };
   
    const handleMedicineSelect = (item) => {
        setInput(item.medicine_name);
        setSelectedItem(item);
        actions.getMedicines("");
        // For Results: we update the store with the selected medicine
        actions.getSelectedMedicine(item.medicine_name);
        // save selected medicine in session storage
        sessionStorage.setItem('selectedMedicine', JSON.stringify(item));
    };

    const clearSelectionMedicine = () => {
      setInput("");
      setSelectedItem("");
  };

    const handleCityChange = (value) => {
      setCity(value);
      actions.getSearchCities(value) //NEEDS TO BE MODIFIED!! Now only works with "Madrid" (TBC - API PLACES?)
      setSelectedCity(""); 
    };


    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        actions.getSearchCities(city) //NEEDS TO BE MODIFIED!! Now only works with "Madrid" (TBC - API PLACES?)
        setSelectedCity(""); 
      }
    };

  const handleCitySelect = (city) => {
    setCity(city.city_name); 
    setSelectedCity(city);   
    actions.getSelectedCity(city);
    // For Results: we update the store with the selected city
    actions.getSelectedCity(city.city_name);
    // save selected medicine in session storage
    sessionStorage.setItem('selectedCity', JSON.stringify(city));
    actions.clearCities(); 
  };


  const clearSelectionCity = () => {
    setCity("");
    setSelectedCity("");
  };

    const handleSearchResults = () => {
      const selectedMedicine = JSON.parse(sessionStorage.getItem('selectedMedicine'));
      const selectedCity = JSON.parse(sessionStorage.getItem('selectedCity'));
      
      if (selectedMedicine && selectedMedicine.id && selectedCity && selectedCity.id) {
      navigate(`/results/${selectedMedicine.id}/${selectedCity.city_name}`);
      } else {
      
      console.log("Debe seleccionar un medicamento y una ciudad.");
      }
    };
    
    //To clean up sessionStorage after navigating to Results page
    useEffect(() => { 
      return () => {
          sessionStorage.removeItem('selectedMedicine');
          sessionStorage.removeItem('selectedCity');
      };
    }, []);

    return(
            <div className="search-component">
            <Container className="search-form-container">
              <Row className="" >
                <Col className="" sm={12} md={5}>
                  <Form.Label htmlFor="medicamento" className="search-form-label">Medicamento</Form.Label>
                  <InputGroup className="mb-3 ">
                    <Form.Control onSubmit={(e)=> e.preventDefault()}
                      className="search-form-input"
                      placeholder="Busca tu medicamento"
                      aria-label="medicamento"
                      aria-describedby="medicamento"
                      value={input} onChange ={(e) =>handleMedicineChange(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}
                    />
                    {input && (
                      <button className="btn-clear-selection" onClick={clearSelectionMedicine}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </InputGroup>
                  <SearchResultsList 
                    items={store.medicines} 
                    displayItem="medicine_name" 
                    onItemClick={handleMedicineSelect} />
                </Col>
                <Col sm={12} md={1}>
                  <div className="vertical-line d-none d-md-block"></div>
                  <div className="horizontal-line d-block d-md-none"></div>
                </Col>
                <Col className="" sm={12} md={5}>
                  <Form.Label htmlFor="localizacion" className="search-form-label">¿Dónde?</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      className="search-form-input"
                      placeholder=" Dirección, Ciudad o Código Postal "
                      aria-label="localizacion"
                      aria-describedby="localizacion"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)} 
                      onKeyDown={handleKeyPress}/>
                      {city && (
                      <button className="btn-clear-selection" onClick={clearSelectionCity}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </InputGroup>
                  <SearchResultsList 
                    items={store.cities} 
                    displayItem="city_name" // CHANGE?? CHECK when implementing real API call (now in Flux getSearchCities I called it city_name)
                    onItemClick={handleCitySelect} />
                </Col>
                <Col sm={12} md={1}>
                <Button variant="outline-secondary" className="search-form-button" type="button" onClick={handleSearchResults}>
                <FontAwesomeIcon icon={faSearch} />
                </Button>
                </Col>
              </Row> 
            </Container>
            </div>
    );
};