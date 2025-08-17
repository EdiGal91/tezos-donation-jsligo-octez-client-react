import { TezosToolkit } from "@taquito/taquito";
import type { WalletContract } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType, type AccountInfo } from "@airgap/beacon-sdk";

export type Network = "ghostnet" | "mainnet";

export interface ClientOptions {
  rpcUrl: string;
  network: Network;
  contract: string; // KT1...
  appName?: string;
}

export class DonationClient {
  private tezos: TezosToolkit;
  private wallet: BeaconWallet;
  private contract?: WalletContract;
  private pkh?: string;
  private readonly contractAddress: string;
  private readonly network: Network;

  constructor(opts: ClientOptions) {
    this.tezos = new TezosToolkit(opts.rpcUrl);
    this.wallet = new BeaconWallet({
      name: opts.appName ?? "Tezos Donations",
      preferredNetwork: toBeacon(opts.network),
    });
    this.tezos.setWalletProvider(this.wallet);
    this.contractAddress = opts.contract;
    this.network = opts.network;
  }

  async connect(): Promise<{ pkh: string }> {
    await this.wallet.requestPermissions({
      network: { type: toBeacon(this.network) },
    });
    this.pkh = await this.wallet.getPKH();
    return { pkh: this.pkh };
  }

  async disconnect(): Promise<void> {
    await this.wallet.clearActiveAccount();
    delete this.pkh;
  }

  async getPKH(): Promise<string | undefined> {
    if (!this.pkh) {
      const acc: AccountInfo | undefined =
        await this.wallet.client.getActiveAccount();
      if (acc?.address) this.pkh = acc.address;
    }
    return this.pkh;
  }

  private async getContract(): Promise<WalletContract> {
    if (!this.contract) {
      this.contract = await this.tezos.wallet.at(this.contractAddress);
    }
    return this.contract;
  }

  /** Donate in ꜩ */
  async donate(amountTez: number): Promise<string> {
    if (!(amountTez > 0)) throw new Error("Amount must be > 0");
    const c = await this.getContract();
    const op = await (c.methodsObject as any)
      .donate()
      .send({ amount: amountTez });
    await op.confirmation(1);
    return op.opHash;
  }

  /** Withdraw (owner only) in ꜩ */
  async withdraw(amountTez: number): Promise<string> {
    if (!(amountTez > 0)) throw new Error("Amount must be > 0");
    const amountMutez = (amountTez * 1_000_000).toFixed(0);
    const c = await this.getContract();
    const op = await (c.methodsObject as any).withdraw(amountMutez).send();
    await op.confirmation(1);
    return op.opHash;
  }

  async getStorage<T = any>(): Promise<T> {
    const c = await this.getContract();
    return await c.storage<T>();
  }
}

function toBeacon(n: Network): NetworkType {
  return n === "ghostnet" ? NetworkType.GHOSTNET : NetworkType.MAINNET;
}
