import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { memo } from 'react';
import logo from '../../resources/logo.png'

export default memo(
	function LoginPage() {
		const navigate = useNavigate();
		return (
			<div id='login-page'>
				<h1 className='aria-only'>Login</h1>
				<img src={logo} alt="zepping logo" className='zepping-logo' />
				<LoginForm onLogin={() => navigate('/')} />
			</div>
		);
	})
