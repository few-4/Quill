import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const ProtectedOTP = ({children}) => {

    const { user } = useSelector((state) => state.auth);

    if (!user || !user.email) {
        return <Navigate to="/sign-up"/>
    }

    return children;
}

export default ProtectedOTP