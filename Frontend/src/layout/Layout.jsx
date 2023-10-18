import { Col, Row, Avatar } from 'antd'
import { Outlet } from 'react-router'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { BiSolidUser, BiSolidExit, BiSolidTimeFive } from 'react-icons/bi'
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled
} from 'react-icons/tb'
import { AiOutlineUsergroupDelete } from 'react-icons/ai'
import { FaQuestionCircle } from 'react-icons/fa'
import { FaRunning } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { Menu } from 'antd'
import { useState } from 'react'
import LanguageChange from '../translate/LanguageChange'
import { useTranslation } from 'react-i18next'

function getItem (label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}

// eslint-disable-next-line react/prop-types
const Layout = ({ admin }) => {
  const [expand, setExpand] = useState(true)
  const navigate = useNavigate()

  const onClick = e => {
    if (admin) {
      if (e.key === 'habits') {
        navigate('/admin')
      }
      if (e.key === 'contact') {
        navigate('/admin/contact')
      }
      if (e.key === 'user-delete') {
        navigate('/admin/user-delete')
      }
    } else {
      if (e.key === 'habits') {
        navigate('/')
      } else if (e.key === 'tracking') {
        navigate('tracking')
      } else if (e.key === 'profile') {
        navigate('/profile')
      } else if (e.key === 'faq') {
        navigate('/faq')
      }
    }
  }
  const { t } = useTranslation()

  const adminItems = [
    getItem(t('pre habits'), 'habits', <FaRunning className='!text-[1.2rem]' />),
    {
      type: 'divider'
    },
    getItem(
      t('users'),
      'users',
      null,
      [
        getItem(
          t('user contacts'),
          'contact',
          <FaQuestionCircle className='!text-[1.2rem]' />
        ),
        getItem(
          t('account delete'),
          'user-delete',
          <AiOutlineUsergroupDelete className='!text-[1.2rem]' />
        )
      ],
      'group'
    ),
    {
      type: 'divider'
    }
  ]
  const items = [
    getItem(t('habits'), 'habits', <FaRunning className='!text-[1.2rem]' />),
    {
      type: 'divider'
    },
    getItem(
      t('tracking'),
      'tracking',
      <BiSolidTimeFive className='!text-[1.2rem]' />
    ),
    {
      type: 'divider'
    },
    getItem(t('profile'), 'profile', <BiSolidUser className='!text-[1.2rem]' />),
    {
      type: 'divider'
    },
    getItem(t('faq'), 'faq', <FaQuestionCircle className='!text-[1.2rem]' />),
    {
      type: 'divider'
    }
  ]

  return (
    <Row>
      <Col
        span='auto'
        className='bg-blue-100 h-screen flex flex-col'
        style={{
          width: expand ? 225 : 60
        }}
      >
        <img
          width='64'
          height='64'
          src='/public/logo.png'
          alt='logo'
          className='mx-auto my-6'
        />
        <div
          className={`${
            expand ? 'px-[24px]' : 'mx-auto'
          } py-2 h-[4rem] mb-2 flex items-center gap-4`}
        >
          <Avatar
            draggable={false}
            size='large'
            src='https://xsgames.co/randomusers/avatar.php?g=pixel&key=1'
          />
          {expand && (
            <span className='text-md font-semibold capitalize'>
              {admin
                ? `${t('welcome')} Admin`
                : `${t('welcome')} ${
                    localStorage.getItem('user_name') !== null
                      ? localStorage.getItem('user_name')
                      : ''
                  }`}
            </span>
          )}
        </div>
        <Menu
          theme='light'
          inlineCollapsed={!expand}
          expandIcon={<BsFillCaretDownFill />}
          onClick={onClick}
          style={{
            width: expand ? 225 : 60
          }}
          defaultSelectedKeys={['habits']}
          mode='inline'
          items={admin ? adminItems : items}
          className='bg-blue-100'
        />
        <div className={`mt-auto px-2  ${expand ? 'mx-[24px]' : 'mx-auto'}`}>
          <LanguageChange />

          <div
            className={`py-2 h-[2rem]  flex gap-4 items-center cursor-pointer duration-300 transition ease-in delay-150 rounded  mb-2 hover:bg-red-500 hover:shadow group`}
            onClick={() => {
              localStorage.removeItem('userToken')
              localStorage.removeItem('user_name')
              localStorage.removeItem('user_email')
              navigate('/sign-in')
            }}
          >
            <BiSolidExit className='text-2xl group-hover:text-white' />
            {expand && (
              <span className='text-md font-semibold group-hover:text-white'>
                {t('logout')}
              </span>
            )}
          </div>
        </div>
      </Col>
      <Col className='flex flex-col justify-center'>
        <div
          className='p-2 bg-blue-100 rounded-r cursor-pointer'
          onClick={() => setExpand(!expand)}
        >
          {!expand ? (
            <TbLayoutSidebarLeftExpandFilled className='text-2xl' />
          ) : (
            <TbLayoutSidebarRightExpandFilled className='text-2xl' />
          )}
        </div>
      </Col>
      <Col
        style={{
          flex: 'auto'
        }}
      >
        <Outlet />
      </Col>
    </Row>
  )
}

export default Layout
