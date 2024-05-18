import React from 'react'
import { Outlet} from 'react-router-dom';

import './pages_css/Account.css'

function Account() {
  // Suggestion: Change routename to shop, since it will display shop on user log in
  // OR: change destination of on user log in. Navigate to user home on successful log in.
  // stuff to display in the account page

  return (
    <div>Account
      
      {/* render shop when url contains /shop maybe through a button? idrk ano pagkakasunod sunod*/}
      <Outlet/>
    </div>
  )
}

export default Account