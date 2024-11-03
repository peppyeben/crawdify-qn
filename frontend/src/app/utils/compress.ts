import { deflate, inflate } from "pako"; // For compression
import { Buffer } from "buffer"; // For handling binary data

// Function to compress and convert to bytes (Uint8Array)
export function compressToBytes(obj: Record<string, any>): string {
    // Step 1: Convert the object to JSON
    const jsonString = JSON.stringify(obj);

    // Step 2: Compress the JSON string to a Uint8Array (using pako)
    const compressed = deflate(jsonString);

    return bytesToHex(compressed); // Return the compressed binary data
}

// Function to convert the bytes to a string (hex)
function bytesToHex(byteArray: Uint8Array): string {
    return Buffer.from(byteArray).toString("hex");
}
