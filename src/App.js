
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage'
import HomePage from './pages/HomePage/HomePage'
import LoaderSpinner from './components/LoaderSpinner/LoaderSpinner'

import { LoaderProvider, useLoader } from "./services/LoaderProvider"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
	return (
		<LoaderProvider>
			<div id="pages">
				<Router>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</Router>
			</div >
			<LoaderSpinner loadingHook={useLoader}></LoaderSpinner>
		</LoaderProvider>
	)
}


