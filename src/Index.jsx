import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function AlumniLanding() {
  const [state, setState] = useState({
    showSignup: false,
    showLogin: false,
    loading: false,
    form: { fullName: "", email: "", password: "", confirmPassword: "", gradYear: "", bio: "", userType: "Pass Out" },
    profiles: sampleProfiles,
    auth: { loggedIn: false, user: null },
    query: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setState((s) => ({
      ...s,
      form: { ...s.form, [name]: value },
    }));
  }

  function passwordStrength(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  function PasswordStrengthBar({ score }) {
    const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    return (
      <div className="w-full h-2 rounded bg-gray-200 mt-1">
        <div
          className={`h-2 rounded ${colors[score - 1] || ""}`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>
    );
  }

  async function register(e) {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, gradYear, bio, userType } = state.form;

    if (!fullName || !email || !password || !confirmPassword) {
      setState((s) => ({ ...s, message: "Fill all required fields." }));
      return;
    }

    if (password !== confirmPassword) {
      setState((s) => ({ ...s, message: "Passwords do not match." }));
      return;
    }

    setState((s) => ({ ...s, loading: true, message: "" }));
    await new Promise((r) => setTimeout(r, 800));

    const newProfile = {
      id: cryptoRandomId(),
      name: fullName,
      year: gradYear || "—",
      bio: bio || "",
      avatar: randomAvatar(fullName),
      userType,
    };

    setState((s) => ({
      ...s,
      loading: false,
      showSignup: false,
      message: "Signup successful!",
      form: { fullName: "", email: "", password: "", confirmPassword: "", gradYear: "", bio: "", userType: "Pass Out" },
      profiles: [newProfile, ...s.profiles],
      auth: { loggedIn: true, user: newProfile },
    }));
  }

  async function login(e) {
    e.preventDefault();
    if (!state.form.email || !state.form.password) {
      setState((s) => ({ ...s, message: "Enter email & password." }));
      return;
    }
    setState((s) => ({ ...s, loading: true, message: "" }));
    await new Promise((r) => setTimeout(r, 600));

    const profile = state.profiles[0];
    setState((s) => ({
      ...s,
      loading: false,
      showLogin: false,
      auth: { loggedIn: true, user: profile },
      form: { fullName: "", email: "", password: "", confirmPassword: "", gradYear: "", bio: "", userType: "Pass Out" },
    }));
  }

  function logout() {
    setState((s) => ({ ...s, auth: { loggedIn: false, user: null } }));
  }

  const filtered = state.profiles.filter((p) => {
    const q = state.query.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.year.includes(q) ||
      (p.bio || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h1 className="text-lg font-semibold">AlumniConnect</h1>
            <p className="text-sm text-slate-500">Centralized alumni profiles & networking</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <button
            className="text-sm py-2 px-3 rounded hover:bg-slate-100"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Features
          </button>
          <button
            className="text-sm py-2 px-3 rounded hover:bg-slate-100"
            onClick={() => window.scrollTo({ top: 1200, behavior: "smooth" })}
          >
            Network
          </button>

          {state.auth.loggedIn ? (
            <>
              <span className="text-sm text-slate-600">Hi, {state.auth.user?.name}</span>
              <button className="bg-rose-600 text-white px-4 py-2 rounded" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded border" onClick={() => setState((s) => ({ ...s, showLogin: true }))}>
                Login
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => setState((s) => ({ ...s, showSignup: true }))}>
                Signup
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-10">
          <div>
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Reconnect. Share. Grow.
            </motion.h2>
            <p className="mt-3 text-slate-600 max-w-full sm:max-w-xl">
              A centralized platform for alumni to register, login, update profiles, and network across batches — build mentorship, jobs, and lifelong connections.
            </p>
            {!state.auth.loggedIn && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={() => setState((s) => ({ ...s, showSignup: true }))}
                >
                  Get started — Signup
                </button>
                <button
                  className="inline-flex items-center py-2 px-4 rounded border border-slate-200 hover:bg-slate-50"
                  onClick={() => setState((s) => ({ ...s, showLogin: true }))}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-10">
          <h3 className="text-xl sm:text-2xl font-semibold">What you can do</h3>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FeatureCard title="Register & Verify" desc="Quick sign-up and optional verification. Keep your details private or public as you choose." />
            <FeatureCard title="Update Profile" desc="Add work, projects, skills, and interests. Keep your alumni profile current." />
            <FeatureCard title="Network & Mentor" desc="Search alumni by batch, skills, or location. Request mentorship or share opportunities." />
          </div>
        </section>

        {/* Network */}
        <section className="py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-xl sm:text-2xl font-semibold">Network</h3>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto flex-1">
                <input
                  placeholder="Search alumni, year or skills"
                  value={state.query}
                  onChange={(e) => setState((s) => ({ ...s, query: e.target.value }))}
                  className="border rounded px-3 py-2 pr-8 w-full"
                />
                <div className="absolute right-2 top-2 text-slate-500">
                  <Search size={16} />
                </div>
              </div>
              <button className="bg-slate-100 px-3 py-2 rounded" onClick={() => setState((s) => ({ ...s, query: "" }))}>
                Clear
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="p-3 sm:p-4 border rounded-lg bg-white">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-200 rounded-full font-bold">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-slate-500">Class of {p.year}</div>
                    <p className="mt-1 sm:mt-2 text-sm text-slate-600">{p.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-indigo-50 rounded-lg p-4 sm:p-6 gap-4">
          <div>
            <h4 className="text-lg sm:text-xl font-semibold">Ready to join your alumni community?</h4>
            <p className="text-slate-600 text-sm sm:text-base">
              Create a profile and start reconnecting today.
            </p>
          </div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={() => setState((s) => ({ ...s, showSignup: true }))}
          >
            Create profile
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-10 py-6 text-sm text-slate-500 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div>© {new Date().getFullYear()} AlumniConnect — Built for alumni networks</div>
            <div className="flex gap-3">
              <a className="hover:underline">Privacy</a>
              <a className="hover:underline">Terms</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Signup Modal */}
      <AnimatePresence>
        {state.showSignup && (
          <Modal onClose={() => setState((s) => ({ ...s, showSignup: false }))}>
            <h4 className="text-lg font-semibold">Signup</h4>
            <form onSubmit={register} className="mt-4 space-y-3">
              <input name="fullName" placeholder="Full name" value={state.form.fullName} onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="email" placeholder="Email" value={state.form.email} onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="password" type="password" placeholder="Password" value={state.form.password} onChange={handleChange} className="w-full p-3 border rounded" />
              <PasswordStrengthBar score={passwordStrength(state.form.password)} />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={state.form.confirmPassword} onChange={handleChange} className="w-full p-3 border rounded" />
              <select name="userType" value={state.form.userType} onChange={handleChange} className="w-full p-3 border rounded">
                <option value="In Campus">In Campus</option>
                <option value="Pass Out">Pass Out</option>
              </select>
              <input name="gradYear" placeholder="Graduation year" value={state.form.gradYear} onChange={handleChange} className="w-full p-3 border rounded" />
              <textarea name="bio" placeholder="Short bio" value={state.form.bio} onChange={handleChange} className="w-full p-3 border rounded" rows={3} />
              {state.message && <div className="text-red-500 text-sm">{state.message}</div>}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setState((s) => ({ ...s, showSignup: false }))}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white" disabled={state.loading}>
                  {state.loading ? "Signing up..." : "Signup"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {state.showLogin && (
          <Modal onClose={() => setState((s) => ({ ...s, showLogin: false }))}>
            <h4 className="text-lg font-semibold">Login</h4>
            <form onSubmit={login} className="mt-4 space-y-3">
              <input name="email" placeholder="Email" value={state.form.email} onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="password" type="password" placeholder="Password" value={state.form.password} onChange={handleChange} className="w-full p-3 border rounded" />
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setState((s) => ({ ...s, showLogin: false }))}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white" disabled={state.loading}>
                  {state.loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Reusable components */
function FeatureCard({ title, desc }) {
  return (
    <div className="p-3 sm:p-4 border rounded-lg bg-white">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1 text-sm sm:text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
        {children}
      </motion.div>
    </motion.div>
  );
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 9);
}
function randomAvatar(name) {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("");
}
const sampleProfiles = [
  { id: "a1", name: "Priya Sharma", year: "2016", bio: "Software engineer", avatar: "PS" },
  { id: "a2", name: "Rohit Verma", year: "2018", bio: "Product manager", avatar: "RV" },
  { id: "a3", name: "Neha Gupta", year: "2012", bio: "Founder — edtech startup", avatar: "NG" },
];
