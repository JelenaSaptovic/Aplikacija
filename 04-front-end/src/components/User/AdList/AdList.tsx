import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IAd from '../../../models/IAd.model';
import { api } from '../../../api/api';

export default function AdList() {

    const [ ads, setAds ] = useState<IAd[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        api("get", "/api/ad", "user")
        .then(apiResponse => {
            if (apiResponse.status === 'ok'){
                return setAds(apiResponse.data);
            }

            throw {
                message: 'Unknown error while loading ads...',
            }
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading ads...');
        });
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage && 
                <ul>
                    { ads.map(ad =>
                        <li key={ "ad-" + ad.adId }>
                            <Link to={ "/ad/" + ad.adId }>{ ad.title }</Link>   
                        </li>
                    ) }    
                </ul>
            }                   
        </div>  
    );
}