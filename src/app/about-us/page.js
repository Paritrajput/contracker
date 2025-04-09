export default function AboutPage() {
    return (
      <div className="min-h-screen bg-white text-gray-800 px-4 py-10 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-primary">About ConTracker</h1>
  
          <p className="mb-6 text-lg">
            <strong>ConTracker</strong> is a decentralized platform designed to transform how government contracts are handled.
            Using blockchain technology, we bring transparency, accountability, and efficiency to public infrastructure projects.
          </p>
  
          <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
          <p className="mb-6">
            To empower citizens, government authorities, and contractors with a transparent and trustworthy digital ecosystem
            for public tenders and contracts.
          </p>
  
          <h2 className="text-2xl font-semibold mt-8 mb-3">What We Do</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Enable public and fair bidding for government tenders</li>
            <li>Track milestones with verification by officials and citizens</li>
            <li>Release funds through automated smart contracts</li>
            <li>Ensure accountability through immutable records</li>
          </ul>
  
          <h2 className="text-2xl font-semibold mt-8 mb-3">Why Blockchain?</h2>
          <p className="mb-6">
            Blockchain ensures transparency and trust. Every contract, bid, and approval is recorded on a tamper-proof ledger,
            making it accessible for public verification.
          </p>
  
          <h2 className="text-2xl font-semibold mt-8 mb-3">Who We Serve</h2>
          <ul className="list-disc ml-6 space-y-2 mb-6">
            <li><strong>Government:</strong> Manage tenders, approve milestones, track progress</li>
            <li><strong>Contractors:</strong> Submit bids, get paid on verified milestones</li>
            <li><strong>Citizens:</strong> Vote on project quality, monitor public spending</li>
          </ul>
  
          <h2 className="text-2xl font-semibold mt-8 mb-3">Our Vision</h2>
          <p>
            We envision a future where every rupee spent on public projects is traceable, justified, and monitored by the people.
            ConTracker is more than just software — it’s a movement toward responsible governance.
          </p>
        </div>
      </div>
    );
  }
  