export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 9,
      features: ['5 Projects', 'Basic Analytics', 'Email Support'],
    },
    {
      name: 'Pro',
      price: 29,
      features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'API Access'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      features: ['Everything in Pro', 'Dedicated Support', 'Custom Contracts', 'SLA'],
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`p-8 rounded-2xl ${plan.popular ? 'bg-blue-600' : 'bg-slate-800'}`}>
              {plan.popular && <span className="text-sm font-semibold text-blue-200">Most Popular</span>}
              <h3 className="text-2xl font-bold text-white mt-2">{plan.name}</h3>
              <div className="my-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-300">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-slate-300 flex items-center">
                    <span className="mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-semibold ${plan.popular ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
