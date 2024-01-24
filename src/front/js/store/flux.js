const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			pharmacies: []
			// demo: [
			// 	{
			// 		title: "FIRST",
			// 		background: "white",
			// 		initial: "white"
			// 	},
			// 	{
			// 		title: "SECOND",
			// 		background: "white",
			// 		initial: "white"
			// 	}
			// ]
		},
		actions: {
			exampleFunction: () => {
				getActions().changeColor(0, "green");  // Use getActions to call a function within a fuction
			},
			getMessage: async () => {
				try {
					// Fetching data from the backend
					const response = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await response.json()
					setStore({message: data.message})
					return data;  // Don't forget to return something, that is how the async resolves
				} catch(error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				// We have to loop the entire demo array to look for the respective index and change its color
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},

			getPharmacies: async (city) => {
				// 1. Definir la URL que está en el env. Parámetro city. 
				const url_maps = `${process.env.BACKEND_URL}/api/maps?city=${city}`;
				// 2. Options - únicamente GET del listado de Farmacias
				const options = {
					method: 'GET'
				};
				// 3. Response
				const response = await fetch(url_maps, options);
				// 4. Verificar response (console log)
				if (response.ok) {
					// 5. If = ok; Tratamiento del OK - definimos el data
					const data = await response.json();
					// Grabar los datos en el store y en local Storage
					setStore({ "pharmacies": data.results })
					localStorage.setItem('pharmacies', JSON.stringify(data.results))
					console.log(data),
						console.log(data.results) // para ver qué trae

				} else {
					console.log('Error:', "No encuentra Farmacias Cercanas")
				}
			},
		}
	};
};


export default getState;
