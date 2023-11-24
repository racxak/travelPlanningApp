// import logo from "./logo.svg";
//import "./App.css";
import React, { useContext} from "react";
import { createBrowserRouter, RouterProvider,Navigate } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import LoginPage from "./pages/LoginPage";
import AllTravelsPage from "./pages/AllTravelsPage";
import TravelersJournal from "./pages/TravelersJournal";
import { AuthContext } from "./context/AuthContext";
import { travelInputs } from "./components/journalSource";
import { journalNotesInputs } from "./components/journalSource";

import { journalInputs } from "./components/journalSource";
import TravelPage from "./pages/TravelPage";


function App() { 
const {currentUser} = useContext (AuthContext)

const RequireAuth = ({ children }) => {
	return (currentUser ? children : <Navigate to="/logowanie"></Navigate>);
};

//ścieżki z a href - ładyjemy ponownie całą stronę :(
	const router = createBrowserRouter([
		{ path: "/", element: <HomePage /> },
		{ path: "/o-nas", element: <AboutUsPage /> },
		{ path: "/logowanie", element: <LoginPage /> },
		{
			path: "/twoje-podroze",
			element: (
				<RequireAuth>
			     <AllTravelsPage inputs={journalInputs} title="Add new"/>
				</RequireAuth>
			),
		},
		{
			path: "/dziennik",
			element: (
				<RequireAuth>
						<TravelersJournal inputs={journalNotesInputs} title="Add new" />
				</RequireAuth>
			),
		},
		{
			path: "/twoje-podroze/:travelId",
			element: (
				<RequireAuth>
						<TravelPage/>
				</RequireAuth>
			),
		},
	
	]);
	
	return (
		<div className="App">
			<RouterProvider router={router}></RouterProvider>
		</div>
	);
}

export default App;
