import { Outlet } from 'react-router-dom'

export function Component() {
  return (
    <div className="im-container sm:p-x-10vw">
      <div className="z-1 w-full h-full sm:(w-80vw rounded-md h-80vh shadow-xl of-hidden ) bg-white/40 backdrop-blur-1 ">
        <Outlet />
      </div>
    </div>
  )
}
