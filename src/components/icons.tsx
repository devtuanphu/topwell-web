// Figma v2 UI icons (exported to /public/figma-v2).
export const ICONS = {
  user: '/figma-v2/876d5dd3f96962058f472dc43ea5bb52d5b73219.svg',
  calendar: '/figma-v2/e8af6e5816f095f44cc989c7a449501458e05e0d.svg',
  check: '/figma-v2/4fb8c725e05821b90b18865464c9be6b21237396.svg',
  arrowSmall: '/figma-v2/a7a4d90f504fbe450bf7cc97c11bef2aa249cad4.svg',
  arrowMuted: '/figma-v2/f3a7aa23f0c1f2fd0941d238c1de21a08dba39de.svg',
  arrowAmber: '/figma-v2/9a09eb50d36e57ed6b99b904d14c6bd364f7f2a7.svg',
  quote: '/figma-v2/6fb854d93b0ac94e83474d6d176a928c24da6c88.svg',
  chevronAmber: '/figma-v2/bb5c81f74ac7e5af232adc49f2f2785bd11f6a4a.svg',
  chevronDark: '/figma-v2/ef995b212a2c2200f717a6ca18de175035e63251.svg',
  mail: '/figma-v2/53059b8939d7632fcc5f98bd811df66f7a1ed3d5.svg',
  phone: '/figma-v2/6d4287aefb6413c7657642800336d918825777b3.svg',
  userAmber: '/figma-v2/f47e0f1bf81bb475e180907963c72b1b849cb08d.svg',
  calendarAmber: '/figma-v2/4b996447aabd95756a04c8fb69af81fca22aefa3.svg',
  arrowThinAmber: '/figma-v2/a20748935552fb6f4f227be7ff9d417bd2b71047.svg',
  chevronLeft: '/figma-v2/3bb035f565bb04b2ac40aea4be42d08e076b003a.svg',
  chevronRight: '/figma-v2/39c60327e802d46166d5bd2e822359c7fa70ceea.svg',
  search: '/figma-v2/2d39d4a889df2ce470dea9bbded2470f3ab47778.svg',
  arrowDark: '/figma-v2/fce030b9d9fdf5c166a5d0402546a2fc71459b78.svg',
  userOrange: '/figma-v2/2bc7c879673a57dba1ae60519a910b72f98aef3f.svg',
  calendarOrange: '/figma-v2/c479da68ce3b72a03de1e3d93506a99447f1795f.svg',
  clock: '/figma-v2/e98479330dfaec36e6e7de6daac3332d642d342e.svg',
  calendarMuted: '/figma-v2/4a2964a47def86e92e441ab26af1676061fa34e5.svg',
  facebook: '/figma-v2/367d210bb2914b26e9d8cc689b1edccbfd21d6b8.svg',
  linkedin: '/figma-v2/0001838a355bd7bf61432e381c15ce190c3b0d43.svg',
  link: '/figma-v2/9233cbfdbdd0e150e1af1ce19623b8dc025768f5.svg',
  quoteMark: '/figma-v2/d81df844f81d1cc2389aa51e1d9fae653e65f723.svg',
  arrowLeftDark: '/figma-v2/67e3e155b46e4e028ea6fe21ebb2316775cd7894.svg',
  mailDark: '/figma-v2/2c5a61263087f22aa6ea158f7d12443012a4de39.svg',
  instagramWhite: '/figma-v2/9c2cd70426626285ee8d40c66e6cb2e37886e884.svg',
  pin: '/figma-v2/0bb27aa5e5499500b7837f23747dbb6bf6b612bc.svg',
  star: '/figma-v2/639a760e7420b9b93907da135ee28f232140e1c2.svg',
  heroPrev: '/figma-v2/3a345dec4f5e1615c259a412dded1b5442de380c.svg',
  heroNext: '/figma-v2/dd05f5c3bcb95b6bb0c086c49fbf8b76b3d652e4.svg',
  arrowLongWhite: '/figma-v2/ea4071e4bd12b09228aba98e68cfb3416ea348b1.svg',
  phoneDark: '/figma-v2/f71b94190a9fd4d07ef65016c976b4f6013d5541.svg',
  arrowBlack: '/figma-v2/11c9ca1d6880a1a579c1cec3b58923af5063be91.svg',
  arrowTiny: '/figma-v2/0e5528bf066f5f89f283269fc270b9a1703329c0.svg',
  selectChevron: '/figma-v2/57408c522e0485f8a2fa9d5692c83b31ee6253ff.svg',
};
export function UiIcon({
  name,
  size = 16,
  className,
}: {
  name: keyof typeof ICONS;
  size?: number;
  className?: string;
}) {
  return <img className={className} src={ICONS[name]} width={size} height={size} alt="" />;
}
