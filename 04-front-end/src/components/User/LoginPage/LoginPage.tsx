import { useState } from "react";

export default function LoginPage(){

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const doLogin = () => {
        console.log("Attempting to log in: ", email, password);
    };


    return (
        <form className="col col-xs-12 col-md-6 offset-md-3">
          <h3 className="mb-3">Log into your account</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={ email }
                onChange={ e => setEmail(e.target.value) }
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={ password }
                onChange={ e => setPassword(e.target.value) }
            />
          </div>
          
          <div className="form-group">
            <button className="btn btn-primary px-5" onClick={ () => doLogin() }>
              Log in
            </button>
          </div>
          
        </form>
      )
}