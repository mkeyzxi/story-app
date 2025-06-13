// export function createPushButton() {
//   const button = document.createElement('button');
//   button.textContent = 'Aktifkan Notifikasi';
//   button.className = 'fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded';

//   button.addEventListener('click', async () => {
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//       alert('Izin notifikasi ditolak');
//       return;
//     }

//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: 'MASUKKAN_PUBLIC_VAPID_KEY_BASE64'
//     });

//     // Kirim subscription ke server kamu (API kamu)
//     await fetch('https://your-api-endpoint/subscribe', {
//       method: 'POST',
//       body: JSON.stringify(subscription),
//       headers: { 'Content-Type': 'application/json' }
//     });

//     alert('Berhasil berlangganan notifikasi!');
//   });

//   return button;
// }
