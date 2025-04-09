export default function ServicesPage() {
    return (
      <div className="min-h-screen bg-white text-gray-800 px-4 py-12 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">Our Services</h1>
          <p className="text-lg mb-10 leading-relaxed">
            At <strong>ConTracker</strong>, we offer a suite of services designed to bring transparency,
            efficiency, and public involvement into the government contract system.
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service Card */}
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Smart Contract-Based Tenders</h2>
              <p className="text-gray-700">
                Automate tender allocation and ensure fairness with blockchain-backed smart contracts.
                No middlemen, no manipulation.
              </p>
            </div>
  
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Milestone-Based Fund Release</h2>
              <p className="text-gray-700">
                Funds are locked and only released based on verified milestone completion—voted on by the public and officials.
              </p>
            </div>
  
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Public Participation & Voting</h2>
              <p className="text-gray-700">
                Citizens have a say in project progress through a secure and weighted voting system.
              </p>
            </div>
  
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Role-Based Access Control</h2>
              <p className="text-gray-700">
                Different dashboards and features for Public, Contractors, and Government officials (Super Owner, Owner, Admin).
              </p>
            </div>
  
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Secure Authentication</h2>
              <p className="text-gray-700">
                Supports login via Email, Google, and Facebook using JWT for unified and secure access.
              </p>
            </div>
  
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-black mb-2">Project History & Transparency</h2>
              <p className="text-gray-700">
                View complete history of tenders, bidders, votes, and payments—fully transparent and traceable.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  