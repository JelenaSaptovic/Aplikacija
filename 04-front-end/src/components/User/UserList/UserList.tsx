import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IUser from '../../../models/IUser.model';

export default function UserList() {

    const [ users, setUsers ] = useState<IUser[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:10000/api/user")
        .then(res => res.json())
        .then(data => {
            setUsers(data);
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