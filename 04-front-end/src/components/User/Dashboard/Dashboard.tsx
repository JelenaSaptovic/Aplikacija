import { Link } from "react-router-dom";

export default function Dashboard(){
    return (
        <div className="row"> 
            <div className="col-12 col-lg-4 col-md-6 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Ads</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/dashboard/ad/list">List all ads</Link>
                            <Link className="btn btn-primary" to="/dashboard/ad/add">Add a new ad</Link>
                        </div>
                    </div>    
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Users</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/dashboard/user/list">List all users</Link>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    );
}