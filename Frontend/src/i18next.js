import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      'sign in': 'Sign In',
      'sign up': 'Sign Up',
      logout: 'Logout',
      welcome: 'welcome',
      habits: 'Habits',
      tracking: 'Tracking',
      profile: 'Profile',
      faq: 'FAQ',
      'pre habits': 'Pre Habits',
      users: 'Users',
      'user contacts': 'User Contacts',
      'account delete': 'Account Delete Req',
      name: 'Name',
      description: 'Description',
      'target value': 'Target Value',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      'log date': 'Log Date',
      progress: 'Progress',
      'log hrs': 'Log (hrs)',
      'add log': 'Add Log',
      'filter by': 'Filter By',
      'all records': 'All records',
      'not logged': 'Not Logged',
      age: 'Age',
      height: 'Height',
      weight: 'Weight',
      'update profile': 'Update Profile',
      'job type': 'Job Type',
      'delete account': 'Delete Account',
      'delete reason': 'Please note reason for account delete',
      'proceed to delete': 'Proceed to delete!',
      'revert action': ' You cant revert this action!',
      email: 'Email',
      'ask a question': 'Ask a question',
      send: 'Send',
      password: 'Password',
      'confirm password': 'Confirm Password',
      'dont you have account': "Don't you have account ?",
      'already have an account': 'Already have an account'
    }
  },
  sin: {
    translation: {
      'sign in': 'පුරනය',
      'sign up': 'ලියාපදිංචි වන්න',
      logout: 'පිටවීම',
      welcome: 'ආයුබෝවන්',
      habits: 'පුරුදු',
      tracking: 'ලුහුබැඳීම',
      profile: 'පැතිකඩ',
      faq: 'නිති අසන පැණ',
      'pre habits': 'පෙර පුරුදු',
      users: 'පරිශීලකයන්',
      'user contacts': 'පරිශීලක සම්බන්ධතා',
      'account delete': 'ගිණුම් මකන්න ඉල්ලීම්',
      name: 'නම',
      description: 'විස්තර',
      'target value': 'ඉලක්ක අගය',
      edit: 'සංස්කරණය',
      delete: 'මකා දමන්න',
      add: 'එකතු කරන්න',
      'log date': 'ලොග් දිනය',
      progress: 'ප්රගතිය',
      'log hrs': 'ලොග් (පැය)',
      'add log': 'ලොග් එක් කරන්න',
      'filter by': 'පෙරහන් කරන්න',
      'all records': 'සියලුම වාර්තා',
      'not logged': 'ලොග් වී නැති වාර්තා',
      age: 'වයස',
      height: 'උස',
      weight: 'බර',
      'update profile': 'පැතිකඩ යාවත්කාලීන කරන්න',
      'job type': 'රැකියා වර්ගය',
      'delete account': 'ගිණුම මකන්න',
      'delete reason': 'ගිණුම මකා දැමීමට හේතුව සටහන් කරන්න',
      'proceed to delete': 'මකා දැමීමට ඉදිරියට යන්න!',
      'revert action': 'ඔබට මෙම ක්‍රියාව ආපසු හැරවිය නොහැක!',
      email: 'විද්යුත් තැපෑල',
      'ask a question': 'ප්රශ්නයක් අහන්න',
      send: 'යවන්න',
      password: 'මුරපදය',
      'confirm password': 'අනුකූල මුරපදය',
      'dont you have account': 'ඔබට ගිණුමක් නැද්ද?',
      'already have an account': 'දැනටමත් ගිණුමක් ඇත',
      question: 'ප්රශ්නය'
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'sin',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
