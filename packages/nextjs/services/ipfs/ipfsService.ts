// Pinata IPFS Configuration
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT_KEY;

class IPFSService {
  private pinataBaseUrl = "https://api.pinata.cloud";

  async uploadFile(file: File): Promise<string> {
    try {
      if (!PINATA_JWT) {
        throw new Error("Pinata JWT not configured");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.pinataBaseUrl}/pinning/pinFileToIPFS`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Pinata file upload failed:", error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      if (!PINATA_JWT) {
        throw new Error("Pinata JWT not configured");
      }

      const response = await fetch(`${this.pinataBaseUrl}/pinning/pinJSONToIPFS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: `ProofOfGood-${Date.now()}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Pinata JSON upload failed:", error);
      throw error;
    }
  }

  async uploadProof(proof: { description: string; timestamp: number; files: File[]; metadata?: any }): Promise<string> {
    try {
      const client = this.client || this.fallbackClient;
      if (!client) {
        throw new Error("No IPFS client available");
      }

      // Upload files first
      const fileHashes = await Promise.all(
        proof.files.map(async file => {
          const result = await client.add(file);
          return {
            name: file.name,
            hash: result.cid.toString(),
            size: file.size,
            type: file.type,
          };
        }),
      );

      // Create proof manifest
      const proofManifest = {
        description: proof.description,
        timestamp: proof.timestamp,
        files: fileHashes,
        metadata: proof.metadata || {},
        version: "1.0",
      };

      // Upload manifest
      const manifestResult = await client.add(JSON.stringify(proofManifest));
      return manifestResult.cid.toString();
    } catch (error) {
      console.error("Proof upload failed:", error);
      throw error;
    }
  }

  async retrieveFile(hash: string): Promise<Uint8Array> {
    try {
      const client = this.client || this.fallbackClient;
      if (!client) {
        throw new Error("No IPFS client available");
      }

      const chunks = [];
      for await (const chunk of client.cat(hash)) {
        chunks.push(chunk);
      }

      // Combine chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    } catch (error) {
      console.error("IPFS retrieval failed:", error);
      throw error;
    }
  }

  async retrieveJSON(hash: string): Promise<any> {
    try {
      const data = await this.retrieveFile(hash);
      const jsonString = new TextDecoder().decode(data);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("IPFS JSON retrieval failed:", error);
      throw error;
    }
  }

  getGatewayUrl(hash: string): string {
    // Use Infura IPFS gateway (connected to FileCoin network)
    return `https://ipfs.io/ipfs/${hash}`;
  }

  async pinToFileCoin(hash: string): Promise<boolean> {
    try {
      const client = this.client;
      if (!client) {
        console.warn("No IPFS client available for pinning");
        return false;
      }

      await client.pin.add(hash);
      console.log(`Successfully pinned ${hash} to FileCoin network`);
      return true;
    } catch (error) {
      console.error("FileCoin pinning failed:", error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
export default ipfsService;
