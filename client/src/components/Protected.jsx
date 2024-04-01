import React from 'react'
import { Navigate } from 'react-router-dom'

function Protected( {isSignedIn , children}) {
  
    if(isSignedIn){
        return children ;
    }
    else{
        return <Navigate to="/"/>
    }
}

export default Protected
