// import AuthModel from "../models/AuthModel.js";

// export class HeaderPresenter {
//   constructor(view) {
//    this.view = view;
//   this.model = new AuthModel();
//   this.notifEnabled = false;

//   this.view.bindLogout(this.handleLogout.bind(this));
//   this.view.bindSkipLink();
//   this.view.bindNotificationToggle(this.handleToggleNotif.bind(this));

//   window.addEventListener("authChanged", () => this.render());
//   this.render();
//   }

//   handleLogout() {
//     this.model.removeToken();
//     this.view.notifyAuthChanged();
//     this.view.redirectToLogin();
//   }

//   render() {
//     const isAuthenticated = this.model.isAuthenticated();
//     this.view.render(isAuthenticated);
//     this.view.bindLogout(this.handleLogout.bind(this));
//     this.view.bindSkipLink();
//   }

//   handleToggleNotif() {
//   if (!("Notification" in window)) {
//     alert("Browser tidak mendukung notifikasi!");
//     return;
//   }

//   if (!this.notifEnabled) {
//     Notification.requestPermission().then(async (permission) => {
//       if (permission === "granted") {
//         this.notifEnabled = true;
//         this.view.updateNotifButtonState(true);
//         this.showNotification("Notifikasi diaktifkan!");

//         const registration = await navigator.serviceWorker.ready;
//         const subscription = await registration.pushManager.subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: this.urlBase64ToUint8Array("BP3Th0X-Kuo_1GQcCohvudoE57rvmWxkMv8xGzbvp2ughW57hvPZirwCprPCPKXgKdMp9RXwVlu7QFmgqHwYMgo")
//         });

//         // await fetch("https://your-api-endpoint/subscribe", {
//         //   method: "POST",
//         //   body: JSON.stringify(subscription),
//         //   headers: { "Content-Type": "application/json" }
//         // });
//       }
//     });
//   } else {
//     this.notifEnabled = false;
//     this.view.updateNotifButtonState(false);
//     alert("Notifikasi dimatikan.");
//   }
// }
// urlBase64ToUint8Array(base64String) {
//   const padding = "=".repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, "+")
//     .replace(/_/g, "/");

//   const rawData = atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }


// showNotification(message) {
//   navigator.serviceWorker.ready.then((registration) => {
//     registration.showNotification("Dicoding Story", {
//       body: message,
//       icon: "/pwa-192x192.png",
//      data: { url: `/` }

//     });
//   });
// }
// }

import AuthModel from "../models/AuthModel.js";

export class HeaderPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthModel();
    this.notifEnabled = false;

    window.addEventListener("authChanged", () => this.render());
    this.render();
  }

  handleLogout() {
    this.model.removeToken();
    this.view.notifyAuthChanged();
    this.view.redirectToLogin();
  }

  render() {
    const isAuthenticated = this.model.isAuthenticated();
    this.view.render(isAuthenticated);
    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindSkipLink();
    this.view.bindNotificationToggle(this.handleToggleNotif.bind(this));
  }

  handleToggleNotif() {
    if (!("Notification" in window)) {
      alert("Browser tidak mendukung notifikasi!");
      return;
    }

    if (!this.notifEnabled) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          this.notifEnabled = true;
          this.view.updateNotifButtonState(true);
          this.showNotification("Notifikasi diaktifkan!");

          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array("BP3Th0X-Kuo_1GQcCohvudoE57rvmWxkMv8xGzbvp2ughW57hvPZirwCprPCPKXgKdMp9RXwVlu7QFmgqHwYMgo")
          });

          // Uncomment and ubah endpoint sesuai server kamu
          // await fetch("https://your-api-endpoint/subscribe", {
          //   method: "POST",
          //   body: JSON.stringify(subscription),
          //   headers: { "Content-Type": "application/json" }
          // });
        }
      });
    } else {
      this.notifEnabled = false;
      this.view.updateNotifButtonState(false);
      alert("Notifikasi dimatikan.");
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  showNotification(message) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("Dicoding Story", {
        body: message,
        icon: "/pwa-192x192.png",
        data: { url: "/" }
      });
    });
  }
}
