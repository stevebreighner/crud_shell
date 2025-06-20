export function renderRegister(container) {
  container.innerHTML =
    '<h1 class="text-2xl font-bold mb-4">Register</h1>' +
    '<form class="space-y-4" onsubmit="handleRegister(event)">' +
    '<input type="text" placeholder="Username" class="w-full p-2 border rounded" required />' +
    '<input type="email" placeholder="Email" class="w-full p-2 border rounded" required />' +
    '<input type="password" placeholder="Password" class="w-full p-2 border rounded" required />' +
    '<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Register</button>' +
    '</form>' +
    '<p class="mt-4">Have an account? <a href="#/login" class="text-blue-600">Login here</a></p>';
}

window.handleRegister = function(event) {
  event.preventDefault();
  alert('Registering (placeholder)...');
  window.location.hash = '/#login';
};
