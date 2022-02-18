export namespace StringHelpers {

  export const reverse = (text: string) => {
    if (text) {
      return text.split('').reverse().join('');
    }
    //else
    return text;
  }

  export const generateId = (size: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let ret = '';
    while (ret.length < size) {
      ret += chars[Math.floor(Math.random() * chars.length)];
    }
    return ret;
  }


  export const btoa = (text: string) => {
    return Buffer.from(text).toString('base64');
  }

  export const atob = (code: string) => {
    return Buffer.from(code, 'base64').toString();
  }
}