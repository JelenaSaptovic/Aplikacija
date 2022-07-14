import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IAd from '../../../models/IAd.model';
import { api } from '../../../api/api';

export default function AdList() {

    const [ ads, setAds ] = useState<IAd[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const loadAds = () => {
        api("get", "/api/ad/", "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load ads!");
            }

            return res.data;
        })
        .then(ads => {
            setAds(ads);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };
    useEffect(loadAds, [ ]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="card-title">
                    <h1 className="h5">List of ads</h1>
                </div>
                <div className="card-text">
                    { errorMessage && <div className="alern alert-danger">{ errorMessage }</div> }

                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Expires at</th>
                                <th>Price</th>
                                <th>Flower kind</th>
                                <th>Color</th>
                                <th>Country</th>
                                <th>Life span</th>
                            </tr>
                        </thead>
                        <tbody>
                            { ads.length === 0 && <tr><td colSpan={7}>No ads</td></tr> }

                            { ads.map(ad => (
                                <tr key={ "ad-" + ad.adId }>
                                    <td>
                                        {
                                            ad.photos.length > 0
                                            ? <img alt={ ad.title }
                                                   src={ "http://localhost:10000/assets/" + ad.photos[0].filePath }
                                                   style={ { width: "150px" } } />
                                            : <p>No image</p>
                                        }
                                    </td>
                                    <td>{ ad.adId }</td>
                                    <td>{ ad.title }</td>
                                    <td>{ ad.description}</td>
                                    <td>{ ad.expiresAt}</td>   
                                    <td>{ ad.price}</td>
                                    <td>{ ad.flowerKind}</td>    
                                    <td>{ ad.color}</td>
                                    <td>{ ad.country}</td>
                                    <td>{ ad.lifeSpan}</td>
                                    
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}