import { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import IUser from '../../../models/IUser.model';
import { api } from '../../../api/api';
import IAd from '../../../models/IAd.model';

export interface IAdAddParams extends Record<string, string | undefined> {
    uid: string
}

interface IAddAdFormState{
        title: string;
        description: string;
        expiresAt: string;
        price: number;
        flowerKind: string;
        color: string;
        country: string;
        lifeSpan: string;
};

type TSetTitle = { type: "addAdForm/setTitle", value: string };
type TSetDescription = { type: "addAdForm/setDescription", value: string };
type TSetPrice = { type: "addAdForm/setPrice", value: number };
type TSetFlowerKind = { type: "addAdForm/setFlowerKind", value: string };
type TSetColor = { type: "addAdForm/setColor", value: string };
type TSetCountry = { type: "addAdForm/setCountry", value: string };
type TSetLifeSpan = { type: "addAdForm/setLifeSpan", value: string };

type AddAdFormAction = TSetTitle | TSetDescription | TSetPrice | TSetFlowerKind | TSetColor | TSetCountry | TSetLifeSpan;

function AddAdFormReducer(oldState: IAddAdFormState , action: AddAdFormAction ): IAddAdFormState  {
    switch (action.type) {
        case "addAdForm/setTitle": {
            return {
                ...oldState,
                // This changes:
                title: action.value,
            }
        }

        case "addAdForm/setDescription": {
            return {
                ...oldState,
                // This changes:
                description: action.value,
            }
        }

        case "addAdForm/setPrice": {
            return {
                ...oldState,
                // This changes:
                price: action.value,
            }
        }

        case "addAdForm/setFlowerKind": {
            return {
                ...oldState,
                // This changes:
                flowerKind: action.value,
            }
        }

        case "addAdForm/setColor": {
            return {
                ...oldState,
                // This changes:
                color: action.value,
            }
        }

        case "addAdForm/setCountry": {
            return {
                ...oldState,
                // This changes:
                country: action.value,
            }
        }

        case "addAdForm/setLifeSpan": {
            return {
                ...oldState,
                // This changes:
                lifeSpan: action.value,
            }
        }

        default: return oldState;
    }
}        

export default function AddAd(){
    const params = useParams<IAdAddParams>();
    const userId = params.uid;
    const adId = params.aid;
    
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ user, setUser ] = useState<IUser>();
    const [ ad, setAd] = useState<IAd>();
    const [ file, setFile ] = useState<File>();

    const navigate = useNavigate();

    const [ formState, dispatchFormStateAction ] = useReducer(AddAdFormReducer, {
        title: "",
        description: "",
        expiresAt: "",
        price: 0,
        flowerKind: "",
        color: "",
        country: "",
        lifeSpan: "",
    });

    const loadUser = () => {
        api("get", "/api/user/" + userId, "user")
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not load this user!");
            }

            return res.data;
        })
        .then(category => {
            setUser(user);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    const doAddAd = () => {
        api("post", "/api/user/" + userId + "/ad", "user", formState)
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not add this ad!");
            }

            return res.data;
        })
        .then(ad => {
            if (!ad?.adId) {
                throw new Error("Could not fetch new ad data!");
            }

            return ad;
        })
        .then(ad => {
            if (!file) {
                throw new Error("No ad photo selected!");
            }

            return {
                file,
                ad
            };
        })
        .then(({ file, ad }) => {
            const data = new FormData();
            data.append("image", file);
            return apiForm("post", "/api/user/" + userId + "/item/" + ad?.adId + "/photo", "user", data)
        })
        .then(res => {
            if (res.status !== "ok") {
                throw new Error("Could not upload ad photo!");
            }

            return res.data;
        })
        .then(() => {
            navigate("/dashboard/user/" + userId + "/ads/list", {
                replace: true,
            });
        })
        .catch(error => {
            setErrorMessage(error?.message ?? "Unknown error!");
        });
    };

    useEffect(loadUser, [ ]);

    return(
        <div>
            <div className="card">
                <div className="card-body">
                    <div className="card-title">
                        <h1 className="h5">Add new ad</h1>
                    </div>
                    <div className="card-text">
                        { errorMessage && <div className="alert alert-danger mb-3">{ errorMessage }</div> }

                        <div className="form-group mb-3">
                            <label>Title</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                value={ formState.title }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setTitle", value: e.target.value }) }
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Description</label>
                            <div className="input-group">
                                <textarea className="form-control form-control-sm" rows={ 5 }
                                value={ formState.description }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setDescription", value: e.target.value }) }
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Flower kind</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                value={ formState.flowerKind }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setFlowerKind", value: e.target.value }) }
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Country</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                value={ formState.country }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setCountry", value: e.target.value }) }
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Life span</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                value={ formState.lifeSpan }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setLifeSpan", value: e.target.value }) }/>
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label>Color</label>
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm"
                                value={ formState.color }
                                onChange={ e => dispatchFormStateAction({ type: "addAdForm/setColor", value: e.target.value }) }/>
                            </div>
                        </div>

                        <div className="from-froup mb-3">
                            <label>Image</label>
                            <div className="input-group">
                                <input type="file" accept=".jpg,.png" className="from-control form-control-sm"
                                onChange={ e => {
                                    if (e.target.files) {
                                        setFile(e.target.files[0])
                                    }
                                 } }
                                /> 
                            </div>
                        </div>

                        <div className="from-froup mb-3">
                            <button className='btn btn-primary' onClick={ () => doAddAd() }>
                                Add
                            </button>
                        </div>
                    </div>    
                </div>  
            </div>
        </div>
    );
}

function apiForm(arg0: string, arg1: string, arg2: string, data: FormData): any {
    throw new Error('Function not implemented.');
}
