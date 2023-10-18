import { useEffect, useState } from 'react'
import { Switch } from 'antd'
import i18n from '../i18next'

// change language
const changeLanguage = lng => {
  i18n.changeLanguage(lng)
}

const LanguageChange = () => {
  const [nativeLan, setNativeLan] = useState(true)

  const handleLanguageChange = () => {
    setNativeLan(!nativeLan)
  }

  useEffect(() => {
    if (nativeLan) {
      changeLanguage('sin')
    } else {
      changeLanguage('en')
    }
  }, [nativeLan])

  return (
    <Switch
      checkedChildren='සිං'
      unCheckedChildren='En'
      checked={nativeLan}
      onChange={handleLanguageChange}
      className='bg-green-500 hover:!bg-blue-400 active:bg-red-400 mb-4'
    />
  )
}

export default LanguageChange
