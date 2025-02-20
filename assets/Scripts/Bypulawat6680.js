

async function encryptPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 24000,
            hash: "SHA-512"
        },
        keyMaterial,
        {
            name: "AES-CBC",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encodedPassword = encoder.encode(password);
    const encryptedPassword = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        key,
        encodedPassword
    );
    const encryptedArray = new Uint8Array(encryptedPassword);
    let encryptedHex = '';
    encryptedArray.forEach(byte => {
        encryptedHex += byte.toString(16).padStart(2, '0');
    });
    return {
        encryptedPassword: encryptedHex,
        iv: arrayBufferToBase64(iv),
        salt: salt
    };
}
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}
function generateRandomSalt() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function decryptPassword(encryptedPassword, salt, iv, inputPassword) {
    try {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(inputPassword),
            "PBKDF2",
            false,
            ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt),
                iterations: 24000,
                hash: "SHA-512"
            },
            keyMaterial,
            {
                name: "AES-CBC",
                length: 256
            },
            false,
            ["encrypt", "decrypt"]
        );
        const ivArray = base64ToArrayBuffer(iv);
        const encryptedArray = hexStringToUint8Array(encryptedPassword);
        const decryptedPassword = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: ivArray },
            key,
            encryptedArray
        );
        const decoder = new TextDecoder();
        return decoder.decode(decryptedPassword);
    } catch (error) {
        console.error("Decrypting err??!", error);
        return null;
    }
}
function hexStringToUint8Array(hexString) {
    const length = hexString.length / 2;
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return array;
}
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < length; i++) {
        view[i] = binaryString.charCodeAt(i);
    }
    return arrayBuffer;
}