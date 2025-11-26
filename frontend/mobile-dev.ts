import { spawn } from "child_process";
import fetch from "node-fetch";
import qr from "qrcode-terminal";

const PORT = 5173;

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

console.log("🚀 Iniciando Vite...");

const vite = spawn("npm", ["run", "dev"], { shell: true });

vite.stdout.on("data", (data: Buffer) => {
    const text = data.toString();
    process.stdout.write(text);

    const clean = text.replace(/\x1b\[[0-9;]*m/g, "");

    if (clean.includes("Network: http")) {
        console.log("\n⏳ Detectado servidor en red, iniciando ngrok en 2 segundos...");
        setTimeout(startNgrok, 2000);
    }
});

vite.stderr.on("data", (data: Buffer) => {
    console.error(data.toString());
});

async function startNgrok() {
    console.log("\n🌐 Iniciando ngrok...");

    spawn("ngrok", ["http", PORT.toString()], { shell: true });

    await wait(2000);

    try {
        const res = await fetch("http://127.0.0.1:4040/api/tunnels");
        const tunnels: any = await res.json();

        const httpsTunnel = tunnels.tunnels.find((t: any) =>
            t.public_url.startsWith("https://")
        );

        if (!httpsTunnel) throw new Error("No se encontró túnel HTTPS");

        const url = httpsTunnel.public_url;

        console.log("\n🟢 URL PÚBLICA LISTA PARA GOOGLE OAUTH:");
        console.log("   " + url);

        console.log("\n👉 AGREGA EN GOOGLE CLOUD:");
        console.log("   Origen autorizado:");
        console.log("     " + url);
        console.log("   URI de redirección autorizada:");
        console.log("     " + url);

        console.log("\n📱 Abre en tu teléfono:");
        console.log("   " + url + "\n");

        // === QR CODE ===
        console.log("📸 Escanea este QR para abrir la app en tu teléfono:\n");
        qr.generate(url, { small: true });

    } catch (err: any) {
        console.error("❌ Error leyendo ngrok:", err.message);
    }
}
