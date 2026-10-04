const base = "http://localhost:3000";

async function status(path) {
  const r = await fetch(`${base}${path}`);
  return `${path} -> ${r.status}`;
}

async function main() {
  console.log(await status("/"));
  console.log(await status("/services"));
  console.log(await status("/programs"));
  console.log(await status("/programs/internships"));
  console.log(await status("/projects"));
  console.log(await status("/events"));
  console.log(await status("/news"));
  console.log(await status("/api/org"));

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@btrc.example", password: "DemoPass!123" }),
  });
  console.log("demo login ->", login.status);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  const admin = await fetch(`${base}/admin`, { headers: { cookie } });
  console.log("demo /admin ->", admin.status);

  const homeHtml = await (await fetch(`${base}/`)).text();
  console.log("hero present:", homeHtml.includes("Turning Ideas Into Technology"));
  console.log("metrics present:", homeHtml.includes("Metric Benchmarks"));
}

main().catch((e) => {
  console.error("SMOKE ERROR:", e.message);
  process.exit(1);
});
