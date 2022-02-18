export namespace StringHelpers {

  export const reverse = (text: string) => {
    if (text) {
      return text.split('').reverse().join('');
    }
    //else
    return text;
  }


}