const fs = require('fs');

async function run() {
  console.log('=== 1. Testing Student Login ===');
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul.sharma@campus.edu', password: 'student123' })
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'User:', loginData.user?.name);
  const token = loginData.token;

  console.log('\n=== 2. Testing Direct Photo File Upload (POST /api/upload) ===');
  const photoForm = new FormData();
  photoForm.append('file', new Blob([Buffer.from('fake-jpeg-photo-bytes-data')], { type: 'image/jpeg' }), 'student_avatar.jpg');
  const photoRes = await fetch('http://localhost:4000/api/upload', {
    method: 'POST',
    body: photoForm
  });
  const photoData = await photoRes.json();
  console.log('Photo Upload Status:', photoRes.status, 'Photo URL:', photoData.url);

  console.log('\n=== 3. Testing Direct Video File Upload (POST /api/upload) ===');
  const videoForm = new FormData();
  videoForm.append('file', new Blob([Buffer.from('fake-mp4-video-stream-bytes-data')], { type: 'video/mp4' }), 'hostel_water_leak.mp4');
  const videoRes = await fetch('http://localhost:4000/api/upload', {
    method: 'POST',
    body: videoForm
  });
  const videoData = await videoRes.json();
  console.log('Video Upload Status:', videoRes.status, 'Video URL:', videoData.url);

  console.log('\n=== 4. Updating Student Avatar with Uploaded Photo URL ===');
  const profileRes = await fetch('http://localhost:4000/api/residents/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ avatarUrl: photoData.url })
  });
  const profileData = await profileRes.json();
  console.log('Profile update status:', profileRes.status, 'Saved Avatar URL:', profileData.user?.avatarUrl);

  console.log('\n=== 5. Submitting Complaint with Direct Photo and Video URLs ===');
  const complaintRes = await fetch('http://localhost:4000/api/complaints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      category: 'WATER',
      title: 'Washroom pipe leakage with video proof',
      description: 'Water leaking heavily from overhead valve since morning.',
      priority: 'HIGH',
      isAnonymous: false,
      photoUrl: photoData.url,
      videoUrl: videoData.url
    })
  });
  const complaintData = await complaintRes.json();
  console.log('Complaint creation status:', complaintRes.status, 'Ticket:', complaintData.ticketNumber);

  console.log('\n=== 6. Fetching Complaints to verify photo & video URLs ===');
  const fetchCmpRes = await fetch('http://localhost:4000/api/complaints', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const allComplaints = await fetchCmpRes.json();
  const created = allComplaints.find(c => c.ticketNumber === complaintData.ticketNumber);
  console.log('Found ticket in database:', created?.ticketNumber);
  console.log('Verified Photo URL:', created?.photoUrl);
  console.log('Verified Video URL:', created?.videoUrl);

  if (created?.photoUrl && created?.videoUrl) {
    console.log('\n>>> ALL DIRECT PHOTO & VIDEO UPLOAD TESTS PASSED SUCCESSFULLY! <<<');
  } else {
    console.error('\nXXX Verification failed! XXX');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
