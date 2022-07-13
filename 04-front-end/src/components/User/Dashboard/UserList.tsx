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
        const [ editNamePartsVisible, setEditNamePartsVisible ] = useState<boolean>(false);

        const [ newPassword, setNewPassword ] = useState<string>("");
        const [ newForename, setNewForename ] = useState<string>(props.user.forename);
        const [ newSurname, setNewSurname ] = useState<string>(props.user.surname);
        
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
        
        function doEditNameParts() {
            api("put", "/api/user/" + props.user.userId, "user", {
                forename: newForename,
                surname: newSurname,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadUsers();
            });
        }

        return(
            <tr>
                <td>{ props.user.userId }</td>
                <td>{ props.user.username}</td>
                <td>{ props.user.email}</td>
                <td>
                    { !editNamePartsVisible &&
                        <div>
                            <span>{ props.user.forename + " " + props.user.surname }</span> &nbsp;&nbsp;
                            <button className="btn btn-primary btn-sm" onClick={ () => setEditNamePartsVisible(true) }>
                               Edit
                            </button>
                        </div>
                    }
                    { editNamePartsVisible && 
                        <div>
                            <div className="form-group mb-3">
                                <input type="text" className="form-control form-control-sm" value={ newForename } onChange={ e => setNewForename(e.target.value) } />
                            </div>

                            <div className="form-group mb-3">
                                <input type="text" className="form-control form-control-sm" value={ newSurname } onChange={ e => setNewSurname(e.target.value) } />
                            </div>

                            { (newForename !== props.user.forename || newSurname !== props.user.surname) &&
                            ( <button className="btn btn-sm btn-primary" onClick={ () => doEditNameParts() }>
                                Edit
                            </button> ) }

                            <button className="btn btn-sm btn-danger" onClick={ () => {
                                setNewForename(props.user.forename);
                                setNewSurname(props.user.surname);
                                setEditNamePartsVisible(false);
                            } }>
                                Cancel
                            </button>
                        </div> 
                    }
                </td>
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
                        <th>Email</th>
                        <th>Forename and surname</th>
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