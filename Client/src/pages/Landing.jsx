import React, { useState, useEffect } from "react";

export default function HomePage() {
  // Simple dark toggle if you want to try different vibes (optional)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <span className="font-semibold">YouthPay</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="text-sm px-3 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm px-3 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Testimonials
            </a>
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="text-sm px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="text-sm px-3 py-1.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-pink-500 to-yellow-400" />
        <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-sky-400 to-violet-500" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Take control of money, the smart and fun way
              </h1>
              <p className="mt-4 text-zinc-600 dark:text-zinc-300">
                YouthPay helps students save, budget, and pay with
                confidence—built for campus life with bright vibes and zero
                complexity.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="px-5 py-2.5 rounded-md text-white font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition">
                  Sign Up Free
                </button>
                <button className="px-5 py-2.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                  Download the App
                </button>
              </div>
              <div className="mt-4 text-xs text-zinc-500">
                No fees to start. Cancel anytime.
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                {/* Replace with your illustration/screenshot */}
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-amber-300 via-pink-300 to-sky-300 dark:from-amber-400/40 dark:via-pink-400/40 dark:to-sky-400/40 flex items-center justify-center text-zinc-900 dark:text-white font-semibold">
                  App Preview / Illustration
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 px-3 py-1.5 text-xs rounded-full bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow">
                Built for students
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section
        id="features"
        className="py-12 sm:py-16 bg-zinc-50 dark:bg-zinc-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold">
            Features that keep money simple
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Bright design, minimal friction, real results.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon="💳" title="Wallet">
              Instant top-ups, track spends, and split bills with friends.
            </FeatureCard>
            <FeatureCard icon="📊" title="Budgeting">
              Smart categories, alerts, and weekly summaries that make sense.
            </FeatureCard>
            <FeatureCard icon="⚡" title="Payments">
              Fast QR and UPI-like flow, built for canteens and campus stores.
            </FeatureCard>
            <FeatureCard icon="🎯" title="Goals">
              Save for gadgets, trips, and fest passes with auto-savings.
            </FeatureCard>
            <FeatureCard icon="💡" title="Tips">
              Bite-sized financial tips curated for students.
            </FeatureCard>
            <FeatureCard icon="🔒" title="Security">
              PIN, biometrics, and instant freeze to stay protected.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold">Loved by students</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Real voices. Real impact.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TestimonialCard name="Aarav" tag="CST Student">
              “Finally a money app that doesn’t feel boring. The goals feature
              is addictive.”
            </TestimonialCard>
            <TestimonialCard name="Meera" tag="Commerce Undergrad">
              “Splitting bills with friends is super easy. The UI is so fresh.”
            </TestimonialCard>
            <TestimonialCard name="Rohit" tag="Hosteller">
              “Helps me track mess and cab spends. The weekly summaries are
              perfect.”
            </TestimonialCard>
            <TestimonialCard name="Ananya" tag="MBA Fresher">
              “I started saving for my new phone and hit the goal faster than
              expected.”
            </TestimonialCard>
            <TestimonialCard name="Kabir" tag="Developer Student Club">
              “Secure, fast, and the QR payments just work at the canteen.”
            </TestimonialCard>
            <TestimonialCard name="Sana" tag="Design Student">
              “The colors and icons are so friendly. Feels built for us.”
            </TestimonialCard>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button className="px-5 py-2.5 rounded-md text-white font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 transition">
              Sign Up Free
            </button>
            <button className="px-5 py-2.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
              Download the App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <span className="font-medium">YouthPay</span>
          </div>
          <div className="text-zinc-500">
            © {new Date().getFullYear()} YouthPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, tag, children }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-violet-500" />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-zinc-500">{tag}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
        {children}
      </p>
    </div>
  );
}
