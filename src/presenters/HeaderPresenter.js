
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

  async render() {
    const isAuthenticated = this.model.isAuthenticated();
    this.view.render(isAuthenticated); 

    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindSkipLink();
    this.view.bindNotificationToggle(this.handleToggleNotif.bind(this));

    await this._checkSubscriptionStatus();
  }

  async _checkSubscriptionStatus() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported in this browser.");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        this.notifEnabled = true;
      } else {
        this.notifEnabled = false;
      }
      this.view.updateNotifButtonState(this.notifEnabled);
    } catch (error) {
      console.error("Error checking push subscription status:", error);
      this.notifEnabled = false;
      this.view.updateNotifButtonState(this.notifEnabled);
    }
  }

  async handleToggleNotif() {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Browser tidak mendukung notifikasi push.");
      return;
    }

    const permission = Notification.permission;
    
    
    let registration;
    let subscription = null;

    try {
      registration = await navigator.serviceWorker.ready; 
      subscription = await registration.pushManager.getSubscription();
    } catch (err) {
      console.error('Error getting service worker registration or subscription:', err);
      alert('Terjadi kesalahan saat memeriksa langganan notifikasi.');
      return;
    }

    const token = this.model.getToken();
    if (!token) {
      this.view.showAlert("Anda harus login untuk mengelola notifikasi.");
      return;
    }

    if (!this.notifEnabled) { 
      if (permission === 'denied') {
        alert("Anda telah menolak izin notifikasi. Mohon ubah di pengaturan browser Anda.");
        return;
      }

      try {
        if (!subscription) { 
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
            ),
          });
        }

        const { endpoint, keys } = subscription.toJSON();
        await ApiService.getSubscribed(token, endpoint, keys);

        this.notifEnabled = true;
        this.view.updateNotifButtonState(true);
        this.showNotification("Notifikasi diaktifkan!");
      } catch (e) {
        console.error("Gagal berlangganan push notification:", e);
        if (Notification.permission === 'denied') {
          alert("Izin notifikasi ditolak. Tidak dapat mengaktifkan notifikasi.");
        } else {
          alert("Gagal mengaktifkan notifikasi. Pastikan Anda online dan coba lagi.");
        }
        this.notifEnabled = false;
        this.view.updateNotifButtonState(false);
      }
    } else { 
      try {
        if (subscription) {
          const { endpoint } = subscription;
          await ApiService.getUnsubscribe(token, endpoint);
          await subscription.unsubscribe();
        }

        this.notifEnabled = false;
        this.view.updateNotifButtonState(false);
        alert("Notifikasi dimatikan.");
      } catch (e) {
        console.error("Gagal berhenti berlangganan push notification:", e);
        alert("Gagal mematikan notifikasi. Coba lagi.");
      }
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