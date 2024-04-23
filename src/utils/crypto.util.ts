import { AES, enc } from "crypto-js";

export default class MyCipher {
  private keyPrivate: string;
  constructor() {
    if (!process.env.PRIVATE_KEY) {
      throw "key not found!";
    }
    this.keyPrivate = process.env.PRIVATE_KEY;
  }

  encrypt(obj: any) {
    return AES.encrypt(JSON.stringify(obj), this.keyPrivate).toString();
  }

  decrypt(value: string) {
    const decrypt = AES.decrypt(value, this.keyPrivate);
    return decrypt.toString(enc.Utf8);
  }

  myJsonDecrypt(value: string) {
    const decrypt = this.decrypt(value);
    return JSON.parse(decrypt);
  }

  myTokenAsUser(value: string) {
    return this.myJsonDecrypt(value) as { user: string; chave: string };
  }
}
