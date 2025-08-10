import { Link} from "react-router-dom";
import LinktoPgBtn from "../../../Components/Dashboard/LinktoPgBtn";


const UserProfile =()=>{
    return(
        <>       
        <h1> Hello world!</h1>
        <Link to="/dashboard"><LinktoPgBtn btnStyle="btn btn-primary" text="Back to dashboard"/> </Link>
        </>
    )
}
export default UserProfile;