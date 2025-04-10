export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#060611] text-gray-200 px-4 py-12 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Services</h1>
        <p className="text-lg mb-10 leading-relaxed text-gray-300">
          At <strong className="text-teal-400">ConTracker</strong>, we offer a suite of services designed to bring transparency,
          efficiency, and public involvement into the government contract system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Cards */}
          {[
            {
              title: "Smart Contract-Based Tenders",
              desc: "Automate tender allocation and ensure fairness with blockchain-backed smart contracts. No middlemen, no manipulation.",
            },
            {
              title: "Milestone-Based Fund Release",
              desc: "Funds are locked and only released based on verified milestone completion—voted on by the public and officials.",
            },
            {
              title: "Public Participation & Voting",
              desc: "Citizens have a say in project progress through a secure and weighted voting system.",
            },
            {
              title: "Role-Based Access Control",
              desc: "Different dashboards and features for Public, Contractors, and Government officials (Super Owner, Owner, Admin).",
            },
            {
              title: "Secure Authentication",
              desc: "Supports login via Email, Google, and Facebook using JWT for unified and secure access.",
            },
            {
              title: "Project History & Transparency",
              desc: "View complete history of tenders, bidders, votes, and payments—fully transparent and traceable.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:bg-gray-800"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">{service.title}</h2>
              <p className="text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
