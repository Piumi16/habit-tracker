/* eslint-disable react/prop-types */
import { Spin } from 'antd'

const LoadingAnimation = ({
  children,
  tip,
  size = 'large',
  loading,
  className
}) => {
  return (
    <Spin tip={tip} size={size} spinning={loading} wrapperClassName={className}>
      {children}
    </Spin>
  )
}

export default LoadingAnimation
