import { Truck, Users, Route, Wrench } from "lucide-react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    {
      title: "Total Vehicles",
      value: 25,
      icon: <Truck size={32} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Drivers",
      value: 18,
      icon: <Users size={32} />,
      color: "bg-green-500",
    },
    {
      title: "Active Trips",
      value: 12,
      icon: <Route size={32} />,
      color: "bg-orange-500",
    },
    {
      title: "Maintenance",
      value: 3,
      icon: <Wrench size={32} />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow px-8 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">
          TransitOps
        </h1>

        <div>
          <p className="font-semibold">{user.role}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">

        <h2 className="text-2xl font-bold mb-6">
          Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6">

          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg">{card.title}</h3>
                  <p className="text-4xl font-bold mt-3">
                    {card.value}
                  </p>
                </div>

                {card.icon}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;