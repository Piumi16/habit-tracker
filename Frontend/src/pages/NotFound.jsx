import { Result } from 'antd'

const NotFound = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={<div className='text-xl text-red-400 font-semibold'>Please navigate back! </div>}
    />
  )
}

export default NotFound
