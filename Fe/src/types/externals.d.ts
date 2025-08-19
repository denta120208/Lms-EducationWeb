declare module '@fullpage/react-fullpage' {
  const ReactFullpage: any;
  export default ReactFullpage;
}

declare module 'gsap' {
  const gsap: any;
  export default gsap;
  export const Power3: any;
}

declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any;
  export default ScrollTrigger;
}

// Globals for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
  const google: any;
}
export {};

