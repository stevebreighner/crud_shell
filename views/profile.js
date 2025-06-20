// profile.js

export function renderProfile(container) {
  container.innerHTML = `
    <h1 class="text-2xl font-bold mb-4">Profile</h1>
    <div id="avatar-preview-container" class="mb-4">
      <img id="avatarPreview" src="/default-avatar.png"
           alt="Avatar" class="rounded-full border object-cover" />
    </div>

    <div class="mb-4">
      <label for="avatar" class="block font-semibold">Upload Avatar (Max 2MB)</label>
      <input type="file" id="avatar" class="w-full p-2 border rounded" accept="image/*" />
    </div>

    <form class="space-y-4" onsubmit="handleProfileUpdate(event)">
      <label for="username" class="block font-semibold">Username</label>
      <input type="text" id="username" class="w-full p-2 border rounded" readonly /><br />

      <label for="email" class="block font-semibold">Email</label>
      <input type="email" id="email" class="w-full p-2 border rounded" readonly /><br />

      <label for="first_name" class="block font-semibold">First Name</label>
      <input type="text" id="first_name" class="w-full p-2 border rounded" /><br />

      <label for="last_name" class="block font-semibold">Last Name</label>
      <input type="text" id="last_name" class="w-full p-2 border rounded" /><br />

      <label for="dob" class="block font-semibold">Date of Birth</label>
      <input type="date" id="dob" class="w-full p-2 border rounded" /><br />

      <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
    </form>

    <p class="mt-4"><a href="/#update-password" class="text-red-600">Update Password</a></p>
  `;

  // Style avatar as 80×80 thumbnail
  const previewImg = document.getElementById('avatarPreview');
  previewImg.style.width       = '80px';
  previewImg.style.height      = '80px';
  previewImg.style.objectFit   = 'cover';
  previewImg.style.borderRadius= '50%';
  previewImg.style.border      = '2px solid #ccc';
  previewImg.style.display     = 'block';

  // Handle file input + preview
  document.getElementById('avatar').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;
    if (!file) {
      previewImg.src = '/default-avatar.png';
      return;
    }
    if (file.size > maxSize) {
      alert('❌ File size exceeds 2MB limit. Please choose a smaller image.');
      e.target.value = '';
      previewImg.src = '/default-avatar.png';
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        previewImg.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('❌ Please select a valid image file.');
      e.target.value = '';
      previewImg.src = '/default-avatar.png';
    }
  });

  // Fetch and populate profile data
  async function getProfileInfo() {
    try {
      const response = await fetch('/wp-json/customapi/v1/user-profile?_=' + Date.now(), {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        document.getElementById('username').value   = data.username || '';
        document.getElementById('email').value      = data.email || '';
        document.getElementById('first_name').value = data.first_name || '';
        document.getElementById('last_name').value  = data.last_name || '';
        document.getElementById('dob').value        = data.dob || '';
        previewImg.src = data.avatar_url || '/default-avatar.png';
      } else {
        alert('❌ Error fetching profile: ' + (data.message || 'Unknown error'));
        if (response.status === 401) {
          window.location.hash = '#/login';
        }
      }
    } catch (error) {
      alert('❌ Network error: ' + error.message);
    }
  }

  getProfileInfo();
}

// Handle save
window.handleProfileUpdate = async function (event) {
  event.preventDefault();

  // Validate DOB
  const dobInput = document.getElementById('dob').value;
  if (dobInput) {
    const dobDate = new Date(dobInput);
    const now = new Date();
    if (dobDate > now) {
      alert('❌ Date of Birth cannot be in the future.');
      return;
    }
    const thirteenYearsAgo = new Date();
    thirteenYearsAgo.setFullYear(now.getFullYear() - 13);
    if (dobDate > thirteenYearsAgo) {
      alert('❌ You must be at least 13 years old.');
      return;
    }
  }

  const formData = new FormData();
  formData.append('first_name', document.getElementById('first_name').value);
  formData.append('last_name',  document.getElementById('last_name').value);
  formData.append('dob',        dobInput);

  const avatarFile = document.getElementById('avatar').files[0];
  if (avatarFile) {
    formData.append('avatar', avatarFile);
  }

  try {
    const response = await fetch('/wp-json/customapi/v1/user-profile-update', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    const data = await response.json();

    if (response.ok) {
      alert('✅ Profile updated successfully!');
      renderProfile(document.getElementById('app'));
    } else {
      alert('❌ Error updating profile: ' + (data.message || 'Unknown error'));
      if (response.status === 401) {
        window.location.hash = '#/login';
      }
    }
  } catch (error) {
    alert('❌ Network error: ' + error.message);
  }
};
