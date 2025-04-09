import Link from "next/link";

const LoginPortals = () => {
  return (
    <div className="bg-[#060611]">
         <h1 className="justify-self-center text-3xl font-extrabold pt-7">Login</h1>
    <div className="flex flex-col h-[81vh] p-4 pt-10 px-20">
   
      <div className="flex flex-1 gap-10 ">
        <Link
          href="/authenticate/contractor/login"
          className="flex flex-1 flex-col items-center justify-center p-6 bg-gray-900 border-1 border-gray-800 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-lg font-bold">Contractor</h2>
          <p>Contractor login</p>
        </Link>
        <Link
          href="/authenticate/public-auth/login"
          className="flex flex-1 flex-col items-center justify-center p-6 bg-gray-900 border-1 border-gray-800 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">👥</div>
          <h2 className="text-lg font-bold">People</h2>
          <p>People Login</p>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center mt-4">
        <Link
          href="/authenticate/gov-auth/login"
          className="w-11/12 flex flex-col items-center justify-center p-6 bg-gray-900 border-1 border-gray-800 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">🏛️</div>
          <h2 className="text-lg font-bold">Government</h2>
          <p>Government login</p>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default LoginPortals;
