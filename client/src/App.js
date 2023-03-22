import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SingIn/SignIn";
import SignUp from "./SignUp/SignUp";
import ResetPassword from "./ResetPassword/ResetPassword";
import * as themes from './assets/themes/darkTheme'
import PageNotFound from "./PageNotFound/pageNotFound";
import Categories from "./Cetegories/Categories";
import UpdatePassword from "./ResetPassword/UpdatePassword";


function App() {

  let data
  if (sessionStorage.user) {
    data = JSON.parse(sessionStorage.user)
  }
  return (
    <themes.ThemeProvider theme={themes.dark}>
      <Router>
        <Routes>
          {
            data ?
              <>
                <Route path="/" excact element={<Categories />} />
                <Route path="/Categories" element={<Categories />} />
              </>
              :
              <>
                <Route path="/" excact element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/updatePassword/:userID/:token" element={<UpdatePassword />} />
                </>
          }
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </themes.ThemeProvider>
  );
}

export default App;
