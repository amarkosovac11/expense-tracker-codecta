import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user,isLoggedIn, userId, login, register, logout } = useAuth();

  if (!isLoggedIn || !userId) {
  return <AuthPage onLogin={login} onRegister={register} />;
}

return (
  <div>
    <DashboardPage userId={userId}  onLogout={logout} user={user!}/>
  </div>
);
}

export default App;