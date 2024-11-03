"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col space-y-4 px-6 pt-8 pb-6">
      <section className="flex justify-start items-center space-x-4">
        <p className="font-medium">Follow us</p>
        <img src="../img/twitter.svg" alt="" className="w-10" />
        <img src="../img/instagram.svg" alt="" className="w-10" />
      </section>
      <hr />
      <section className="flex justify-start items-center space-x-4">
        <p className="font-bold uppercase">crowdify</p>
      </section>
    </footer>
  );
};

export default Footer;
