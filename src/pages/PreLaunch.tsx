const PreLaunch = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
      <h1 className="text-4xl font-bold mb-4">🚀 Coming Soon</h1>
      <p className="text-lg opacity-80 max-w-xl">
        We’re preparing something meaningful for the Ummah.
        <br /> Launching very soon.
      </p>

      <p className="mt-6 text-sm opacity-60">
        © {new Date().getFullYear()} • All rights reserved
      </p>
    </div>
  );
};

export default PreLaunch;