function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function askPermission() {
    const permissionResult = await Notification.requestPermission();

    if (permissionResult !== "granted")
        throw new Error("User didnt grant permission");

    return true;
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register(
            "/service-worker.js"
        );
        console.log("Service worker successfully registered.");
        return registration;
    } catch (err) {
        console.error("Unable to register service worker.", err);
    }
}

async function subscribeUserToPush() {
    return navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
                ),
            };
            return registration.pushManager.subscribe(subscribeOptions);
        });
}

async function init() {
    // Comprobando si el navegador soporta tecnologías necesarias
    if (!("serviceWorker" in navigator)) {
        // Service Worker isn't supported on this browser, disable or hide UI.
        return;
    }

    if (!("PushManager" in window)) {
        // Push isn't supported on this browser, disable or hide UI.
        return;
    }

    const serviceWorkerRegistration = await registerServiceWorker();
    const permission = await askPermission();
    console.log(serviceWorkerRegistration);
    console.log(permission);
    if (!serviceWorkerRegistration || !permission)
        return console.log("No se realizará nada");
    //
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            "BF6SsC23L7Wm0ETm5jhz2CnRg9Cn8e0kkbrtZuM9trbvwDRqIMtxOvzdWi1TgO-FTSY_HjWqJI2nDyQ7d42FZRo"
        ),
    };
    const pushSubscription =
        await serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);
    console.log("Received push subscription: ", JSON.stringify(pushSubscription));
}

init();
