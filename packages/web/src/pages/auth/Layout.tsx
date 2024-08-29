export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full sm-(flex justify-between)">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4 aspect-ratio-1 relative sm:m-0 mt-10vh">
          <div className="bg-gradient-to-bl to-black from-red w-full h-full blur-70px rounded-full absolute z--1"></div>
          <img src="https://q1.qlogo.cn/g?b=qq&nk=2581807417&s=100" alt="Logo" />
          <div className="md-text-3xl font-bold text-center">
            <h1>WELCOME TO</h1>
            <h1>MYCHAT WEB APP</h1>
          </div>
        </div>
      </div>
      <div className="md:w-400px sm:w-300px w-full p-sm ">
        {children}
      </div>
    </div>
  )
}
