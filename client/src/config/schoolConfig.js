// schoolConfig.js
import johnsHopkinsLogo from '../images/JHU.logo_vertical.white.png';


const schoolConfig = {
    default: {
        logo: johnsHopkinsLogo, // Update the path to the Johns Hopkins logo
        primaryColor: 'bg-[#002D72]', // Johns Hopkins Blue background
        buttonPrimary: 'bg-[#0072CE] hover:bg-[#0056a8]', // Button primary: lighter Hopkins blue
        buttonSecondary: 'bg-[#8E9FBB] hover:bg-[#5E729A]', // Button secondary: soft gray-blue
        programName: 'Johns Hopkins Residency Program',

        titleColor: 'text-white', // White text for titles
        titleStrongColor: 'text-[#8E9FBB]', // Strong text in gray-blue accent
    }
    ,
  tufts: {
    logo: '/images/Tufts_logo.png',
    primaryColor: 'bg-gray-900',
    buttonPrimary: 'bg-blue-500 hover:bg-blue-600',
    buttonSecondary: 'bg-orange-500 hover:bg-orange-600',
    programName: 'Tufts Residency Program',
    programTagline: 'Exclusively for the Tufts Residency Program.',
    titleColor: 'text-[#3172AE]',
    titleStrongColor: 'text-gold-700',
  },
  harvard: {
    logo: '/images/Harvard_logo.png',
    primaryColor: 'bg-red-800',
    buttonPrimary: 'bg-gray-200 hover:bg-gray-300',
    buttonSecondary: 'bg-black hover:bg-gray-700',
    programName: 'Harvard Residency Program',
    programTagline: 'Welcome to the Harvard Residency Program.',
    titleColor: 'text-white',
    titleStrongColor: 'text-gray-200',
  },
};

export default schoolConfig;
