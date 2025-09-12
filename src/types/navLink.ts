// navLinks.ts
export type NavLink = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

export const navLinks: NavLink[] = [
  {
    label: "City Services",
    children: [
      /*
{ label: "City Office", href: "/city-services/city-office" },
      { label: "City Council", href: "/city-services/city-council" },
*/
      { label: "History of Argyle", href: "/city-services/history" },
/*
      {
        label: "Cable TV / Telephone Service",
        href: "/city-services/cable-telephone",
      },
      { label: "Internet Service", href: "/city-services/internet" },
*/
    ],
  },
  {
    label: "Business",
    href: "/business",
  },
  {
    label: "Schools",
    href: "/schools",
    children: [
      { label: "Stephen-Argyle Central", href: "http://www.sac.k12.mn.us/" },
    ],
  },
  {
    label: "Organizations",
    children: [
      /*
{
        label: "Argyle Area Community Foundation",
        href: "/organizations/community-foundation",
      },
*/
      {
        label: "Argyle Fire Department",
        href: "/organizations/argyle-fire-department",
      },
/*
      {
        label: "Argyle Historical Society",
        href: "/organizations/historical-society",
      },
      {
        label: "Argyle’s H.O.P.E. Program",
        href: "/organizations/hope-program",
      },
      { label: "Argyle Lions", href: "/organizations/lions" },
*/
    ],
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
  // {
  //   label: "Photo Galleries",
  //   href: "/photos",
  // },
];
