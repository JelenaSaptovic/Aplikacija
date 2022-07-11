import { useState, useEffect } from 'react';
import IUser from '../../../models/IUser.model';
import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';

export interface IAdPageUrlParams extends Record<string, string | undefined>{
    id: string
}

export default function UserPage() {
    const [ user, setUser ] = useState<IUser|null>(null);
   // const [ ads, setAds ] = useState<IAd[]>([]);
    const [ errorMesage, setErrorMesage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    
    const params = useParams<IAdPageUrlParams>();

    useEffect(() => {
        setLoading(true);

        api("get", "/api/user/" + params.id, "user")
        .then(res => {
            if(res.status === 'error'){  
                throw {
                    message: 'Could not get user data!'
                }
            }
            setUser(res.data);
        })
        .catch(error => {
            setErrorMesage(error?.message ?? 'Unknown error while loading this user!');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return(
        <div>
            { loading && <p>Loading//</p> }
            { errorMesage && <p>Error: { errorMesage }</p> }

            { user && (
                <div>
                    <h1>{ user?.email }</h1>
                    <h1>{ user?.surname }</h1>
                    <h1>{ user?.forename }</h1>
                    <h1>{ user?.username }</h1>
                </div>    
            ) }
        </div>
    );
}