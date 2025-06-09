export const cardVariants = {
  initial: { 
    opacity: 0.8,
    y: 10,
    scale: 0.98
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  hover: {
    scale: 1.01,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
}

export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
} 