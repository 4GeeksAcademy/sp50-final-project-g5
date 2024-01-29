import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Imports pages or views
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import { Single } from "./pages/Single.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { Results } from "./pages/Results.jsx";
import { PharmacyDashboard } from "./pages/PharmacyDashboard.jsx"; // Main pharmacy area component
// Import components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { PharmacyProfile } from "./component/PharmacyProfile.jsx";
import { Availability } from "./component/Availability.jsx";
import { Reservations } from "./component/Reservations.jsx";
import { Maps } from "./component/Maps.jsx"


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // You can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                    <Route element={<LandingPage />} path="/landing" />
                        <Route element={<Home />} path="/" />
                        <Route element={<Results />} path="/results" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Maps />} path="/maps" />
                         {/* React Router Outlet: 1.Define the parent route for the pharmacy area */}
                         <Route path="/pharmacy" element={<PharmacyDashboard />}> 
                             {/* 2.Define the nested routes for the different sections within the pharmacy area */}
                            <Route index element={<Availability />} /> {/* 3. Set the default section to render with index route: Navigating to /pharmacy will by default render Availability component */}
                            <Route path="availability" element={<Availability />} />
                            <Route path="reservations" element={<Reservations />} />
                            <Route path="profile" element={<PharmacyProfile />} />
                        </Route>
                        <Route element={<h1>Not found!</h1>} path="*"/>
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};


export default injectContext(Layout);