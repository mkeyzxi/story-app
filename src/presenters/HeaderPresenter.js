import AuthModel from "../models/AuthModel.js";
import ApiService from "../services/ApiService.js";

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

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Izin notifikasi ditolak.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const token = this.model.getToken();

    if (!this.notifEnabled) {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
        ),
      });

      const { endpoint, keys } = subscription.toJSON();
      await ApiService.getSubscribed(token, endpoint, keys);

      this.notifEnabled = true;
      this.view.updateNotifButtonState(true);
      this.showNotification("Notifikasi diaktifkan!");
    } else {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const { endpoint } = subscription;
        await ApiService.getUnsubscribe(token, endpoint, subscription.toJSON().keys);
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
        data: { url: "/" },
      });
    });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
