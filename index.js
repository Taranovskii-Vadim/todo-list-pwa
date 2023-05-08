window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const result = await navigator.serviceWorker.register("sw.js");
      console.log("Service worker register success", result);
    } catch (e) {
      // console.log("Service worker register fail");
    }
  }

  await fetchData();
});

const BASE = "https://jsonplaceholder.typicode.com";

async function fetchData() {
  const res = await fetch(`${BASE}/posts?_limit=10`);
  const data = await res.json();

  const container = document.querySelector("#posts");
  container.innerHTML = data.map(toCard).join("\n");
}

function toCard(post) {
  return `
      <div class="card">
        <div class="card-title">
          ${post.title}
        </div>
        <div class="card-body">
          ${post.body}
        </div>
      </div>
    `;
}
