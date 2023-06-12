import './HomePage.css';

import { useNavigate } from 'react-router-dom';
import { Auth } from '../../services/apiCalls';
import { useLoading } from '../../services/LoaderProvider';
import { memo, useEffect, useState } from 'react';
import SettingsMenu from '../../components/SettingsMenu/SettingsMenu';

export default memo(function HomePage() {
    const
        navigate = useNavigate(),
        waitLoading = useLoading(),
        [userdata, setUserData] = useState('');

    useEffect(() => {
        var isMounted = true;
        waitLoading(
            Auth.getUserData()
                .then((res) => { if (isMounted) { setUserData(res) } })
                .catch(e => { if (isMounted) { navigate('/Login') } })
        );

        return () => isMounted = false;
    }, [navigate, waitLoading]);

    return (
        <div className='home-page'>
            {userdata && <SettingsMenu userData={userdata} />}
        </div>
    );
})
