/**
 * Partytown Service Worker
 * Handles cross-origin requests and prevents frame access errors
 */

// Handle fetch events for Partytown
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle Partytown requests
  if (url.pathname.startsWith("/~partytown/")) {
    event.respondWith(handlePartytownRequest(event.request));
    return;
  }

  // Let other requests pass through
});

async function handlePartytownRequest(request) {
  try {
    const url = new URL(request.url);

    // Extract the actual URL from the proxy path
    const actualUrl =
      url.searchParams.get("url") || url.pathname.replace("/~partytown/", "");

    if (!actualUrl) {
      return new Response("Bad Request: No URL specified", { status: 400 });
    }

    // Create headers for CORS
    const headers = new Headers(request.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Forward the request
    const response = await fetch(actualUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== "GET" ? request.body : undefined,
    });

    // Add CORS headers to response
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Credentials", "false");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.warn("Partytown proxy error:", error);

    // Return a fallback response instead of failing
    return new Response(
      `console.warn("Partytown proxy failed: ${error.message}");`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

// Handle service worker installation
self.addEventListener("install", (event) => {
  console.log("Partytown service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Partytown service worker activated");
  event.waitUntil(self.clients.claim());
});

// Handle errors gracefully
self.addEventListener("error", (event) => {
  console.warn("Partytown service worker error:", event.error);
  event.preventDefault(); // Prevent the error from breaking the app
});

self.addEventListener("unhandledrejection", (event) => {
  console.warn("Partytown service worker unhandled rejection:", event.reason);
  event.preventDefault(); // Prevent the rejection from breaking the app
});
