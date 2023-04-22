import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseConfig";
import { setSession } from "../../features/userSlice";

const dispatch = useDispatch();
const user = useSelector((state) => state.user)

const isSignedIn = async() => {
    const { data, error } = await supabase.auth.getSession();
    if(error) {
      navigation.navigate('signin');
      dispatch(setSession(null))
    }
    
}

export default isSignedIn;