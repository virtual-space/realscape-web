
export function initializer(): () => Promise<any> {
  console.log("*** App Init ***");
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp2 called`);
      setTimeout(() => {
        console.log(`initializeApp2 Finished`);
        resolve();
      }, 2000);
    });
  };
}
