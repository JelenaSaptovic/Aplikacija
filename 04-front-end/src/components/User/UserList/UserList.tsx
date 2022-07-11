import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IUser from '../../../models/IUser.model';
import { api } from '../../../api/api';

export default function UserList() {

    const [ users, setUsers ] = useState<IUser[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        api("get", "/api/user", "user")
        .then(apiResponse => {
            if (apiResponse.status === 'ok'){
                return setUsers(apiResponse.data);
            }

            throw {
                message: 'Unknown error while loading useres...',
            }
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading useres...');
        });
    }, [ ]);

    return (
        <div>
            { errorMessage && <p>Error: { errorMessage }</p> }
            { !errorMessage && 
                <ul>
                    { users.map(user =>
                        <li key={ "user-" + user.userId }>
                            <Link to={ "/user/" + user.userId }>{ user.username }</Link>   
                        </li>
                    ) }    
                </ul>
            }                   
        </div>  
    );
}