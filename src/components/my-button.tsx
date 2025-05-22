import React from 'react'; // It's good practice to import React, though not strictly necessary for functional components in modern React setups

type MyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode; // Use React.ReactNode to allow for more than just strings (e.g., icons, other components)
  variant?: 'default' | 'light'; // Define possible variants
  // Add any other props you might want to pass down, e.g., onClick, type, etc.
  // Example: onClick?: () => void;
  //          className?: string; // If you want to allow external className overrides
};

function Mybutton({ children, variant = 'default', ...props }: MyButtonProps) {
  const baseClasses = "px-6 mx-4 py-2 outline-3 shadow-xl/30 outline-[#0b0b0b] rounded-full  ";

  const defaultVariantClasses = "to-neutral-800 from-zinc-900 bg-gradient-to-t hover:to-neutral-700 hover:from-zinc-800 text-white";
  const lightVariantClasses = "to-neutral-200 from-zinc-100/70 bg-gradient-to-t text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400 text-black"; // Adjust these as per your desired light theme

  const combinedClasses = `${baseClasses} ${
    variant === 'light' ? lightVariantClasses : defaultVariantClasses
  }`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

export default Mybutton;