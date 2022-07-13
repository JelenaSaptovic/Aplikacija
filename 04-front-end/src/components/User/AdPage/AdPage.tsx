import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../api/api';
import IAd from '../../../models/IAd.model';

export interface IAdPageUrlParams extends Record<string, string | undefined>{
    id: string
}

export default function AdPage() {
    const [ ad, setAd ] = useState<IAd|null>(null);
    const [ errorMesage, setErrorMesage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    
   const param = useParams<IAdPageUrlParams>();

    useEffect(() => {
        setLoading(true);

        api("get", "/api/ad/" + param.id, "user")
        .then(res => {
            if(res.status === 'error'){  
                throw {
                    message: 'Could not get ad data!'
                }
            }
            setAd(res.data);
        })
        .catch(error => {
            setErrorMesage(error?.message ?? 'Unknown error while loading this ad!');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return(
        <div>
            { loading && <p>Loading//</p> }
            { errorMesage && <p>Error: { errorMesage }</p> }

            { ad && (
                <div>
                    <h1>{ ad?.title }</h1>
                    <h1>{ ad?.description }</h1>
                    <h1>{ ad?.expiresAt }</h1>
                    <h1>{ ad?.flowerKind }</h1>
                    <h1>{ ad?.color }</h1>
                    <h1>{ ad?.country}</h1>
                </div>    
            ) }
        </div>
    );
}