import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Add the different screens
import LoginScreen from "./screens/LoginScreen"
import SignUpScreen from "./screens/SignUpScreen"
import MenuScreen from "./screens/MenuScreen"
import NewUrlScreen from "./screens/NewURLScreen"
import AnalyticScreen from "./screens/AnalyticScreen"

const Navigator = createStackNavigator ({
  Login: { screen: LoginScreen},
  SignUp: { screen: SignUpScreen },
  Menu: { screen: MenuScreen },
  NewURL: { screen: NewUrlScreen },
  UrlAnalytics: { screen: AnalyticScreen },
});

const App = createAppContainer(Navigator);

export default App;