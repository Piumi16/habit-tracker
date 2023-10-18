/* eslint-disable react/prop-types */

const PageWrapper = ({ children, header }) => {
  return (
    <div className='h-screen w-full text-2xl pl-2 p-1 overflow-y-auto'>
      <h2 className="text-blue-500 font-semibold mb-6 uppercase">{header}</h2>
      {children}
    </div>
  )
}

export default PageWrapper
