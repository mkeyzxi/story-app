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

 async handleToggleNotif() {
  if (!("Notification" in window)) {
    alert("Browser tidak mendukung notifikasi!");
    return;
  }

  if (!this.notifEnabled) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Izin notifikasi ditolak.");
      return;
    }

    this.notifEnabled = true;
    this.view.updateNotifButtonState(true);
    this.showNotification("Notifikasi diaktifkan!");

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk")
    });

    // Kirim data subscription ke API Dicoding
    const token = this.model.getToken(); // Ambil token dari AuthModel
    const { endpoint, keys } = subscription.toJSON();

    await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth
        }
      })
    });
  } else {
    // Unsubscribe jika sebelumnya aktif
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const { endpoint } = subscription;
      const token = this.model.getToken();

      await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ endpoint })
      });

      await subscription.unsubscribe();
    }

    this.notifEnabled = false;
    this.view.updateNotifButtonState(false);
    alert("Notifikasi dimatikan.");
  }
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
