import { deflate, inflate } from "pako"; // For compression

// Function to decompress from bytes and return the original object
export function decompressFromBytes(compressed: string): Record<string, any> {
    const hexContract = hexToBytes(compressed);
    // Step 1: Decompress the binary data back to JSON string
    const jsonString = inflate(hexContract, { to: "string" });

    // Step 2: Parse the JSON string back to an object
    return JSON.parse(jsonString);
}

// Function to convert hex string back to bytes
function hexToBytes(hexString: string): Uint8Array {
    return Buffer.from(hexString, "hex");
}
