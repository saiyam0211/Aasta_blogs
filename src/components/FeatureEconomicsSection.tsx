import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const FeatureEconomicsSection = () => {
  const data = [
    { name: 'Restaurant Deals', value: 35, color: '#00FF7F' },
    { name: 'User Rewards', value: 30, color: '#C5FF4A' },
    { name: 'App Development', value: 20, color: '#FFD700' },
    { name: 'Marketing', value: 15, color: '#FF6B6B' }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-secondary font-bold">❤️</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary">
              FEATURE ECONOMICS
            </h2>
          </div>
        </div>

        <div className="card-asta bg-card-bg border-2 border-primary">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Pie Chart */}
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-primary mb-6">Distribution Breakdown</h3>
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-semibold">{item.name}</span>
                      <span className="text-primary font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2 mt-1">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${item.value}%`, 
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
