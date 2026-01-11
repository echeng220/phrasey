import { Image, useColorScheme } from 'react-native'

// images
// TODO: create dark/light theme logos
import DarkLogo from '../assets/img/phrasey_logo_placeholder2.png'
import LightLogo from '../assets/img/phrasey_logo_placeholder2.png'

const ThemedLogo = () => {
  const colorScheme = useColorScheme()
  
  const logo = colorScheme === 'dark' ? DarkLogo : LightLogo

  return (
    <Image source={logo} />
  )
}

export default ThemedLogo