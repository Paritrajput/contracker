import Link from "next/link";

const LoginPortals = () => {
  return (
    <div className="bg-[#060611] min-h-screen px-4 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-white mb-6">Login</h1>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-6">
        <Link
          href="/authenticate/contractor/login"
          className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-lg font-bold">Contractor</h2>
          <p>Contractor login</p>
        </Link>
        <Link
          href="/authenticate/public-auth/login"
          className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <div className="text-4xl mb-2">👥</div>
          <h2 className="text-lg font-bold">People</h2>
          <p>People Login</p>
        </Link>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <Link
          href="/authenticate/gov-auth/login"
          className="w-full flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
        >
          <div className="text-4xl mb-2">🏛️</div>
          <h2 className="text-lg font-bold">Government</h2>
          <p>Government login</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginPortals;
