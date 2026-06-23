import React from "react";

export default function GoogleSignInInfo() {
  return (
    <section className="bg-slate-900 border-y border-brand-primary/20 py-8 relative z-10">
      <div className="container-page max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold text-white mb-3">
          App Purpose & Google Sign-In
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          <strong>PakAiVerse</strong> is a full-stack development agency portfolio and client management portal. 
          We use <strong>Google Sign-In (OAuth)</strong> exclusively to provide our clients with a secure, seamless way to access their private <strong>Client Dashboard</strong>. 
          By logging in with Google, clients can easily track their project progress, view order history, upload payment proofs, and communicate with our team without the need to remember additional passwords. 
          We only request your basic profile information (name and email) to uniquely identify your account in our portal.
        </p>
      </div>
    </section>
  );
}
