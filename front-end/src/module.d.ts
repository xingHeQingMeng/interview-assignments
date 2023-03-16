declare module '*.scss' {
  interface StyleSheet {
    [key: string]: any;
  }
  const Styles: StyleSheet;
  export default Styles;
}

declare module '*.jpg';
