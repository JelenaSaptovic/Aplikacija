import { useState, useEffect } from 'react';
import { api } from '../../../api/api';
import IAd from '../../../models/IAd.model';


interface IAdListRowProperties {
    ad: IAd,
}

export default function UserAdList(){
    const [ ads, setAds ] = useState<IAd[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function AdListRow(props: IAdListRowProperties){
        return(
            <tr>
                <td>{ props.ad.adId }</td>
                <td>{ props.ad.title }</td>
                <td>{ props.ad.description }</td>
                <td>{ props.ad.expiresAt }</td>
                <td>{ props.ad.price}</td>
                <td>{ props.ad.flowerKind }</td>
                <td>{ props.ad.color }</td>
                <td>{ props.ad.country }</td>
                <td>...</td>
            </tr>
        );
    }
    
    useEffect(() => {
        api("get", "/api/ad", "user")
        .then(apiResponse => {
            if (apiResponse.status === 'ok'){
                return setAds(apiResponse.data);
            }

            throw { message: 'Unknown error while loading ads...' , }
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading ads..');
        });
    }, [ ]);

    return(
        <div>
            { errorMessage && <p>Error: { errorMessage }</p>}
            { !errorMessage && 
                <table className='table table-bordered table-hover table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Descrption</th>
                            <th>Expires at</th>
                            <th>Price</th>
                            <th>Flower kind</th>
                            <th>Color</th>
                            <th>Country</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        { ads.map(ad => <AdListRow ad={ ad } />) }
                    </tbody>
                </table>}
        </div>
    );

}
