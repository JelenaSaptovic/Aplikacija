import { useEffect, useState } from 'react';
import IUser from '../../../models/IUser.model';
import { api } from '../../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';

interface IUserRowProps {
    user: IUser;
}

export default function UserList() {

    const [ users, setUsers ] = useState<IUser[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function loadUsers() {
        api("get", "/api/user", "user")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setUsers(res.data);
        });
    }   

    useEffect(loadUsers, [ ]);
    
    function UserRow(props: IUserRowProps) {
        const [ editPasswordVisible, setEditPasswordVisible ] = useState<boolean>(false);
        const [ newPassword, setNewPassword ] = useState<string>("");
        
        const activeSide   = props.user.isActive  ? " btn-primary" : " btn-light";
        const inactiveSide = !props.user.isActive ? " btn-primary" : " btn-light";

        function doToggleUserActiveState() {
            api("put", "/api/user/" + props.user.userId, "user", { 
                isActive: !props.user.isActive,
            })
            .then(res => {
                if (res.status === 'error'){
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });    
        }

        function doChangePassword() {
            api("put", "/api/user/" + props.user.userId, "user", {
                password: newPassword,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });
        }

        function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
            setNewPassword(e.target.value);
        }
        
        return(
            <tr>
                <td>{ props.user.userId }</td>
                <td>{ props.user.username}</td>
                <td>{ props.user.forename }</td>
                <td>{ props.user.surname }</td>
                <td>{ props.user.email}</td>
                <td>
                    <div className="btn-group" onClick={() => { doToggleUserActiveState() }}>
                        <div className={"btn btn-sm" + activeSide}>
                            <FontAwesomeIcon icon={ faSquareCheck } />
                        </div>
                        <div className={"btn btn-sm" + inactiveSide}>
                            <FontAwesomeIcon icon={ faSquare } />
                        </div>
                    </div>
                </td>
                <td>
                    { !editPasswordVisible && <button className="btn btn-primary btn-sm" onClick={() => { setEditPasswordVisible(true); }}>Change password</button> }
                    { editPasswordVisible && 
                        <div className="input-group">
                            <input type="password" className="form-control form-control-sm" value={ newPassword } onChange={ e => changePassword(e) } />
                            <button className="btn btn-success btn-sm" onClick={() => doChangePassword()}>Save</button>
                            <button className="btn btn-danger btn-sm" onClick={() => { setEditPasswordVisible(false); setNewPassword(""); }}>Cancel</button>
                        </div> 
                    }
                </td>
            </tr>
        );
    }

    return (
        <div>
            { errorMessage && <p className='alert aler-danger'>{ errorMessage }</p> }
            { !errorMessage && 
                <table className='table table-bordered table-hover table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Forename</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Opions</th>
                    </tr>
                </thead>
                <tbody>
                    { users.map(user => <UserRow key={"user" + user.userId} user={ user } />) }    
                </tbody>
            </table>}        
        </div>  
    );
}