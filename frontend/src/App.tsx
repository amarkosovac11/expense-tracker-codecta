import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./hooks/useAuth";


function App() {
  const { isLoggedIn, userId, login, register, logout } = useAuth();

  if (!isLoggedIn || !userId) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  return <DashboardPage userId={userId} onLogout={logout} />;

 
  
}


export default App;